import { makeRandom } from '@herbcaudill/random'
import type { CellCandidate } from 'solver/strategies'

export type Grid = number[]

export type Random = ReturnType<typeof makeRandom>

export type AnalysisResult = (
  | {
      solved: true
      solution: Grid
      error?: undefined
    }
  | {
      solved: false
      solution?: undefined
      error: string
    }
) & {
  steps: number
  backtracks: number
  guesses: number
  time: number
}

export type CandidateGrid = Record<number, number[]>
export type SingleMap = { [index: number]: number }

export type Candidate = {
  cell: number // 0-81
  value: number // 1-9
  row: number // 1-9
  col: number // 1-9
  box: number // 1-9
}

export type SolverState =
  | 'GUESSING'
  | 'PROPAGATING'
  | 'DONE PROPAGATING'
  | 'CONTRADICTION'
  | 'SOLVED'
  | 'NO SOLUTION'
  | 'GIVING UP'

export type InterimResult = {
  grid: Grid
  candidates?: CandidateGrid
  state: SolverState
  /** index of the cell that was just set */
  index?: number
  /** value of the cell that was just set */
  value?: number
}

export type Icon = (props: React.SVGProps<SVGSVGElement>) => React.ReactElement

// REDUCER

export type Action =
  | { type: 'LOAD'; puzzle: Grid }
  | { type: 'SET_CANDIDATES'; candidates: CandidateGrid }
  | { type: 'SET'; index: number; value: number }
  | { type: 'ADD'; index: number; candidate: number }
  | { type: 'REMOVE'; index: number; candidate: number }
  | { type: 'RESET' }
  | { type: 'UNDO' }
  | { type: 'REDO' }

export type State = {
  grid: Grid
  solution: Grid
  candidates: CandidateGrid
  index: number
  history: State[]
  future: State[]
}
