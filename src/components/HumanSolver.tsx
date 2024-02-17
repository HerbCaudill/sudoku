import { useReducer, useState } from 'react'
import { useKeyboard } from '../hooks/useKeyboard'
import { CandidateGrid, Grid, numbers } from '../solver'
import { Puzzle } from './Puzzle'
import { RadioGroup } from './RadioGroup'

type Action =
  | { type: 'SET_VALUE'; i: number; value: number }
  | { type: 'ADD_CANDIDATE'; i: number; candidate: number }
  | { type: 'REMOVE_CANDIDATE'; i: number; candidate: number }
  | { type: 'UNDO' }
  | { type: 'REDO' }

type State = {
  grid: Grid
  candidates: CandidateGrid
  history: State[]
  future: State[]
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_VALUE': {
      // set value
      const newGrid = [...state.grid]
      newGrid[action.i] = action.value

      // remove candidates
      const newCandidates = { ...state.candidates }
      delete newCandidates[action.i]

      return { ...state, grid: newGrid, candidates: newCandidates, history: [state, ...state.history], future: [] }
    }
    case 'ADD_CANDIDATE': {
      const { i, candidate } = action
      const candidates = { ...state.candidates }
      if (candidates[i]?.includes(candidate)) return state // don't add if already present
      candidates[i] = [...(candidates[i] ?? []), candidate]
      const history = [state, ...state.history]
      return { ...state, candidates, history, future: [] }
    }
    case 'REMOVE_CANDIDATE': {
      const { i, candidate } = action
      const candidates = { ...state.candidates }
      if (!candidates[i]?.includes(candidate)) return state // don't remove if not present
      candidates[i] = candidates[i].filter((n: number) => n !== candidate)
      const history = [state, ...state.history]
      return { ...state, candidates, history, future: [] }
    }
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
    default:
      return state
  }
}

export const HumanSolver = ({ puzzle, solution }: { puzzle: Grid; solution: Grid }) => {
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

  const onSetValue = (i: number) => {
    if (puzzle[i]) return // can't change fixed cells
    const value = state.grid[i] === number ? 0 : number
    dispatch({ type: 'SET_VALUE', i: i, value })
  }

  const toggleCandidate = (type: 'ADD_CANDIDATE' | 'REMOVE_CANDIDATE') => (i: number) => {
    if (puzzle[i]) return // can't change fixed cells
    if (state.grid[i] > 0) return // can't add candidates to cells with values
    dispatch({ type, i: i, candidate: number })
  }

  return (
    <>
      <Puzzle
        puzzle={puzzle}
        grid={state.grid}
        candidates={state.candidates}
        onSetValue={onSetValue}
        onAddCandidate={toggleCandidate('ADD_CANDIDATE')}
        onRemoveCandidate={toggleCandidate('REMOVE_CANDIDATE')}
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
    </>
  )
}
