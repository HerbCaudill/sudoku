import { toGrid } from './toGrid.js'
import { printGrid } from './printGrid.js'
import { Solver } from '../solver/Solver.js'

export const solve = (puzzle: string) => {
  const { solution, solved, error } = new Solver(puzzle).analyze()
  if (!solved) {
    const grid = toGrid(puzzle)
    throw new Error(`${error}:\n${printGrid(grid)}`)
  }
  return solution
}
