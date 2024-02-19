import { useEffect, useState } from 'react'
import { Grid, InterimResult, Solver } from '../solver'
import { Puzzle } from './Puzzle'
import { useHotkeys } from 'react-hotkeys-hook'

export const BotSolver = ({ puzzle }: { puzzle: Grid }) => {
  const [steps, setSteps] = useState<InterimResult[]>([])
  const [stepIndex, setStepIndex] = useState(0)
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | undefined>(undefined)

  const initialStep = { grid: [...puzzle], candidates: {}, state: 'PROPAGATING' }
  useEffect(() => {
    if (!puzzle) return
    stop()
    setStepIndex(0)
    const solver = new Solver(puzzle)
    const steps = [initialStep] as InterimResult[]
    let done = false
    for (const step of solver.search(puzzle)) {
      if (!done) {
        steps.push(step)
        if (step.state === 'SOLVED') done = true
      }
    }
    setSteps(steps)
  }, [puzzle])

  useHotkeys(['shift+space', 'left'], () => stepBack())
  useHotkeys(['space', 'right'], () => stepForward())
  useHotkeys(['enter'], e => {
    e.preventDefault()
    e.stopPropagation()
    if (intervalId) stop()
    else start()
  })

  const stepBack = () => {
    setStepIndex(stepIndex => (stepIndex > 0 ? stepIndex - 1 : stepIndex))
  }

  const stepForward = () => {
    setStepIndex(stepIndex => (stepIndex < steps.length - 1 ? stepIndex + 1 : stepIndex))
  }

  const start = () => {
    stop()
    const id = setInterval(stepForward, 10)
    setIntervalId(id) // Store the intervalId
  }

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(undefined)
    }
  }

  const step = steps[stepIndex] || initialStep
  const solvedCount = step.grid.filter(Boolean).length

  return (
    <div className="flex flex-col gap-2">
      {/* Puzzle */}
      <Puzzle puzzle={puzzle} {...step} />

      {/* Buttons */}
      <div className="flex gap-2">
        <button className="button button-lg" onClick={stepBack}>
          <IconPlayerSkipBackFilled className="h-3 w-3" />
        </button>
        <button className="button button-lg" onClick={stop}>
          <IconPlayerPauseFilled className="h-3 w-3" />
        </button>
        <button className="button button-lg" onClick={stepForward}>
          <IconPlayerSkipForwardFilled className="h-3 w-3" />
        </button>
        <button className="button button-lg" onClick={start}>
          <IconPlayerTrackNextFilled className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
