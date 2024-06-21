import { Board } from './Board'
import { strategiesByDifficulty, type CellCandidate, type strategies } from './strategies'

export const findNextMove = (board: Board): Move => {
  for (const strategy of strategiesByDifficulty) {
    const result = strategy(board)
    if (result && ('solved' in result || result.removals.length)) {
      return { strategy: strategy.label, difficulty: strategy.difficulty, ...result }
    }
  }
  throw new Error('No moves found')
}

export type Move = {
  strategy: keyof typeof strategies
  difficulty: number
  solved?: CellCandidate
  matches: CellCandidate[]
  removals: CellCandidate[]
}

export const solve = (board: Board) => {
  // generator
}
