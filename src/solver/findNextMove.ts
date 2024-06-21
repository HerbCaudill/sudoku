import { Board } from './Board'
import { strategiesByDifficulty, type CellCandidate, type strategies } from './strategies'

export const findNextMove = (board: Board): Move => {
  if (board.isSolved()) {
    throw new Error('Board is solved')
  }
  for (const strategy of strategiesByDifficulty) {
    const result = strategy(board)
    if (result && ('solved' in result || result.removals.length)) {
      return {
        ...strategy,
        ...result,
      }
    }
  }
  return { label: 'No moves found', matches: [], removals: [] } as Move
}

export type Move = {
  label: keyof typeof strategies
  difficulty?: number
  solved?: CellCandidate
  matches: CellCandidate[]
  removals: CellCandidate[]
}

export function* solve(board: Board): Generator<{ board: Board; move?: Move }> {
  while (!board.isSolved()) {
    const move = findNextMove(board)
    board = board.applyMove(move)
    yield { board, move }
  }

  return { board }
}
