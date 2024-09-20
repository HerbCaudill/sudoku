import { Board } from './Board'
import { strategiesByDifficulty, type CellCandidate, type strategies } from './strategies'

const NO_MOVES = 'No moves found'

export const findNextMove = (board: Board): Move => {
  if (board.isSolved()) throw new Error('Board is solved')

  for (const strategy of strategiesByDifficulty) {
    const result = strategy(board)
    if (result && ('solved' in result || result.removals.length)) {
      return { ...strategy, ...result }
    }
  }

  return { label: NO_MOVES } as Move
}

export type Success = {
  label: keyof typeof strategies
  difficulty: number
  solved?: CellCandidate
  matches: CellCandidate[]
  removals: CellCandidate[]
}

export type Failure = {
  label: typeof NO_MOVES
}

export type Move = Success | Failure

export const isFailure = (move: Move): move is Failure => move.label === NO_MOVES
