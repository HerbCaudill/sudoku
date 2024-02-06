import { makeRandom } from '@herbcaudill/random'
import { Solver } from './Solver.js'
import { cells, emptyGrid } from './constants.js'
import { Grid, Random } from './types.js'

export const generate = (seed = Math.random().toString()): { puzzle: Grid; solution: Grid } => {
  const random = makeRandom(seed)

  // "solve" an empty grid
  const solution = new Solver(emptyGrid, random.alpha()).analyze().solution! // will always have a solution
  const puzzle = makePuzzleForSolution(solution, random)
  return { puzzle, solution }
}

const makePuzzleForSolution = (solution: Grid, random: Random): Grid => {
  const numHints = 17 + random.integer(0, 5) // need at least 17 cells
  const cellsToRemove = random.sample(cells, 81 - numHints)
  const puzzle = solution.map((v, i) => (cellsToRemove.includes(i) ? v : 0))

  // make sure there's exactly one solution
  for (let i = 0; i < 20; i++) {
    const s = new Solver(puzzle, random.alpha()).analyze().solution
    // if we can't find a solution, or if we find a different solution, try again
    if (!s || !arraysMatch(s, solution)) {
      if (!s) console.log(`no solution found after ${i} attempts`)
      else console.log(`found multiple solutions after ${i} attempts`)
      return makePuzzleForSolution(solution, random)
    }
  }
  return puzzle
}

const arraysMatch = (a: Grid, b: Grid) => a.every((v, i) => v === b[i])
