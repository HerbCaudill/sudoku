import { Grid } from './types.js'
import { CandidateGrid } from './Puzzle.js'
import { getGridCandidates } from './getGridCandidates.js'
import { boxPeers, colPeers, rowPeers } from './peers.js'

export const getSquareSingles = (grid: Grid, candidates: CandidateGrid = getGridCandidates(grid)) => {
  const unsolvedSquares = Object.keys(candidates).map(Number)

  return Object.fromEntries(
    unsolvedSquares //
      .filter(index => candidates[index].length === 1)
      .map(index => [index, candidates[index][0]])
  ) as SingleMap
}

export const getUnitSingles =
  (unitPeers: number[][]) =>
  (grid: Grid, candidates: CandidateGrid = getGridCandidates(grid)) => {
    const unsolvedSquares = Object.keys(candidates).map(Number)

    const rowSingles = (index: number) => {
      const hasMatch = (candidate: number) => (square: number) => {
        const squareCandidates = candidates[square] ?? []
        return squareCandidates.includes(candidate)
      }

      const single = candidates[index].find(candidate => {
        return !unitPeers[index].some(hasMatch(candidate))
      })

      return [index, single]
    }

    return Object.fromEntries(
      unsolvedSquares //
        .map(rowSingles)
        .filter(([_, single]) => single) // only include squares with singles
    ) as SingleMap
  }

export const getRowSingles = getUnitSingles(rowPeers)
export const getColSingles = getUnitSingles(colPeers)
export const getBoxSingles = getUnitSingles(boxPeers)

export const getAllSingles = (grid: Grid, candidates: CandidateGrid = getGridCandidates(grid)) => {
  return {
    ...getSquareSingles(grid, candidates),
    ...getRowSingles(grid, candidates),
    ...getColSingles(grid, candidates),
    ...getBoxSingles(grid, candidates),
  } as SingleMap
}

type SingleMap = { [index: number]: number }
