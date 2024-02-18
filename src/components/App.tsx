import { useEffect, useState } from 'react'
import { toGrid } from '../lib/toGrid'
import { Grid, Solver } from '../solver'
import { BotSolver } from './BotSolver'
import { HumanSolver } from './HumanSolver'
import { RadioGroup } from './RadioGroup'
import { loadPuzzle } from './loadPuzzle'
import { Spinner } from './Spinner'
import { useLocalStorage } from '@uidotdev/usehooks'

export const App = () => {
  const [mode, setMode] = useLocalStorage<Mode>('mode', HUMAN)

  const [puzzle, setPuzzle] = useState<Grid>()
  const [solution, setSolution] = useState<Grid>()
  const [level, setLevel] = useLocalStorage('level', 0)

  useEffect(() => {
    loadPuzzle(level).then(p => {
      const puzzle = toGrid(p)
      setSolution([])
      setPuzzle(puzzle)
    })
  }, [level])

  useEffect(() => {
    if (!puzzle) return
    const solver = new Solver(puzzle)
    const solution = solver.solve() as Grid // we know it has a solution
    setSolution(solution)
  }, [puzzle])

  return puzzle && solution ? (
    <>
      <div
        className="h-dvh p-2 w-[36rem] max-w-full mx-auto flex flex-col gap-4 select-none relative"
        style={{ containerType: 'size' }}
      >
        {mode === BOT ? ( //
          <BotSolver puzzle={puzzle} />
        ) : (
          <HumanSolver puzzle={puzzle} solution={solution} />
        )}
      </div>
      <div className="h-dvh bg-white w-full flex flex-col gap-2 p-4">
        <p>Play mode</p>
        <RadioGroup
          value={mode}
          onChange={v => setMode(v as Mode)}
          options={[
            {
              value: HUMAN,
              label: 'Human',
              icon: <IconWoman />,
              title: 'Human solver',
            },
            {
              value: BOT,
              label: 'Bot',
              icon: <IconRobot />,
              title: 'Bot solver',
            },
          ]}
        />
        <p>New game</p>
        <RadioGroup
          value={level}
          onChange={v => setLevel(v as number)}
          options={[
            { value: 0, label: 'Easy' },
            { value: 1, label: 'Medium' },
            { value: 2, label: 'Hard' },
            { value: 3, label: 'Expert' },
            { value: 4, label: 'Extreme' },
          ]}
        />
      </div>
    </>
  ) : (
    <div className="h-dvh flex items-center justify-center opacity-20">
      <Spinner size={40} />
    </div>
  )
}

const HUMAN = 'human'
const BOT = 'bot'
type Mode = typeof HUMAN | typeof BOT
