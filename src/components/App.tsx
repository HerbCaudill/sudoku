import { useState } from 'react'
import { useKeyboard } from '../hooks/useKeyboard'
import { InterimResult, Solver, generate } from '../solver'
import { Puzzle } from './Puzzle'
import { toGrid } from '../solver/helpers/toGrid'

export const App = () => {
  const [puzzle] = useState(
    toGrid(`
    5 3 .  8 . .  6 . . 
    . 4 9  5 . 2  8 3 1 
    . 2 7  1 . .  5 . 9 
    7 5 .  9 . 1  . . 4 
    2 . 8  4 . .  . . 6 
    4 . .  . . 8  . . . 
    . 6 .  . . 3  4 1 . 
    3 . .  . 1 .  . 2 . 
    1 8 .  2 . 4  . . .`)
  )

  //   () => {
  //   const { puzzle, solution } = generate('test-123')
  //   return { puzzle, solution }
  // }

  const [step, setStep] = useState({ grid: puzzle, candidates: {}, state: 'PROPAGATING' } as InterimResult)
  const [solver] = useState(() => new Solver(puzzle))
  const [stepGenerator] = useState(() => solver.search())
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | undefined>(undefined)

  const solveStep = () => {
    const step = stepGenerator.next().value
    if (step) {
      const { grid, candidates, ...rest } = step
      console.log(rest)
      setStep(step)
    }
    // else {
    //   stop()
    // }
  }

  const start = () => {
    stop()
    const id = setInterval(() => {
      solveStep()
    }, 50)
    setIntervalId(id) // Store the intervalId
  }

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(undefined)
    }
  }

  useKeyboard(({ key, altKey, ctrlKey, metaKey }: KeyboardEvent) => {
    if (key === ' ') solveStep()
    if (key === 'Enter') {
      if (intervalId) stop()
      else start()
    }
  })

  return (
    <div className="p-8 w-[36rem] max-w-full flex flex-col gap-4">
      <Puzzle puzzle={puzzle} step={step} />
      <div className="flex gap-2">
        <button className="button button-sm" onClick={stop}>
          ⏹︎
        </button>
        <button className="button button-sm" onClick={solveStep}>
          ▶︎
        </button>
        <button className="button button-sm" onClick={start}>
          ▶︎▶︎
        </button>
      </div>
    </div>
  )
}
