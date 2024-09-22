import fs from 'fs'
import { files, load } from 'lib/loadFile'
import path from 'path'
import { Solver } from 'solver/Solver'
import { AnalysisResult } from 'types'

const __dirname = new URL('.', import.meta.url).pathname
export const puzzlesDir = path.join(__dirname, '../../public/puzzles')

// We sort puzzles by number of times the solver has to resort to trial and error in order to solve them.
const difficultyLevels = [1, 5, 10, 15, 25]
const sortedPuzzles = { 0: [], 1: [], 2: [], 3: [], 4: [] } as Record<number, string[]>
const TRIALS = 10
const N = 1000

const start = Date.now()

const allPuzzles = files
  .flatMap(file => load(file)) //
  .sort(() => Math.random() - 0.5)

let i = 0
for (const puzzle of allPuzzles) {
  i++
  const results = [] as AnalysisResult[]
  for (let j = 0; j < TRIALS; j++) {
    const result = new Solver(puzzle).analyze()
    results.push(result)
  }
  const maxGuesses = Math.max(...results.map(result => result.guesses))
  const level = difficultyLevels.findIndex(max => maxGuesses <= max)!
  if (level > -1) {
    sortedPuzzles[level].push(puzzle)

    if (i % 100 === 0) writeToFiles()

    if (Object.values(sortedPuzzles).every(puzzles => puzzles.length > N))
      // if we have enough puzzles in each level, we can stop
      break
  }
}

function writeToFiles() {
  console.clear()
  console.log(`Analyzed ${i} puzzles x ${TRIALS} trials each`)
  console.log(``)
  for (const level in sortedPuzzles) {
    console.log(`Level ${level}: ${sortedPuzzles[level].length} puzzles`)
    const filePath = path.join(puzzlesDir, `${level}.txt`)
    const output = sortedPuzzles[level].join('\n')
    fs.writeFileSync(filePath, output)
  }
}

console.log('')
console.log(`Analyzed ${i} puzzles x ${TRIALS} trials each`)
console.log(`Sorted in ${((Date.now() - start) / 1000).toFixed(0)}s`)
