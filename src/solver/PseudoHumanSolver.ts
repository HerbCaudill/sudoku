import { makeRandom } from '@herbcaudill/random'
import { numbers } from './constants.js'
import { toGrid } from '../lib/toGrid.js'
import { peers } from './peers.js'
import { allSingles } from './singles.js'
import { AnalysisResult, CandidateGrid as CandidateMap, Grid, InterimResult } from '../types.js'
import { getUnsolved } from './getUnsolved.js'
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

  solve() {
    return this.complete(this.#puzzle)
  }

  complete(grid: Grid) {
    for (const step of this.search(grid)) {
      if (step.state === 'SOLVED') return step.grid
    }
    return false // ❌ no solution
  }

  /**
   * Solves a puzzle alternating between a logical phase of filling cells that have a single
   * possible value (constraint propagation), and a trial-and-error phase of choosing randomly among
   * the possible values for a cell and seeing if that leads to a solution.
   */
  *search(grid: Grid = this.#puzzle): Generator<InterimResult> {
    grid = [...grid]

    // PROPAGATION

    let candidates: CandidateMap = {}

    // solve as many cells as possible using constraint propagation
    for (const step of this.propagate(grid)) {
      if (step.state === 'CONTRADICTION') {
        return // ❌ dead end
      } else {
        yield step
        candidates = step.candidates!
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
  *propagate(grid: Grid): Generator<InterimResult> {
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
