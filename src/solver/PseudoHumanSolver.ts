import { makeRandom } from '@herbcaudill/random'
import { Board } from './Board'
import { type Move } from './findNextMove'

const random = makeRandom('solver')

export const solve = (grid: string) => {
  const startingBoard = new Board({ grid })
  let moves = 0
  let currentBoard = startingBoard
  for (const { board, solved } of search(startingBoard)) {
    currentBoard = board
    moves += 1
    if (moves > 100000) break // give up
    if (solved === true) return currentBoard.grid
  }
  return false
}

export function* search(board: Board): Generator<Step> {
  // get as far as possible using strategies
  while (true) {
    if (board.isSolved()) yield { board, solved: true }
    const move = board.findNextMove()
    if (move === false) break // no move found
    board = board.applyMove(move)
    yield { board, move }
  }

  // choose a random unsolved cell with the fewest candidates
  const unsolved = random.shuffle(board.unsolvedCells())
  const index = unsolved.reduce(
    (min, i) => (board.candidates[i].length < board.candidates[min].length ? i : min),
    unsolved[0]
  )

  const candidates = random.shuffle(board.candidates[index])
  for (const value of candidates) {
    yield { board, guess: { index, value } }

    // make a new board with this value filled in
    const nextBoard = board.setCell(index, value)

    // recursively continue the search, yielding interim results as we go
    for (const step of search(nextBoard)) yield step
  }

  // none of the candidates for this cell worked - backtrack
  yield { board, solved: false }
}

type Guess = {
  index: number
  value: number
}

export type Step = {
  board: Board
  solved?: boolean
  move?: Move
  guess?: Guess
}
