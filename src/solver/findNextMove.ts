import { Board } from './Board'
import { strategiesByDifficulty, type CellCandidate, type strategies } from './strategies'

export const findNextMove = (board: Board): Move | false => {
  if (board.isSolved()) return false //throw new Error('Board is solved')

  for (const strategy of strategiesByDifficulty) {
    const result = strategy(board)
    if (result && ('solved' in result || result.removals.length)) {
      return { ...strategy, ...result }
    }
  }

  // no moves found
  return false
}

export type Move = {
  // strategy
  label: keyof typeof strategies
  difficulty: number
  // result
  solved?: CellCandidate
  matches: CellCandidate[]
  removals: CellCandidate[]
}
