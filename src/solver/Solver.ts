import { makeRandom } from '@herbcaudill/random'
import { numbers } from './constants.js'
import { toGrid } from './helpers/toGrid.js'
import { peers } from './peers.js'
import { allSingles } from './singles.js'
import { AnalysisResult, CandidateGrid as CandidateMap, Grid, InterimResult } from './types.js'
import { getUnsolved } from './getUnsolved.js'

export class Solver {
  readonly #puzzle: Grid
  #steps = 0
  #guesses = 0
  #backtracks = 0
  #random: ReturnType<typeof makeRandom>

  constructor(puzzle: string | Grid, seed: string = Math.random().toString()) {
    // grid can be passed as a string or as an array of numbers
    const parsedPuzzle = typeof puzzle === 'string' ? toGrid(puzzle) : puzzle
    this.#puzzle = [...parsedPuzzle]
    this.#random = makeRandom(seed)
  }

  solve() {
    this.#steps = 0
    this.#backtracks = 0
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
    this.#steps++
    if (this.#steps > 10000) yield { grid, state: 'GIVING UP' } // ❌ shouldn't ever take this many steps

    // PROPAGATION

    let candidates: CandidateMap = {}

    // solve as many cells as possible using constraint propagation
    for (const step of this.propagate(grid)) {
      yield step
      if (step.state === 'CONTRADICTION') {
        this.#backtracks++
        return // ❌ dead end
      } else {
        candidates = step.candidates!
      }
    }

    const unsolved = Object.keys(candidates).map(Number)
    if (unsolved.length === 0) {
      yield { grid, state: 'SOLVED' }
      return // 🎉 success
    }

    // TRIAL & ERROR

    this.#guesses++

    // choose a random unsolved cell with the fewest candidates possible
    const index = this.#random.shuffle(unsolved).reduce(
      (min, i) => (candidates[i].length < candidates[min].length ? i : min),
      unsolved[0] //
    )

    const sortedCandidates = this.#random.shuffle(candidates[index])
    for (const value of sortedCandidates) {
      yield { grid, candidates, state: 'GUESSING', index, value }

      // make a new grid with this value filled in
      const nextGrid = [...grid]
      nextGrid[index] = value

      // recursively continue the search, yielding interim results as we go
      for (const step of this.search(nextGrid)) yield step
    }

    // none of the candidates for this cell worked
    this.#backtracks++
    yield { grid, state: 'CONTRADICTION', index } // ❌ dead end
    return
  }

  /**
   * Using constraint propagation, returns a map of candidates for each unsolved cell, or false if
   * a contradiction is found.
   */
  *propagate(grid: Grid): Generator<InterimResult> {
    while (true) {
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
        yield { grid, candidates, state: 'DONE PROPAGATING' }
        return
      }

      for (const i in singles) {
        const contradiction = peers[i]
          .filter(peer => singles[peer]) // peers that are also singles
          .some(peer => singles[peer] === singles[i]) // with the same value
        if (contradiction) {
          yield { grid, state: 'CONTRADICTION', index: Number(i) } // ❌ dead end
          return
        }
        // no contradiction - set this cell's value and continue
        grid[i] = singles[i]
        yield { grid, candidates, state: 'PROPAGATING', index: Number(i), value: singles[i] }
      }
    }
  }

  analyze(): AnalysisResult {
    const start = performance.now()
    try {
      const solution = this.complete(this.#puzzle)
      if (solution) {
        return {
          solved: true,
          solution,
          steps: this.#steps,
          backtracks: this.#backtracks,
          guesses: this.#guesses,
          time: performance.now() - start,
        }
      } else {
        return {
          solved: false,
          steps: this.#steps,
          backtracks: this.#backtracks,
          guesses: this.#guesses,
          error: 'no solution',
          time: performance.now() - start,
        }
      }
    } catch (e: any) {
      return {
        solved: false,
        steps: this.#steps,
        backtracks: this.#backtracks,
        guesses: this.#guesses,
        error: e.toString(),
        time: performance.now() - start,
      }
    }
  }
}
