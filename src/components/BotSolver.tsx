import * as changeCase from 'change-case'
import { useEffect, useState } from 'react'
import type { Grid } from 'types'
import { Puzzle } from './Puzzle'
import { useHotkeys } from 'react-hotkeys-hook'
import { search, type Step } from 'solver/PseudoHumanSolver'
import { Board } from 'solver/Board'
import type { Move } from 'solver/findNextMove'

export const BotSolver = ({ puzzle }: { puzzle: Grid }) => {
  const [steps, setSteps] = useState<Step[]>([])
  const [stepIndex, setStepIndex] = useState(0)
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | undefined>(undefined)

  const [hint, setHint] = useState<Move | undefined>()

  useEffect(() => {
    if (!puzzle) return
    stop()
    setStepIndex(0)
    const board = new Board({ grid: puzzle })
    const steps = [] as Step[]
    let prevBoard = board
    for (const step of search(board)) {
      // make one step just showing this step's move with the previous board
      steps.push({ board: prevBoard, move: step.move })
      // make another step showing the board after the move
      steps.push({ board: step.board })

      prevBoard = step.board

      if (step.solved === true) break
    }
    setSteps(steps)
  }, [puzzle])

  useHotkeys(['shift+space', 'left'], () => stepBack())
  useHotkeys(['space', 'right'], () => stepForward())
  useHotkeys(['mod+backspace'], () => reset())
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

  const reset = () => {
    stop()
    setStepIndex(0)
  }

  if (!steps.length) return null

  const { board, move, guess } = steps[stepIndex]

  if (board.isSolved()) stop()

  return (
    <div className="flex flex-col gap-2">
      {/* Puzzle */}
      <Puzzle puzzle={puzzle} grid={board.grid} candidates={board.candidates} hint={move} />

      {/* Buttons */}
      <div className="flex gap-2">
        <button className="button button-lg" disabled={stepIndex === 0} onClick={reset}>
          <IconTrash className="h-4 w-4" />
        </button>
        <button className="button button-lg" disabled={stepIndex === 0} onClick={stepBack}>
          <IconPlayerSkipBackFilled className="h-4 w-4" />
        </button>
        <button className="button button-lg " onClick={stepForward}>
          <IconPlayerSkipForwardFilled className="h-4 w-4" />
        </button>
        {intervalId ? (
          <button className="button button-lg" onClick={stop}>
            <IconPlayerPauseFilled className="h-4 w-4" />
          </button>
        ) : (
          <button className="button button-lg" onClick={start}>
            <IconPlayerTrackNextFilled className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="font-sans text-sm">
        {move && changeCase.sentenceCase(move.label)}
        {guess && 'Guessing...'}
      </div>
    </div>
  )
}
