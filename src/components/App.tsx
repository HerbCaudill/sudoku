import { Dialog, Transition } from '@headlessui/react'
import { useLocalStorage } from '@uidotdev/usehooks'
import { Fragment, useEffect, useState } from 'react'
import { toGrid } from '../lib/toGrid'
import { Grid, Solver } from '../solver'
import { Fade } from '../transitions/Fade'
import { Slide } from '../transitions/Slide'
import { BotSolver } from './BotSolver'
import { HumanSolver } from './HumanSolver'
import { RadioGroup } from './RadioGroup'
import { Spinner } from './Spinner'
import { loadPuzzle } from '../lib/loadPuzzle'

export const App = () => {
  const [mode, setMode] = useLocalStorage<Mode>('mode', HUMAN)

  const [puzzle, setPuzzle] = useState<Grid>()
  const [solution, setSolution] = useState<Grid>()
  const [level, setLevel] = useLocalStorage('level', 0)

  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    newGame(level)
  }, [level])

  useEffect(() => {
    if (!puzzle) return
    const solver = new Solver(puzzle)
    const solution = solver.solve() as Grid // we know it has a solution
    setSolution(solution)
  }, [puzzle])

  const newGame = (level: number) => {
    loadPuzzle(level).then(p => {
      const puzzle = toGrid(p)
      setPuzzle(puzzle)
    })
  }

  return puzzle && solution ? (
    <>
      <div
        className="h-dvh p-2 pb-12 w-[36rem] max-w-full mx-auto flex flex-col gap-4 touch-none select-none relative"
        style={{ containerType: 'size' }}
      >
        <div className="grow">
          {mode === BOT ? ( //
            <BotSolver puzzle={puzzle} />
          ) : (
            <HumanSolver puzzle={puzzle} solution={solution} onNewGame={() => newGame(level)} />
          )}
        </div>

        {/* Settings button */}
        <button className="button button-lg absolute bottom-12 right-6 z-10" onClick={() => setShowSettings(true)}>
          <IconSettings className="h-4 w-4" />
        </button>

        {/* Settings */}
        <Transition.Root show={showSettings} as={Fragment}>
          <Dialog as="div" className="relative z-50 " onClose={setShowSettings}>
            <Fade>
              <Backdrop />
            </Fade>
            <div className="fixed bottom-0  w-full ">
              <Slide>
                {/* settings container */}
                <Dialog.Panel>
                  {/* sidebar */}
                  <div className="flex flex-col  gap-5 bg-white px-4 py-12 w-[36rem] max-w-full mx-auto">
                    <RadioGroup
                      value={mode}
                      onChange={v => setMode(v as Mode)}
                      options={[
                        { value: HUMAN, label: 'Human', icon: <IconWoman />, title: 'Human solver' },
                        { value: BOT, label: 'Bot', icon: <IconRobot />, title: 'Bot solver' },
                      ]}
                    />
                    <RadioGroup
                      size="sm"
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
                    <p>
                      <button className="button button-md" onClick={() => newGame(level)}>
                        <IconRefresh className="h-4 w-4" />
                        New game
                      </button>
                    </p>
                  </div>
                </Dialog.Panel>
              </Slide>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </>
  ) : (
    <div className="h-dvh flex items-center justify-center opacity-20">
      <Spinner size={40} />
    </div>
  )
}

const Backdrop = () => {
  return <div className="fixed inset-0 bg-gray-900/20" />
}

const HUMAN = 'human'
const BOT = 'bot'
type Mode = typeof HUMAN | typeof BOT
