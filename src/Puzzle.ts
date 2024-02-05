import { numbers } from './constants.js'
import { peers } from './peers.js'
import { toGrid } from './helpers/toGrid.js'
import { AnalysisResult, CandidateGrid as CandidateMap, Grid } from './types.js'
import { rowPeers, colPeers, boxPeers } from './peers.js'
import { CandidateGrid } from './types.js'

export class Puzzle {
  #puzzle: Grid
  #steps = 0

  constructor(puzzle: string) {
    this.#puzzle = toGrid(puzzle)
  }

  solve() {
    this.#steps = 0
    return this.complete(this.#puzzle)
  }

  /**
   * Solves a puzzle alternating between a logical phase of eliminating candidates and a
   * trial-and-error phase of guessing a candidate and recursively solving the resulting grid.
   */
  complete(grid: Grid): Grid | false {
    this.#steps++

    // LOGIC

    const candidates = this.getCandidates(grid)
    if (!candidates) return false // ❌ contradictions found - dead end

    const unsolved = Object.keys(candidates).map(Number)
    if (unsolved.length === 0) return grid // 🎉 solved!

    // TRIAL & ERROR

    // choose an unsolved cell with the fewest possible candidates
    const index = unsolved.reduce(
      (min, i) => (candidates[i].length < candidates[min].length ? i : min),
      unsolved[0] //
    )
    for (const nextValue of candidates[index]) {
      // recursively try to solve the puzzle assuming this value
      const nextGrid = [...grid]
      nextGrid[index] = nextValue
      const solution = this.complete(nextGrid)
      if (solution) return solution // 🎉 solved!
    }
    return false // ❌ None of these worked - dead end
  }

  /**
   * Using constraint propagation, returns a map of candidates for each unsolved cell, or false if
   * a contradiction is found.
   */
  getCandidates(grid: Grid): CandidateMap | false {
    this.#steps++

    const candidates = Object.fromEntries(
      getUnsolved(grid).map(i => {
        const noPeerMatch = (v: number) => !peers[i].some(peer => grid[peer] === v)
        return [i, numbers.filter(noPeerMatch)]
      })
    )

    // find cells with only one possible value
    const singles = allSingles(candidates)

    // if there are none, stop looping & return the candidates
    if (Object.keys(singles).length === 0) return candidates

    for (const i in singles) {
      const contradiction = peers[i]
        .filter(peer => singles[peer]) // peers that are also singles
        .some(peer => singles[peer] === singles[i]) // with the same value
      if (contradiction) return false // ❌ dead end

      // no contradiction - set this cell's value and continue
      grid[i] = singles[i]
    }

    // see if we can eliminate any more candidates
    return this.getCandidates(grid)
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

const nakedSingles = (candidates: CandidateGrid) => {
  const unsolved = Object.keys(candidates).map(Number)
  return Object.fromEntries(
    unsolved //
      .filter(index => candidates[index].length === 1)
      .map(index => [index, candidates[index][0]])
  ) as SingleMap
}

const hiddenSingles = (peers: number[][]) => (candidates: CandidateGrid) => {
  const unsolved = Object.keys(candidates).map(Number)
  return Object.fromEntries(
    unsolved
      .map(index => {
        const noPeerHasValue = (v: number) => !peers[index].some(i => candidates[i]?.includes(v))
        const single = candidates[index].find(noPeerHasValue)
        if (single) return [index, single]
      })
      .filter(Boolean) as [number, number][] // omit undefined
  ) as SingleMap
}

const allSingles = (candidates: CandidateGrid) => {
  return {
    ...nakedSingles(candidates),
    ...hiddenSingles(rowPeers)(candidates),
    ...hiddenSingles(colPeers)(candidates),
    ...hiddenSingles(boxPeers)(candidates),
  } as SingleMap
}

const getUnsolved = (grid: Grid) =>
  grid
    .map((cell, index) => (cell === 0 ? index : -1)) //
    .filter(index => index !== -1)

export type SingleMap = { [index: number]: number }
