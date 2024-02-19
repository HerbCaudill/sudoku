import { useEffect, useReducer, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { CandidateGrid, Grid, numbers } from '../solver'
import { Puzzle } from './Puzzle'
import { RadioGroup } from './RadioGroup'
import { Confetti } from './Confetti'

const numberKeys = numbers.map(n => n.toString())

export const HumanSolver = ({ puzzle, solution, onNewGame }: Props) => {
  // STATE

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
        const { index: i, value } = action

        // set value
        const grid = [...state.grid]
        grid[i] = value

        // remove candidates
        const candidates = { ...state.candidates }
        delete candidates[i]

        return updateState({ grid, candidates, index: i })
      }

      case 'ADD': {
        const { index, candidate } = action
        const candidates = { ...state.candidates }
        const cell = candidates[index] ?? []
        if (cell.includes(candidate)) return state // don't add if already present

        // add candidate
        candidates[index] = [...cell, candidate]

        return updateState({ candidates, index: 0 })
      }

      case 'REMOVE': {
        const { index, candidate } = action
        const candidates = { ...state.candidates }
        const cell = candidates[index] ?? []
        if (!cell.includes(candidate)) return state // don't remove if not present

        // remove candidate
        candidates[index] = cell.filter(n => n !== candidate)

        return updateState({ candidates, index: 0 })
      }

      case 'RESET': {
        return updateState({ grid: puzzle, candidates: {}, history: [], future: [] })
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
    index: -1,
    history: [],
    future: [],
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    dispatch({ type: 'RESET' })
  }, [puzzle, solution])

  const [number, setNumber] = useState(1)

  const isSolved // state.grid.every((value, i) => value === solution[i])

  // HOTKEYS

  useHotkeys(['space', 'right'], e => {
    e.preventDefault()
    nextNumber()
  })
  useHotkeys(['shift+space', 'left'], e => {
    e.preventDefault()
    prevNumber()
  })
  useHotkeys(['mod+z', 'z'], () => dispatch({ type: 'UNDO' }))
  useHotkeys(['mod+y', 'y'], () => dispatch({ type: 'REDO' }))
  useHotkeys(['mod+backspace'], e => dispatch({ type: 'RESET' }))
  useHotkeys(numberKeys, (e, { keys }) => {
    const numberKey = +keys!.join('')
    setNumber(numberKey)
  })

  // HELPERS

  const setValue = (index: number) => {
    if (puzzle[index]) return // can't change fixed cells
    const value = state.grid[index] === number ? 0 : number // toggle between value & blank
    dispatch({ type: 'SET', index, value })
  }

  const toggle = (type: 'ADD' | 'REMOVE') => (index: number) => {
    if (puzzle[index]) return // can't change fixed cells
    if (state.grid[index] > 0) return // can't add candidates to cells with values
    dispatch({ type, index, candidate: number })
  }

  const nextNumber = () => setNumber(n => (n === 9 ? 1 : n + 1))
  const prevNumber = () => setNumber(n => (n === 1 ? 9 : n - 1))

  return (
    <div className="flex flex-col gap-4 h-full">
      <Puzzle
        puzzle={puzzle}
        solution={solution}
        grid={state.grid}
        candidates={state.candidates}
        // index={state.index}
        onSetValue={setValue}
        onAddCandidate={toggle('ADD')}
        onRemoveCandidate={toggle('REMOVE')}
        selectedNumber={number}
      />
      {isSolved ? (
        <>
          <Confetti />
          {/* <div className="bg-white rounded-md border w-1/2  border-black text-lg px-4 py-4 flex flex-col items-center justify-center mx-auto animate-celebrate">
            <div>
              <p className="animate-celebrate">🎉 🎉 🎉</p>
              <p>Solved!</p>
            </div>
          </div> */}

          <div className="flex items-center w-full justify-center">
            <button className="button button-lg" onClick={onNewGame}>
              <IconRefresh className="h-4 w-4" />
              New game
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4 grow bg-yellow-500">
          {/* Numbers 1-9 */}
          <RadioGroup
            value={number}
            onChange={n => setNumber(n)}
            size="xs"
            options={numbers}
            className="w-full"
            optionClassName="grow text-[3cqw] py-[2cqw]"
          />
          {/* next/prev number */}
          <div className="grow">
            <div className="flex flex-row w-full gap-2">
              <button className="button button-lg grow" onClick={prevNumber}>
                <IconArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button className="button button-lg grow" onClick={nextNumber}>
                <IconArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          {/* undo/redo/reset */}
          <div className="flex flex-row gap-2">
            <button className="button button-lg" title="Undo" onClick={() => dispatch({ type: 'UNDO' })}>
              <IconArrowBackUp className="h-4 w-4" aria-hidden="true" />
            </button>
            <button className="button button-lg" title="Redo" onClick={() => dispatch({ type: 'REDO' })}>
              <IconArrowForwardUp className="h-4 w-4" aria-hidden="true" />
            </button>
            <button className="button button-lg" title="Reset" onClick={() => dispatch({ type: 'RESET' })}>
              <IconTrash className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

type Action =
  | { type: 'SET'; index: number; value: number }
  | { type: 'ADD'; index: number; candidate: number }
  | { type: 'REMOVE'; index: number; candidate: number }
  | { type: 'RESET' }
  | { type: 'UNDO' }
  | { type: 'REDO' }

type State = {
  grid: Grid
  candidates: CandidateGrid
  index: number
  history: State[]
  future: State[]
}

type Props = {
  puzzle: Grid
  solution: Grid
  onNewGame: () => void
}
