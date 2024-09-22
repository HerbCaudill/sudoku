import { Board } from 'solver/Board'
import { search } from 'solver/PseudoHumanSolver'

export const analyze = (grid: string) => {
  const startingBoard = new Board({ grid })
  let difficulty = 0
  let backtracks = 0
  let moves = 0
  for (const { board, move, solved } of search(startingBoard)) {
    moves += 1
    if (moves > 100000) break // give up
    if (solved === true) return { solved: true, moves, difficulty, backtracks } // solved
    if (solved === false) backtracks += 1
    if (move) difficulty += move.difficulty
  }
  return { solved: false, moves, difficulty, backtracks } // give up
}
