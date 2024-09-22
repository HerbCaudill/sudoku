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
  let i = 0
  let difficulty = 0
  const solver = solve(board)
  for (const { board, move } of solver) {
    i++
    if (!move) continue // done
    if (isFailure(move)) {
      const remaining = board.unsolvedCells().length
      return { solved: false, difficulty, remaining, board }
    } else {
      difficulty += move.difficulty
    }
  }
  return { solved: true, difficulty, board }
}
