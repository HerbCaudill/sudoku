import { toGrid } from './toGrid.js'
import { printGrid } from './printGrid.js'
import { Solver } from '../Solver.js'

export const solve = (puzzle: string) => {
  const { solved, error } = new Solver(puzzle).analyze()
  if (!solved) {
    const grid = toGrid(puzzle)
    throw new Error(`${error}:\n${printGrid(grid)}`)
  }
}
