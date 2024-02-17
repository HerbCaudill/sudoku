import { makeRandom } from '@herbcaudill/random'

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
  time: number
}

export type CandidateGrid = Record<number, number[]>
export type SingleMap = { [index: number]: number }

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
