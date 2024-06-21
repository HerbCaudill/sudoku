import { makeRandom } from '@herbcaudill/random'
import { Grid, Random } from 'types'
import { cells, emptyGrid } from '../lib/constants'
import { Solver } from './Solver'

export const generate = (seed = Math.random().toString()): { puzzle: Grid; solution: Grid } => {
  const random = makeRandom(seed)

  // "solve" an empty grid to come up with a random solution
  const solver = new Solver(emptyGrid, random.alpha())
  const solution = solver.analyze().solution! // will always have a solution

  // remove values from the solution to make a puzzle
  const puzzle = makePuzzle(solution, random)

  return { puzzle, solution }
}

const makePuzzle = (solution: Grid, random: Random): Grid => {
  // make a puzzle for the given solution by punching out a random selection of cells
  const hintCount = 25 + random.integer(0, 10)
  const cellsToRemove = random.sample(cells, 81 - hintCount)
  const puzzle = solution.map((v, i) => (cellsToRemove.includes(i) ? 0 : v))

  // make sure there's exactly one solution by solving it multiple times
  for (let i = 0; i < 20; i++) {
    const s = new Solver(puzzle, random.alpha()).analyze().solution
    // if there is no solution, or if we find a different solution, try again
    if (!s || !arraysMatch(s, solution)) {
      // if (!s) console.log(`no solution (attempt ${i + 1})`)
      // else console.log(`multiple solutions (attempt ${i + 1})`)
      return makePuzzle(solution, random)
    }
  }

  // console.log({ numHints: hintCount })
  // console.log(printGrid(puzzle))
  return puzzle
}

const arraysMatch = (a: Grid, b: Grid) => a.every((v, i) => v === b[i])
