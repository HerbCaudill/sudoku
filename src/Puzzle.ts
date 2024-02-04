import { getFrequencies } from './getFrequencies.js'
import { getCandidates } from './getCandidatesNew.js'
import { getAllSingles } from './getSingles.js'
import { peers } from './peers.js'
import { toGrid } from './toGrid.js'
import { Grid } from './types.js'
import { AnalysisResult } from './types.js'
import { LogicalSolver } from './LogicalSolver.js'

export class Puzzle {
  /** The initial state of the puzzle */
  #puzzle: Grid

  /** Iteration counter for internal use while solving */
  #steps = 0

  /** The maximum number of iteration before bailing */
  #maxSteps = 0

  constructor(puzzle: string) {
    this.#puzzle = toGrid(puzzle)
  }

  /**
   * Solves a puzzlealternating between a logical phase of eliminating candidates and a
   * trial-and-error phase of guessing a candidate and recursively solving the resulting grid.
   */
  complete(grid: Grid): Grid | false {
    if (this.#maxSteps && this.#steps > this.#maxSteps) throw new Error('too many steps')

    // 💡 LOGICAL PHASE

    const {
      candidates, //
      failed,
      grid: updatedGrid,
      solved,
      nextCell,
    } = new LogicalSolver(grid)

    // ❌ if we've reached a contradiction, we're at a dead end & need to backtrack
    if (failed) return false

    // update the grid with any cells that have been solved
    grid = updatedGrid

    // 🎉 if the puzzle has been solved, return it
    if (solved) return grid

    // 🎲 TRIAL AND ERROR PHASE

    const sortedCandidates = sortByFrequency(grid, candidates[nextCell])
    for (const newValue of sortedCandidates) {
      // make a new grid with this value
      const newGrid = modifyGrid(grid, nextCell, newValue)

      // 👉 recursively try to solve the puzzle assuming this value;
      // we'll get `false` if we reach a contradiction, or a solved puzzle if this value works
      const solution = this.complete(newGrid)

      // 🎉 if this leads to a valid solution, return it
      if (solution) return solution
    }

    // ❌ None of the candidates worked, so this is a dead end
    return false
  }

  solve() {
    this.#steps = 0
    return this.complete(this.#puzzle)
  }

  analyze(maxSteps: number = 0): AnalysisResult {
    this.#maxSteps = maxSteps
    this.#steps = 0
    const start = performance.now()
    try {
      const solution = this.complete(this.#puzzle)
      if (solution) {
        return {
          solved: true,
          solution,
          steps: this.#steps,
          time: performance.now() - start,
        }
      } else {
        return {
          solved: false,
          steps: this.#steps,
          error: 'no solution',
          time: performance.now() - start,
        }
      }
    } catch (e) {
      return {
        solved: false,
        steps: this.#steps,
        error: e.toString(),
        time: performance.now() - start,
      }
    }
  }
}

const sortByFrequency = (grid: Grid, cellCandidates: number[]) => {
  const frequency = getFrequencies(grid)
  const byFrequency = (a: number, b: number) => (frequency[a] ?? 0) - (frequency[b] ?? 0)
  return cellCandidates.sort(byFrequency)
}

const modifyGrid = (grid: Grid, index: number, newValue: number) => {
  return grid.map((oldValue, i) => {
    return i === index ? newValue : oldValue
  }) as Grid
}
