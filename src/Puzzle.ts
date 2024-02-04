import { getFrequencies } from './getFrequencies.js'
import { getCandidates } from './getCandidates.js'
import { getAllSingles } from './getSingles.js'
import { peers } from './peers.js'
import { toGrid } from './toGrid.js'
import { Grid } from './types.js'
import { AnalysisResult } from './types.js'

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
   * Solves a puzzle by identifying candidates for each cell, and then recursively selecting
   * candidates and exploring the resulting grid until a contradiction is found or the puzzle is
   * solved.
   */
  complete(grid: Grid): Grid | false {
    if (this.#maxSteps && this.#steps > this.#maxSteps) throw new Error('too many steps')
    let candidates = getCandidates(grid)
    let unsolvedCells = Object.keys(candidates).map(Number)

    // LOGICAL PHASE

    while (true) {
      this.#steps += 1
      // 🎉 if there are no unsolved cells, we're done - return the solved grid
      if (unsolvedCells.length === 0) return grid

      // ❌ if there there are any cells with no candidates, this is a dead end
      if (Object.values(candidates).some(isEmpty)) return false

      // TODO: Move most of this to getCandidates, including the check for contradictions.
      // If getCandidates finds a contradiction, it should return false. The only thing we'll
      // need to do here is check for singles and update the grid accordingly.

      // are there any cells with only one possible solution? (because it has only one candidate,
      // or because it has no peers with the same candidate)
      const singles = getAllSingles(grid, candidates)
      const singleKeys = Object.keys(singles).map(Number)

      if (singleKeys.length > 0) {
        // check for contradictions: If a cell has to be X and it's a peer of another cell that
        // has to be X, we're at a dead end
        const hasContradiction = singleKeys.some(index => {
          const singlePeers = peers[index].filter(peer => singleKeys.includes(peer))
          const isContradiction = singlePeers.some(peer => singles[peer] === singles[index])
          return isContradiction
        })

        // ❌ if a contradiction was found, this is a dead end
        if (hasContradiction) return false

        // no contradictions - fill in these cells
        for (const index of singleKeys) {
          grid[index] = singles[index]
        }

        // update our list of candidates
        candidates = getCandidates(grid)
        unsolvedCells = Object.keys(candidates).map(Number)
      } else {
        // no singles - now we just need to try some candidates and backtrack as needed
        break
      }
    }

    // TRIAL & ERROR PHASE

    // choose a cell with the fewest candidates
    const index = unsolvedCells.reduce(
      (minIndex, currentIndex) =>
        candidates[currentIndex].length < candidates[minIndex].length ? currentIndex : minIndex,
      unsolvedCells[0]
    )

    // count the number of times each value appears in the grid
    const frequency = getFrequencies(grid)

    // try completing the grid with each possible candidate, starting with the ones that appear
    // least frequently
    const byFrequency = (a: number, b: number) => (frequency[a] ?? 0) - (frequency[b] ?? 0)
    const sortedCandidates = candidates[index].sort(byFrequency)
    for (const newValue of sortedCandidates) {
      const newGrid = grid.map((oldValue, i) => (i === index ? newValue : oldValue)) as Grid
      // 👉 recursively try to solve the puzzle assuming this value
      const solution = this.complete(newGrid)
      if (solution)
        // 🎉 if it leads to a valid solution, return it
        return solution
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

const isEmpty = (arr: any[]) => arr.length === 0
