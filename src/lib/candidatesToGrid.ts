import { CandidateGrid } from 'types'
import { cells } from './constants'

export const candidatesToGrid = (candidateGrid: CandidateGrid) =>
  cells.map(i => (candidateGrid[i]?.length === 1 ? candidateGrid[i][0] : 0))
