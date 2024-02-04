import { Grid } from './types.js'
import { CandidateGrid } from './types.js'
import { getCandidates } from './getCandidates.js'
import { boxPeers, colPeers, rowPeers } from './peers.js'

export const getCellSingles = (grid: Grid, candidates: CandidateGrid = getCandidates(grid)) => {
  const unsolvedCells = Object.keys(candidates).map(Number)

  return Object.fromEntries(
    unsolvedCells //
      .filter(index => candidates[index].length === 1)
      .map(index => [index, candidates[index][0]])
  ) as SingleMap
}

export const getUnitSingles =
  (unitPeers: number[][]) =>
  (grid: Grid, candidates: CandidateGrid = getCandidates(grid)) => {
    const unsolvedCells = Object.keys(candidates).map(Number)

    const rowSingles = (index: number) => {
      const hasMatch = (candidate: number) => (cell: number) => {
        const cellCandidates = candidates[cell] ?? []
        return cellCandidates.includes(candidate)
      }

      const single = candidates[index].find(candidate => {
        return !unitPeers[index].some(hasMatch(candidate))
      })

      return [index, single]
    }

    return Object.fromEntries(
      unsolvedCells //
        .map(rowSingles)
        .filter(([_, single]) => single) // only include cells with singles
    ) as SingleMap
  }

export const getRowSingles = getUnitSingles(rowPeers)
export const getColSingles = getUnitSingles(colPeers)
export const getBoxSingles = getUnitSingles(boxPeers)

export const getAllSingles = (grid: Grid, candidates: CandidateGrid = getCandidates(grid)) => {
  return {
    ...getCellSingles(grid, candidates),
    ...getRowSingles(grid, candidates),
    ...getColSingles(grid, candidates),
    ...getBoxSingles(grid, candidates),
  } as SingleMap
}

type SingleMap = { [index: number]: number }
