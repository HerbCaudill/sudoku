import { AnalysisResult } from 'solver'
import { Solver } from '../solver/Solver.js'
import { dataDir, files, load } from '../solver/helpers/load.js'
import fs from 'fs'
import path from 'path'

// We sort puzzles by number of times the solver has to resort to trial and error in order to solve them.
const difficultyLevels = [0, 3, 9, 81, 243, Number.POSITIVE_INFINITY]
const sortedPuzzles = {} as Record<number, string[]>
const TRIALS = 3

const start = Date.now()

for (const file of files) {
  const puzzles = load(file).slice(0, 5000)
  for (const puzzle of puzzles) {
    const results = [] as AnalysisResult[]
    for (let i = 0; i < TRIALS; i++) {
      const result = new Solver(puzzle).analyze()
      results.push(result)
    }
    const minGuesses = Math.min(...results.map(result => result.guesses))
    const level = difficultyLevels.findIndex(max => minGuesses <= max)!
    const puzzles = sortedPuzzles[level] || (sortedPuzzles[level] = [])
    puzzles.push(puzzle)
  }
}

for (const level in sortedPuzzles) {
  console.log(`Level ${level}: ${sortedPuzzles[level].length} puzzles`)
  const filePath = path.join(dataDir, 'sorted', `${level}.txt`)
  const output = sortedPuzzles[level]
    .sort(() => Math.random() - 0.5) // shuffle puzzles
    .join('\n')
  fs.writeFileSync(filePath, output)
}

console.log('')
console.log(`Done in ${((Date.now() - start) / 1000).toFixed(0)}s`)

function average(arr: number[]) {
  return arr.reduce((sum, n) => sum + n, 0) / arr.length
}
