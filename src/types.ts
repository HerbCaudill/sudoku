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
