import { getGridCandidates } from './getGridCandidates.js'
import { getAllSingles } from './getSingles.js'
import { peers } from './peers.js'
import { toGrid } from './toGrid.js'
import { Grid } from './types.js'

export class Puzzle {
  /** the initial state of the puzzle */
  puzzle: Grid

  steps = 0
  maxSteps = 0

  constructor(puzzle: string, options: { maxSteps?: number } = {}) {
    this.puzzle = toGrid(puzzle)
  }

  complete(grid: Grid): Grid | false {
    if (this.maxSteps && this.steps > this.maxSteps) throw new Error('too many steps')
    let candidates = getGridCandidates(grid)
    let unsolvedSquares = Object.keys(candidates).map(Number)

    // if (this.steps % 100 === 0) {
    //   console.log(this.steps, unsolvedSquares.length)
    //   console.log(printCandidates(grid))
    // }

    while (true) {
      this.steps += 1
      // 🎉 if there are no unsolved squares, we're done - return the solved grid
      if (unsolvedSquares.length === 0) return grid

      // ❌ if there there are any squares with no candidates, we've hit a dead end
      if (Object.values(candidates).some(isEmpty)) return false

      // are there any squares with only one possible solution? (because it has only one candidate, or because it has no peers with the same candidate)
      const singles = getAllSingles(grid, candidates)
      const singleKeys = Object.keys(singles).map(Number)
      if (singleKeys.length > 0) {
        // check for contradictions
        const isContradiction = (index: number) => {
          const value = singles[index]
          const singlePeers = peers[index].filter(p => singleKeys.includes(p))
          return singlePeers.some(peer => singles[peer] === value)
        }
        if (singleKeys.some(isContradiction)) return false

        // no contradictions - fill in these squares
        for (const index of singleKeys) {
          grid[index] = singles[index]
        }

        unsolvedSquares = unsolvedSquares.filter(i => !singleKeys.includes(i))
        candidates = getGridCandidates(grid)
      } else {
        // no singles - now we just need to try some candidates and backtrack as needed
        break
      }
    }

    // find the square with the fewest candidates
    const index = unsolvedSquares.reduce(
      (minIndex, currentIndex) =>
        candidates[currentIndex].length < candidates[minIndex].length ? currentIndex : minIndex,
      unsolvedSquares[0]
    )

    // count the number of times each value appears in the grid
    const gridCounts = grid.reduce((result, value) => {
      if (value) result[value] = (result[value] || 0) + 1
      return result
    }, {} as Record<number, number>)

    // try completing the grid with each possible candidate, starting with the ones that appear least frequently
    const sortedCandidates = candidates[index].sort(
      (a: number, b: number) => (gridCounts[a] || 0) - (gridCounts[b] || 0)
    )
    for (const newValue of sortedCandidates) {
      const newGrid = grid.map((oldValue, i) => (i === index ? newValue : oldValue)) as Grid
      // 👉 recursively try to solve the puzzle assuming this value
      const solution = this.complete(newGrid)
      if (solution)
        // 🎉 if it leads to a valid solution, return it
        return solution
    }

    // ❌ None of the candidates worked, so we've hit a dead end
    return false
  }

  solve() {
    this.steps = 0
    return this.complete(this.puzzle)
  }

  analyze(maxSteps: number = 0): AnalysisResult {
    this.maxSteps = maxSteps
    this.steps = 0
    const start = performance.now()
    try {
      const solution = this.complete(this.puzzle)
      if (solution) {
        return {
          solved: true,
          solution,
          steps: this.steps,
          time: performance.now() - start,
        }
      } else {
        return {
          solved: false,
          steps: this.steps,
          error: 'no solution',
          time: performance.now() - start,
        }
      }
    } catch (e) {
      return {
        solved: false,
        steps: this.steps,
        error: e.toString(),
        time: performance.now() - start,
      }
    }
  }
}

export type AnalysisResult = (
  | {
      solved: true
      solution: Grid
      error?: undefined
    }
  | {
      solved: false
      solution?: undefined
      error: string
    }
) & {
  steps: number
  time: number
}

export type CandidateGrid = Record<number, number[]>

const isEmpty = (arr: any[]) => arr.length === 0
