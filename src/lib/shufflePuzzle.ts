import { makeRandom } from '@herbcaudill/random'
import { numbers } from './constants'
import { stringToGrid } from './stringToGrid'

/**
 * Takes a string representation of a puzzle and returns a string representation of an equivalent
 * puzzle with the numbers shuffled. This is necessary because many of the source puzzles' solutions
 * have the numbers 1..9 in order in the first box.
 *
 * For example the puzzle
 * ```
 * 12.4.6..9...78...3.893..6....782...45...34............2.5...9...9..7...2.4......8
 * ```
 * could be shuffled to
 * ```
 * 35.7.2..1...46...8.618..2....465...79...87............5.9...1...1..4...5.7......6
 * ```
 * In this case all 1s have been replaced with 3s, all 2s with 5s, etc.
 */
export const shufflePuzzle = (puzzle: string, seed?: string): string => {
  const grid = stringToGrid(puzzle)
  const random = makeRandom(seed)
  const shuffledNumbers = random.shuffle(numbers)
  const shuffledGrid = grid.map(n => (n ? shuffledNumbers[n - 1] : 0))
  return shuffledGrid.map(n => (n ? n.toString() : '.')).join('')
}
