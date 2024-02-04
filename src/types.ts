import { makeRandom } from '@herbcaudill/random'
import { Grid } from './types.js'

// prettier-ignore
export type Grid = [
  number, number, number, number, number, number, number, number, number,
  number, number, number, number, number, number, number, number, number,
  number, number, number, number, number, number, number, number, number,
  number, number, number, number, number, number, number, number, number,
  number, number, number, number, number, number, number, number, number,
  number, number, number, number, number, number, number, number, number,
  number, number, number, number, number, number, number, number, number,
  number, number, number, number, number, number, number, number, number,
  number, number, number, number, number, number, number, number, number
]

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
