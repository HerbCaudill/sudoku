import fs from 'fs'
import { files, load } from 'lib/loadFile'
import path from 'path'
import { analyze } from 'solver/analyze'
import { Solver } from 'solver/Solver'
import { AnalysisResult } from 'types'

const __dirname = new URL('.', import.meta.url).pathname
export const puzzlesDir = path.join(__dirname, '../../public/puzzles')

const difficultyLevels = [50, 100, 800, 1400, 99999]
const sortedPuzzles = { 0: [], 1: [], 2: [], 3: [], 4: [] } as Record<number, string[]>
const N = 1000

const start = Date.now()

const allPuzzles = files
  .flatMap(file => load(file)) //
  .sort(() => Math.random() - 0.5)

let i = 0
for (const puzzle of allPuzzles) {
  i++

  const { difficulty, backtracks } = analyze(puzzle)

  const level = difficultyLevels.findIndex(level => difficulty + backtracks * 100 < level)

  if (level >= 0 && level <= 4 && sortedPuzzles[level].length < N) sortedPuzzles[level].push(puzzle)

  if (i % 100 === 0) writeToFiles()

  if (Object.values(sortedPuzzles).every(puzzles => puzzles.length >= N))
    // if we have enough puzzles in each level, we can stop
    break
}

writeToFiles()

function writeToFiles() {
  console.clear()
  console.log(`Analyzed ${i} puzzles `)
  console.log(``)
  for (const level in sortedPuzzles) {
    console.log(`Level ${level}: ${sortedPuzzles[level].length} puzzles`)
    const filePath = path.join(puzzlesDir, `${level}.txt`)
    const output = sortedPuzzles[level].join('\n')
    fs.writeFileSync(filePath, output)
  }
}
