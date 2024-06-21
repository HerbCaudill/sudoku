import type { Board } from './Board'
import { type Move, findNextMove } from './findNextMove'

export function* solve(board: Board): Generator<{ board: Board; move?: Move }> {
  while (!board.isSolved()) {
    const move = findNextMove(board)
    board = board.applyMove(move)
    yield { board, move }
  }

  return { board }
}
