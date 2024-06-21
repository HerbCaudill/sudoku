import { Board } from './Board'
import { strategiesByDifficulty, type CellCandidate, type strategies } from './strategies'

export const findNextMove = (board: Board): SolvedCellMove | EliminationMove => {
  for (const strategy of strategiesByDifficulty) {
    const result = strategy(board)
    if (result && (!('removals' in result) || result.removals.length)) {
      return { strategy: strategy.label, difficulty: strategy.difficulty, ...result }
    }
  }
  throw new Error('No moves found')
}

export type SolvedCellMove = {
  strategy: keyof typeof strategies
  difficulty: number
  solved: CellCandidate
}
export type EliminationMove = {
  strategy: keyof typeof strategies
  difficulty: number
  matches: CellCandidate[]
  removals: CellCandidate[]
}
