import { files, load } from 'lib/loadFile'
import { Board } from 'solver/Board'
import chalk from 'chalk'
import { analyze } from 'solver/analyze'

// assess progress of PseudoHumanSolver by analyzing a set of puzzles

let allResults = []
type Result = ReturnType<typeof analyze>

const stats = (results: Result[], prop: keyof Result) => {
  const values = results.map(result => Number(result[prop]))
  const min = String(Math.min(...values)).padStart(5)
  const avg = (values.reduce((sum, v) => sum + v, 0) / results.length).toFixed(0).padStart(5)
  const max = String(Math.max(...values)).padStart(5)
  return `  ${prop}: ${chalk.white(`${min} ${avg} ${max}`)}`
}

const ratioAndPercentage = (a: number, b: number) => {
  const ratio = String(a).padStart(3) + ' /' + String(b).padStart(4)
  const percentage = (((a / b) * 100).toFixed(0) + '%').padStart(5)
  return chalk.white(ratio) + ' ' + chalk.yellow(percentage)
}

const summary = (label: string, results: Result[]) => {
  const solved = results.filter(r => r.solved).length
  const attempts = results.length
  return chalk.gray(
    chalk.cyan(label.padEnd(20)) +
      `  solved: ${ratioAndPercentage(solved, attempts)}  ` +
      stats(results, 'difficulty') +
      stats(results, 'backtracks') +
      stats(results, 'moves')
  )
}

for (const file of files) {
  const puzzles = load(file).slice(0, 100)
  const results = puzzles.map(puzzle => analyze(puzzle))
  console.log(summary(file.replace('.txt', ''), results))
  allResults.push(...results)
}

console.log()
console.log(summary('total', allResults))
