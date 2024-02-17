import { useState } from 'react'
import { useKeyboard } from '../hooks/useKeyboard'
import { InterimResult, Solver, generate, numbers } from '../solver'
import { Puzzle } from './Puzzle'
import { RadioGroup } from './RadioGroup'

export const App = () => {
  const [mode, setMode] = useState<Mode>(HUMAN)
  const [number, setNumber] = useState<number>(1)

  // TODO: remove seed
  const [{ puzzle, solution }] = useState(() => generate('test-123'))

  const [step, setStep] = useState({ grid: puzzle, candidates: {}, state: 'PROPAGATING' } as InterimResult)
  const [solver] = useState(() => new Solver(puzzle))
  const [stepGenerator] = useState(() => solver.search())
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | undefined>(undefined)

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

  useKeyboard(({ key, altKey, ctrlKey, metaKey }: KeyboardEvent) => {
    switch (mode) {
      case BOT:
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
        break
      case HUMAN:
        switch (key) {
          case 'ArrowLeft': {
            setNumber(n => (n === 1 ? 9 : n - 1))
            break
          }
          case 'ArrowRight':
          case ' ': {
            setNumber(n => (n === 9 ? 1 : n + 1))
            break
          }
        }
        break
    }
  })

  return (
    <div
      className="h-screen p-8 w-[36rem] max-w-full flex flex-col gap-4 select-none"
      style={{ containerType: 'size' }}
    >
      <div>
        <div>
          <RadioGroup
            value={mode}
            onChange={v => setMode(v as Mode)}
            options={[
              { value: HUMAN, label: '😎', title: 'Human solver' },
              { value: BOT, label: '🤖', title: 'Bot solver' },
            ].map(o => ({
              ...o,
              label: <span className={`text-xl text-outline-white`}>{o.label}</span>,
            }))}
          />
        </div>
      </div>
      <Puzzle puzzle={puzzle} step={step} number={number} />
      {mode === 'bot' ? (
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
      ) : (
        <RadioGroup
          value={number}
          onChange={n => setNumber(n)}
          size="xs"
          options={numbers}
          className="w-full"
          optionClassName="grow text-[3cqw] py-[2cqw]"
        />
      )}
    </div>
  )
}

const HUMAN = 'human'
const BOT = 'bot'
type Mode = typeof HUMAN | typeof BOT
