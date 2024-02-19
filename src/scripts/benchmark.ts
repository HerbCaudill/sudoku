import { Solver } from '../solver/Solver.js'
import { files, load } from '../lib/load.js'
import { AnalysisResult } from '../types.js'

const allResults = [] as AnalysisResult[]
for (const file of files) {
  const results = [] as AnalysisResult[]
  const puzzles = load(file).slice(0, 50)
  let failures = 0
  for (const puzzle of puzzles) {
    const result = new Solver(puzzle).analyze()
    allResults.push(result)
    results.push(result)
    if (!result.solved) failures += 1
  }
  if (failures > 0) throw new Error(`failed to solve ${failures} puzzles`)
  printAnalysis(file, results)
}
printAnalysis('OVERALL', allResults)

function printAnalysis(fileName: string, results: AnalysisResult[]) {
  const total = results.length
  const solved = results.filter(result => result.solved)
  const failed = results.filter(result => !result.solved)

  if (solved.length === 0) throw new Error('no puzzles solved')

  const avgSteps = average(solved.map(result => result.steps)).toFixed(0)
  const avgBacktracks = average(solved.map(result => result.backtracks)).toFixed(0)
  const avgTime = average(solved.map(result => result.time)).toFixed(0)
  const maxSteps = Math.max(...solved.map(result => result.steps))
  const maxBacktracks = Math.max(...solved.map(result => result.backtracks))
  const maxTime = Math.max(...solved.map(result => result.time)).toFixed(0)
  const totalTime = (solved.reduce((sum, result) => sum + result.time, 0) / 1000).toFixed(0)

  console.log(
    [
      `=========== ${fileName}`,
      ``,
      `puzzles: ${total}`,
      `solved: ${solved.length}`,
      `failed: ${failed.length}`,
      ``,
      `average steps: ${avgSteps}`,
      `max steps: ${maxSteps}`,
      ``,
      `average backtracks: ${avgBacktracks}`,
      `max backtracks: ${maxBacktracks}`,
      ``,
      `average time: ${avgTime}ms`,
      `max time: ${maxTime}ms`,
      `total time: ${totalTime}s`,
      ``,
      ``,
    ].join('\n')
  )
}

function average(arr: number[]) {
  return arr.reduce((sum, n) => sum + n, 0) / arr.length
}
