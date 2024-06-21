import { stringToGrid } from './stringToGrid'
import { printGrid } from './printGrid'
import { Solver } from 'solver/Solver'

export const solve = (puzzle: string) => {
  const { solution, solved, error } = new Solver(puzzle).analyze()
  if (!solved) {
    const grid = stringToGrid(puzzle)
    throw new Error(`${error}:\n${printGrid(grid)}`)
  }
  return solution
}
