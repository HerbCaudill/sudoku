import { useState } from 'react'
import { useKeyboard } from '../hooks/useKeyboard'
import { Grid, InterimResult, Solver } from '../solver'
import { Puzzle } from './Puzzle'

export const BotSolver = ({ puzzle }: { puzzle: Grid }) => {
  const [step, setStep] = useState({ grid: puzzle, candidates: {}, state: 'PROPAGATING' } as InterimResult)
  const [solver] = useState(() => new Solver(puzzle))
  const [stepGenerator] = useState(() => solver.search())
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | undefined>(undefined)

  useKeyboard(({ key }: KeyboardEvent) => {
    switch (key) {
      case ' ': {
        solveStep()
        break
      }
      case 'Enter': {
        if (intervalId) stop()
        else start()
        break
      }
    }
  })

  const solveStep = () => {
    const step = stepGenerator.next().value
    if (step) setStep(step)
    else stop()
  }

  const start = () => {
    stop()
    const id = setInterval(() => solveStep(), 50)
    setIntervalId(id) // Store the intervalId
  }

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(undefined)
    }
  }

  return (
    <>
      <Puzzle puzzle={puzzle} {...step} />
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
    </>
  )
}
