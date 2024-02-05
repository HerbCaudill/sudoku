import { rowPeers, colPeers, boxPeers } from './peers.js'
import { CandidateGrid } from './types.js'

export const nakedSingles = (candidates: CandidateGrid) => {
  const unsolved = Object.keys(candidates).map(Number)
  return Object.fromEntries(
    unsolved //
      .filter(index => candidates[index].length === 1)
      .map(index => [index, candidates[index][0]])
  ) as SingleMap
}

export const hiddenSingles = (peers: number[][]) => (candidates: CandidateGrid) => {
  const unsolved = Object.keys(candidates).map(Number)
  return Object.fromEntries(
    unsolved
      .map(index => {
        const noPeerHasValue = (v: number) => !peers[index].some(i => candidates[i]?.includes(v))
        const single = candidates[index].find(noPeerHasValue)
        if (single) return [index, single]
      })
      .filter(Boolean) as [number, number][] // omit undefined
  ) as SingleMap
}

export const rowSingles = hiddenSingles(rowPeers)
export const colSingles = hiddenSingles(colPeers)
export const boxSingles = hiddenSingles(boxPeers)

export const allSingles = (candidates: CandidateGrid) => {
  return {
    ...nakedSingles(candidates),
    ...rowSingles(candidates),
    ...colSingles(candidates),
    ...boxSingles(candidates),
  } as SingleMap
}

export type SingleMap = { [index: number]: number }
