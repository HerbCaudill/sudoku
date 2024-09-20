import { files, load } from 'lib/loadFile'
import { Board } from 'solver/Board'
import { tryToSolve } from 'solver/PseudoHumanSolver'
import chalk from 'chalk'

// assess progress of PseudoHumanSolver by analyzing a set of puzzles

let allResults = []
type Result = ReturnType<typeof tryToSolve>

const average = (arr: number[]) => (arr.reduce((sum, n) => sum + n, 0) / arr.length).toFixed(0)
const ratioAndPercentage = (a: number, b: number) => {
  const ratio = String(a).padStart(3) + ' /' + String(b).padStart(4)
  const percentage = (((a / b) * 100).toFixed(0) + '%').padStart(5)
  return chalk.white(ratio) + ' ' + chalk.yellow(percentage)
}

const summary = (label: string, results: Result[]) => {
  const avgDifficulty = average(results.map(r => r.difficulty))
  const avgRemaining = average(results.filter(r => !r.solved).map(r => r.remaining!))
  // const minRemaining = Math.min(...results.filter(r => !r.solved).map(r => r.remaining!))
  // const maxRemaining = Math.max(...results.filter(r => !r.solved).map(r => r.remaining!))

  const solved = results.filter(r => r.solved).length
  const attempts = results.length
  return chalk.gray(
    chalk.cyan(label.padEnd(20)) +
      `  solved: ${ratioAndPercentage(solved, attempts)}  ` +
      `  difficulty: ${chalk.white(String(avgDifficulty).padStart(3))}  ` +
      `  remaining: ${chalk.white(String(avgRemaining).padStart(3))}`
  )
}

for (const file of files) {
  const results = []
  const puzzles = load(file).slice(0, 500)
  for (const puzzle of puzzles) {
    const board = new Board({ grid: puzzle })
    const result = tryToSolve(board)
    results.push(result)
  }

  console.log(summary(file.replace('.txt', ''), results))

  allResults.push(...results)
}

console.log()
console.log(summary('total', allResults))
