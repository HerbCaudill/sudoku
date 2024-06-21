import { peers } from '../peers'
import { Board } from '../Board'
import { CandidateGrid, type Grid } from 'types'
import { numbers } from '../constants'

export const stringToCandidates = (s: string): CandidateGrid => {
  const grid = {} as CandidateGrid
  for (const [i, cell] of s.trim().split(/\s+/).entries()) {
    if (cell !== '.') {
      grid[i] = cell.split('').map(Number)
    } else {
      grid[i] = []
    }
  }
  return grid
}

export const stringToBoard = (s: string): Board => {
  const candidates = stringToCandidates(s)
  return new Board({ candidates })
}

export const boardFromGrid = (grid: Grid) => {
  const candidates = gridToCandidates(grid)
  return new Board({ candidates })
}

export const gridToCandidates = (grid: Grid) =>
  Object.fromEntries(
    grid.map((value, i) => {
      // if the cell is already solved, return the value
      if (value > 0) return [i, [value]]
      // find candidates for each unsolved cell
      const noMatchingPeer = (v: number) => !peers[i].some(peer => grid[peer] === v)
      return [i, numbers.filter(noMatchingPeer)]
    })
  )
