import { makeRandom } from '@herbcaudill/random'

export const getPuzzle = async (level: number) => {
  const random = makeRandom()
  if (level < 0 || level > 4) throw new Error('Invalid level')
  const puzzles = await fetch(`/puzzles/${level}.txt`)
    .then(r => r.text())
    .then(t => t.split('\n'))

  const puzzle = random.pick(puzzles)
  return puzzle
}
