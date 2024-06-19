import { Board } from '../Board'
import { CandidateGrid } from 'types'

export const toCandidateGrid = (s: string): CandidateGrid => {
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

export const toBoard = (s: string): Board => {
  const candidates = toCandidateGrid(s)
  return new Board(candidates)
}
