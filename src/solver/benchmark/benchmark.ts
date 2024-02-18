import fs from 'fs'
import path from 'path'
import { URL } from 'url'
import { Solver } from '../Solver.js'
import { load } from '../helpers/load.js'
import { AnalysisResult } from '../types.js'

const __dirname = new URL('.', import.meta.url).pathname

const files = fs.readdirSync(path.join(__dirname, '..', '..', 'data')).filter(file => file.endsWith('.txt'))
const results = [] as AnalysisResult[]
for (const file of files) {
  const puzzles = load(file).slice(0, 100)
  let failures = 0
  for (const puzzle of puzzles) {
    const result = new Solver(puzzle).analyze()
    results.push(result)
    if (!result.solved) failures += 1
  }
  if (failures > 0) throw new Error(`failed to solve ${failures} puzzles`)
}

const total = results.length
const solved = results.filter(result => result.solved)
const failed = results.filter(result => !result.solved)

if (solved.length === 0) throw new Error('no puzzles solved')

const avgSteps = average(solved.map(result => result.steps)).toFixed(0)
const avgTime = average(solved.map(result => result.time)).toFixed(0)
const maxSteps = Math.max(...solved.map(result => result.steps))
const maxTime = Math.max(...solved.map(result => result.time)).toFixed(0)
const totalTime = (solved.reduce((sum, result) => sum + result.time, 0) / 1000).toFixed(0)

console.log(
  [
    `puzzles: ${total}`,
    `solved: ${solved.length}`,
    `failed: ${failed.length}`,
    ``,
    `average steps: ${avgSteps}`,
    `max steps: ${maxSteps}`,
    ``,
    `average time: ${avgTime}ms`,
    `max time: ${maxTime}ms`,
    `total time: ${totalTime}s`,
  ].join('\n')
)

function average(arr: number[]) {
  return arr.reduce((sum, n) => sum + n, 0) / arr.length
}
