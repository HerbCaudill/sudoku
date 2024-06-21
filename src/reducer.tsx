import { Action, Grid, State } from './types'
import { numbers, Solver } from './solver'

export const reducer = (state: State, action: Action): State => {
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

    case 'LOAD': {
      const { puzzle } = action
      const grid = [...puzzle]
      const solver = new Solver(puzzle)
      const solution = solver.solve() as Grid // we know it has a solution
      const candidates = {}
      return updateState({ grid, solution, candidates, index: -1 })
    }

    case `SET_CANDIDATES`: {
      const { candidates } = action
      return updateState({ candidates, index: -1 })
    }
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
      const initialState = state.history.pop()!!!!!! // 😅
      return { ...initialState }
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

export const getInitialState = () => {
  const initialState: State = {
    grid: [],
    solution: [],
    candidates: {},
    index: -1,
    history: [],
    future: [],
  }
  initialState.history = [initialState]
  return initialState
}
