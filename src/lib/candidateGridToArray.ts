import { CandidateGrid } from 'types'
import { boxes, cells, cols, rows } from './constants'

export const candidateGridToArray = (candidateGrid: CandidateGrid) =>
  cells.flatMap(
    cell =>
      candidateGrid[cell]?.map(value => ({
        cell,
        value,
        row: rows[cell],
        col: cols[cell],
        box: boxes[cell],
      })) ?? []
  )
