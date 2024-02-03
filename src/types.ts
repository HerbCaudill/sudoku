import { makeRandom } from '@herbcaudill/random'

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
