import { Board } from 'solver/Board'
import { stringToCandidates } from './stringToCandidates'

export const stringToBoard = (s: string): Board => {
  const candidates = stringToCandidates(s)
  return new Board({ candidates })
}
