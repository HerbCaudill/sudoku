import { Dialog, Transition } from '@headlessui/react'
import { useLocalStorage } from '@uidotdev/usehooks'
import { getPuzzle } from 'lib/getPuzzle'
import { toGrid } from 'lib/toGrid'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Fade } from 'transitions/Fade'
import { Slide } from 'transitions/Slide'
import { Grid } from 'types'
import { BotSolver } from './BotSolver'
import { HumanSolver } from './HumanSolver'
import { RadioGroup } from './RadioGroup'
import { Spinner } from './Spinner'

export const App = () => {
  const [mode, setMode] = useLocalStorage<Mode>('mode', HUMAN)

  const [puzzle, setPuzzle] = useState<Grid>()
  const [puzzleToLoad, setPuzzleToLoad] = useState<string>()
  const [level, setLevel] = useLocalStorage('level', 0)

  const [showSettings, setShowSettings] = useState(false)
  const [showLoadGame, setShowLoadGame] = useState(false)

  const loadInput = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    newGame(level)
  }, [level])

  const newGame = (level: number) => {
    getPuzzle(level).then(p => {
      const puzzle = toGrid(p)
      setPuzzle(puzzle)
    })
  }

  return puzzle ? (
    <>
      <div
        className="h-dvh p-2 pb-12 w-[36rem] max-w-full mx-auto flex flex-col gap-4 touch-none select-none relative"
        style={{ containerType: 'size' }}
      >
        <div className="grow">
          {mode === BOT ? ( //
            <BotSolver puzzle={puzzle} />
          ) : (
            <HumanSolver puzzle={puzzle} onNewGame={() => newGame(level)} />
          )}
        </div>

        {/* Settings button */}
        <button className="button button-lg absolute bottom-12 right-6 z-10" onClick={() => setShowSettings(true)}>
          <IconSettings className="h-4 w-4" />
        </button>

        {/* Settings dialog */}
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
                  <div className="flex flex-col gap-5 bg-white px-4 py-12 w-[36rem] max-w-full mx-auto">
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
                    <p className="flex flex-row gap-2">
                      <button className="button button-md" onClick={() => newGame(level)}>
                        <IconRefresh className="h-4 w-4" />
                        New game
                      </button>
                      <button
                        className="button button-md"
                        onClick={() => {
                          setShowSettings(false)
                          setShowLoadGame(true)
                          loadInput.current?.focus()
                          setTimeout(() => loadInput.current?.focus(), 300)
                        }}
                      >
                        <IconUpload className="h-4 w-4" />
                        Load
                      </button>
                    </p>
                  </div>
                </Dialog.Panel>
              </Slide>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Load game dialog */}
        <Transition.Root show={showLoadGame} as={Fragment}>
          <Dialog as="div" className="relative z-50 " onClose={setShowLoadGame} initialFocus={loadInput}>
            <Fade>
              <Backdrop />
            </Fade>
            <div className="fixed bottom-0 w-full ">
              <Slide>
                <Dialog.Panel>
                  <div className="flex flex-col gap-5 bg-white p-4 w-[36rem] max-w-full mx-auto">
                    <p className="text-sm">Load game</p>
                    <textarea
                      className="w-full h-64 border font-mono p-2 text-sm rounded"
                      onChange={e => {
                        const puzzleToLoad = e.target.value
                          .trim()
                          .split('\n')
                          .map(line => line.trim())
                          .join('\n')
                        setPuzzleToLoad(puzzleToLoad)
                      }}
                      value={puzzleToLoad}
                      ref={loadInput}
                    />
                    <div className="flex flex-row justify-between gap-2">
                      <button className="button button-sm" onClick={() => setShowLoadGame(false)}>
                        Cancel
                      </button>
                      <button
                        className="button button-sm"
                        onClick={() => {
                          if (!puzzleToLoad || puzzleToLoad.length === 0) return
                          const puzzle = toGrid(puzzleToLoad)
                          setPuzzle(puzzle)
                          setPuzzleToLoad('')
                          setShowLoadGame(false)
                        }}
                      >
                        Load
                      </button>
                    </div>
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
