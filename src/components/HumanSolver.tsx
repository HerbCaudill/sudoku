import { useReducer, useState } from 'react'
import { useKeyboard } from '../hooks/useKeyboard'
import { CandidateGrid, Grid, numbers } from '../solver'
import { Puzzle } from './Puzzle'
import { RadioGroup } from './RadioGroup'

export const HumanSolver = ({ puzzle, solution }: Props) => {
  const reducer = (state: State, action: Action): State => {
    const updateState = (newState: Partial<State>) => {
      return {
        ...state,
        ...newState,
        history: [state, ...state.history], // add the previous state to the history
        future: [], // new actions reset the redo stack
      }
    }

    switch (action.type) {
      // STATE UPDATES

      case 'SET': {
        const { i, value } = action

        // set value
        const grid = [...state.grid]
        grid[i] = value

        // remove candidates
        const candidates = { ...state.candidates }
        delete candidates[i]

        return updateState({ grid, candidates })
      }

      case 'ADD': {
        const { i, candidate } = action
        const candidates = { ...state.candidates }
        const cell = candidates[i] ?? []
        if (cell.includes(candidate)) return state // don't add if already present

        // add candidate
        candidates[i] = [...cell, candidate]

        return updateState({ candidates })
      }

      case 'REMOVE': {
        const { i, candidate } = action
        const candidates = { ...state.candidates }
        const cell = candidates[i] ?? []
        if (!cell.includes(candidate)) return state // don't remove if not present

        // remove candidate
        candidates[i] = cell.filter(n => n !== candidate)

        return updateState({ candidates })
      }

      case 'RESET': {
        return updateState({ grid: puzzle, candidates: {} })
      }

      // UNDO/REDO

      case 'UNDO': {
        if (!state.history.length) return state

        const [prevState, ...history] = state.history
        const future = [state, ...state.future]
        return { ...prevState, history, future }
      }

      case 'REDO': {
        if (!state.future.length) return state

        const [nextState, ...future] = state.future
        const history = [state, ...state.history]
        return { ...nextState, history, future }
      }
    }
  }

  const initialState = {
    grid: puzzle,
    candidates: {},
    history: [],
    future: [],
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  const [number, setNumber] = useState(1)

  useKeyboard(({ key }: KeyboardEvent) => {
    switch (key) {
      case 'ArrowLeft':
        setNumber(n => (n === 1 ? 9 : n - 1))
        break

      case 'ArrowRight':
      case ' ':
        setNumber(n => (n === 9 ? 1 : n + 1))
        break

      case 'z':
        dispatch({ type: 'UNDO' })
        break

      case 'y':
        dispatch({ type: 'REDO' })
        break
    }
  })

  const setValue = (i: number) => {
    if (puzzle[i]) return // can't change fixed cells
    const value = state.grid[i] === number ? 0 : number // toggle between value & blank
    dispatch({ type: 'SET', i: i, value })
  }

  const toggle = (type: 'ADD' | 'REMOVE') => (i: number) => {
    if (puzzle[i]) return // can't change fixed cells
    if (state.grid[i] > 0) return // can't add candidates to cells with values
    dispatch({ type, i: i, candidate: number })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2">
        <button className="button button-xs" title="Undo" onClick={() => dispatch({ type: 'UNDO' })}>
          <IconArrowBackUp className="h-4 w-4" aria-hidden="true" />
        </button>
        <button className="button button-xs" title="Redo" onClick={() => dispatch({ type: 'REDO' })}>
          <IconArrowForwardUp className="h-4 w-4" aria-hidden="true" />
        </button>
        <button className="button button-xs" title="Reset" onClick={() => dispatch({ type: 'RESET' })}>
          <IconTrash className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <Puzzle
        puzzle={puzzle}
        solution={solution}
        grid={state.grid}
        candidates={state.candidates}
        onSetValue={setValue}
        onAddCandidate={toggle('ADD')}
        onRemoveCandidate={toggle('REMOVE')}
        selectedNumber={number}
      />

      {/* Numbers 1-9 */}
      <RadioGroup
        value={number}
        onChange={n => setNumber(n)}
        size="xs"
        options={numbers}
        className="w-full"
        optionClassName="grow text-[3cqw] py-[2cqw]"
      />
    </div>
  )
}

type Action =
  | { type: 'SET'; i: number; value: number }
  | { type: 'ADD'; i: number; candidate: number }
  | { type: 'REMOVE'; i: number; candidate: number }
  | { type: 'RESET' }
  | { type: 'UNDO' }
  | { type: 'REDO' }

type State = {
  grid: Grid
  candidates: CandidateGrid
  history: State[]
  future: State[]
}

type Props = {
  puzzle: Grid
  solution: Grid
}
