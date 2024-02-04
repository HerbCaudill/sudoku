import { cells, numbers } from './constants.js'
import { peers } from './peers.js'
import { CandidateGrid, Grid, SingleMap } from './types.js'
import { LogicalSolver } from './LogicalSolver.js'

export const getCandidates = (grid: Grid) => {
  return new LogicalSolver(grid).calculate()
}

export const getGridCandidates = (grid: Grid) =>
  cells.reduce<CandidateGrid>((result, i) => {
    if (grid[i] !== 0) {
      return { ...result, [i]: [grid[i]] }
    } else {
      return { ...result, [i]: getCellCandidates(grid, i) }
    }
  }, {})

const getCellCandidates = (grid: Grid, index: number) => {
  const peerHas = (value: number) => (peer: number) => grid[peer] === value
  return numbers.filter(value => !peers[index].some(peerHas(value)))
}

export const isSolved = (candidates: CandidateGrid) => cells.every(index => candidates[index].length === 1)
