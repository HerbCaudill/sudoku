import { makeRandom } from '@herbcaudill/random'
import { toGrid } from '../lib/toGrid.js'
import { Action, CandidateGrid as CandidateMap, Grid } from '../types.js'
import { numbers } from './constants.js'
import { getUnsolved } from './getUnsolved.js'
import { peers } from './peers.js'
import { allSingles } from './singles.js'
import { strategies } from './strategies.js'

export class PseudoHumanSolver {
  readonly #puzzle: Grid
  #random: ReturnType<typeof makeRandom>

  constructor(puzzle: string | Grid, seed: string = Math.random().toString()) {
    // grid can be passed as a string or as an array of numbers
    const parsedPuzzle = typeof puzzle === 'string' ? toGrid(puzzle) : puzzle
    this.#puzzle = [...parsedPuzzle]
    this.#random = makeRandom(seed)
  }

  *search(board: Board): Generator<Move> {
    // PROPAGATION

    let candidates: CandidateMap = {}

    // solve as many cells as possible using constraint propagation
    for (const move of this.propagate(board)) {
      board.applyRemovals(move.removals)
      } else {
        yield move
      }
    }

    const unsolved = Object.keys(candidates).map(Number)
    if (unsolved.length === 0) {
      yield { grid: [...grid], state: 'SOLVED' }
      return // 🎉 success
    }

    // TRIAL & ERROR

    // choose a random unsolved cell with the fewest candidates possible
    const index = this.#random.shuffle(unsolved).reduce(
      (min, i) => (candidates[i].length < candidates[min].length ? i : min),
      unsolved[0] //
    )

    const sortedCandidates = this.#random.shuffle(candidates[index])
    for (const value of sortedCandidates) {
      yield { grid: [...grid], candidates, state: 'GUESSING', index, value }

      // make a new grid with this value filled in
      const nextGrid = this.#updateGrid(grid, index, value)

      // recursively continue the search, yielding interim results as we go
      for (const step of this.search(nextGrid)) yield step
    }

    // none of the candidates for this cell worked
    yield { grid: [...grid], state: 'CONTRADICTION', index } // ❌ dead end
    return
  }

  /**
   * Using constraint propagation, returns a map of candidates for each unsolved cell, or false if
   * a contradiction is found.
   */
  *propagate(grid: Grid): Generator<Move> {
    const candidates = Object.fromEntries(
      getUnsolved(grid).map(i => {
        const noPeerMatch = (v: number) => !peers[i].some(peer => grid[peer] === v)
        return [i, numbers.filter(noPeerMatch)]
      })
    )

    // find cells with only one possible value
    const singles = allSingles(candidates)

    // if there are none, stop looping & return the candidates
    if (Object.keys(singles).length === 0) {
      yield { grid: [...grid], candidates, state: 'DONE PROPAGATING' }
      return
    }

    for (const i in singles) {
      const contradiction = peers[i]
        .filter(peer => singles[peer]) // peers that are also singles
        .some(peer => singles[peer] === singles[i]) // with the same value
      if (contradiction) {
        yield { grid: [...grid], state: 'CONTRADICTION', index: Number(i) } // ❌ dead end
        return
      }
      // no contradiction - set this cell's value and continue
      grid[i] = singles[i]
      yield { grid: [...grid], candidates, state: 'PROPAGATING', index: Number(i), value: singles[i] }
    }

    yield this.propagate([...grid]).next().value
  }

  #updateGrid(grid: Grid, index: number, value: number) {
    const nextGrid = [...grid]
    nextGrid[index] = value
    return nextGrid
  }
}

type Move = {
  matches: number[]
  removals: Action[]
  strategy: keyof typeof strategies
}
