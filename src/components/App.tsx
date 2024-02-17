import { useState } from 'react'
import { generate } from '../solver'
import { RadioGroup } from './RadioGroup'
import { HumanSolver } from './HumanSolver'
import { BotSolver } from './BotSolver'

export const App = () => {
  const [mode, setMode] = useState<Mode>(HUMAN)

  // TODO: remove seed
  const [{ puzzle, solution }] = useState(() => generate('test-123'))

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

      {mode === BOT ? <BotSolver puzzle={puzzle} /> : <HumanSolver puzzle={puzzle} solution={solution} />}
    </div>
  )
}

const HUMAN = 'human'
const BOT = 'bot'
type Mode = typeof HUMAN | typeof BOT
