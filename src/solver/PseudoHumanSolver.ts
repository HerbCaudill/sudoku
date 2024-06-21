import type { Board } from './Board'
import { type Move, findNextMove, isFailure } from './findNextMove'

export function* solve(board: Board): Generator<{ board: Board; move?: Move }> {
  while (!board.isSolved()) {
    const move = findNextMove(board)
    board = board.applyMove(move)
    yield { board, move }
  }

  return { board }
}

export const tryToSolve = (board: Board) => {
  const solver = solve(board)
  for (const { board, move } of solver) {
    if (isFailure(move!)) return { solved: false, board }
  }
  return { solved: true, board }
}
