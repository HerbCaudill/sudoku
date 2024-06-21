import { files, load } from 'lib/loadFile'
import { Board } from 'solver/Board'
import { tryToSolve } from 'solver/PseudoHumanSolver'
import { AnalysisResult } from 'types'
import chalk from 'chalk'

// assess progress of PseudoHumanSolver by analyzing a set of puzzles

let totalSolved = 0
let totalAttempts = 0

for (const file of files) {
  const results = [] as AnalysisResult[]
  const puzzles = load(file).slice(0, 500)
  let solved = 0
  let attempts = 0
  for (const puzzle of puzzles) {
    const board = new Board({ grid: puzzle })

    const result = tryToSolve(board)
    if (result.solved) solved += 1
    attempts += 1
  }
  console.log(chalk.gray(`${chalk.cyan(file)}: solved ${chalk.white(`${solved}/${attempts}`)} puzzles`))

  totalSolved += solved
  totalAttempts += attempts
}

const percentage = `${((totalSolved / totalAttempts) * 100).toFixed(0)}%`
console.log(
  chalk.gray(
    `${chalk.cyan('Total')}: solved ${chalk.white(`${totalSolved}/${totalAttempts}`)} puzzles (${chalk.yellow(percentage)})`
  )
)
