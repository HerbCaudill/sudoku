import { rowPeers, colPeers, boxPeers } from './peers.js'
import { CandidateGrid } from '../types.js'
import { SingleMap } from '../types.js'

// HELPERS
const nakedSingles = (candidates: CandidateGrid) => {
  const unsolved = Object.keys(candidates).map(Number)
  return Object.fromEntries(
    unsolved //
      .filter(index => candidates[index].length === 1)
      .map(index => [index, candidates[index][0]])
  ) as SingleMap
}
const hiddenSingles = (peers: number[][]) => (candidates: CandidateGrid) => {
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
export const allSingles = (candidates: CandidateGrid) => {
  return {
    ...nakedSingles(candidates),
    ...hiddenSingles(rowPeers)(candidates),
    ...hiddenSingles(colPeers)(candidates),
    ...hiddenSingles(boxPeers)(candidates),
  } as SingleMap
}
