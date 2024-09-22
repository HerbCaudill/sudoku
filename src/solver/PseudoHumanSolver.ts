import { makeRandom } from '@herbcaudill/random'
import type { Board } from './Board'
import { type Move } from './findNextMove'
import { peers } from 'lib/peers'

const random = makeRandom('solver')

export function* solve(board: Board): Generator<Step> {
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
    for (const step of solve(nextBoard)) yield step
  }

  // none of the candidates for this cell worked - backtrack
  yield { board, solved: false }
}

type Guess = {
  index: number
  value: number
}

type Step = {
  board: Board
  solved?: boolean
  move?: Move
  guess?: Guess
}
