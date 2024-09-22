import { files, load } from 'lib/loadFile'
import { Board } from 'solver/Board'
import chalk from 'chalk'
import { solve } from 'solver/PseudoHumanSolver'

// assess progress of PseudoHumanSolver by analyzing a set of puzzles

let allResults = []
type Result = ReturnType<typeof tryToSolve>

export const tryToSolve = (startingBoard: Board) => {
  let difficulty = 0
  let backtracks = 0
  let moves = 0
  for (const { board, move, solved } of solve(startingBoard)) {
    moves += 1
    if (moves > 100000) break // give up
    if (solved === true) return { solved: true, moves, difficulty, backtracks } // solved
    if (solved === false) backtracks += 1
    if (move) difficulty += move.difficulty
  }
  return { solved: false, moves, difficulty, backtracks } // give up
}

const average = (arr: Result[], prop: keyof Result) => {
  const result = (
    arr.reduce((sum, result) => {
      return sum + Number(result[prop])
    }, 0) / arr.length
  ).toFixed(0)
  return `   ${prop}: ${chalk.white(String(result).padStart(3))}   `
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
      average(results, 'difficulty') +
      average(results, 'backtracks') +
      average(results, 'moves')
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
