import { toGrid } from '../../toGrid.js'
import { printGrid } from '../../printGrid.js'
import { Puzzle } from '../../Puzzle.js'

export const solve = (puzzle: string) => {
  const { solved, error } = new Puzzle(puzzle).analyze()
  if (!solved) {
    const grid = toGrid(puzzle)
    throw new Error(`${error}:\n${printGrid(grid)}`)
  }
}
