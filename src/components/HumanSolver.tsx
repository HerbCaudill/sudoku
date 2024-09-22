import * as changeCase from 'change-case'
import { numbers } from 'lib/constants'
import { printGrid } from 'lib/printGrid'
import { useEffect, useReducer, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { getInitialState, reducer } from 'reducer'
import { Board } from 'solver/Board'
import { type Move } from 'solver/findNextMove'
import type { Grid } from 'types'
import { Confetti } from './Confetti'
import { Puzzle } from './Puzzle'
import { RadioGroup } from './RadioGroup'

const numberKeys = numbers.map(n => n.toString())

export const HumanSolver = ({ puzzle, onNewGame }: Props) => {
  // STATE

  const [state, dispatch] = useReducer(reducer, getInitialState())
  const [hint, setHint] = useState<Move>()

  useEffect(() => {
    if (!puzzle || puzzle.length === 0) return
    dispatch({ type: 'LOAD', puzzle })
  }, [puzzle])

  const [number, setNumber] = useState(1)

  // HOTKEYS

  useHotkeys(['space', 'right'], e => {
    e.preventDefault()
    nextNumber()
  })
  useHotkeys(['shift+space', 'left'], e => {
    e.preventDefault()
    prevNumber()
  })
  useHotkeys(['mod+z', 'z'], () => dispatch({ type: 'UNDO' }))
  useHotkeys(['mod+y', 'y'], () => dispatch({ type: 'REDO' }))
  useHotkeys(['mod+backspace'], () => reset())
  useHotkeys(numberKeys, (e, { keys }) => {
    const numberKey = +keys!.join('')
    setNumber(numberKey)
  })

  useHotkeys(['escape'], () => clearHint())
  useHotkeys(['h', 'H'], () => getHint())
  useHotkeys(['f', 'F'], () => fill())

  // HELPERS

  const isSolved = state.grid.every((value, i) => value === state.solution[i])

  const setValue = (index: number) => {
    if (puzzle[index]) return // can't change fixed cells
    const value = state.grid[index] === number ? 0 : number // toggle between value & blank
    dispatch({ type: 'SET', index, value })
  }

  const toggle = (type: 'ADD' | 'REMOVE') => (index: number) => {
    if (puzzle[index]) return // can't change fixed cells
    if (state.grid[index] > 0) return // can't add candidates to cells with values
    dispatch({ type, index, candidate: number })
  }

  const nextNumber = () =>
    setNumber(n => {
      if (isSolved) return n // don't change number when solved

      // find the next number that has incomplete cells
      for (let i = 1; i <= 9; i++) {
        const next = (n + i) % 10 || 1

        if (!numberIsComplete(next)) return next
      }
      return n
    })

  const prevNumber = () =>
    setNumber(n => {
      if (isSolved) return n // don't change number when solved

      // find the previous number that has incomplete cells
      for (let i = 0; i < 9; i++) {
        const prev = (n - i + 9) % 10 || 9
        if (!numberIsComplete(prev)) return prev
      }
      return n
    })

  const reset = () => {
    setNumber(1)
    dispatch({ type: 'RESET' })
  }

  const getHint = () => {
    const { grid, candidates } = state

    const board = new Board(
      Object.keys(candidates).length === 0 ? { grid: state.grid } : { candidates: state.candidates }
    )
    const hint = board.findNextMove()
    if (hint && hint.matches?.length) {
      setNumber(hint.matches[0].value)
      setHint(hint)
    }
    setTimeout(() => clearHint(), 2100)
  }

  const clearHint = () => setHint(undefined)

  const fill = () => {
    const { candidates } = new Board({ grid: state.grid })
    dispatch({ type: 'SET_CANDIDATES', candidates })
  }

  const numberIsComplete = (n: number) => state.grid.filter(v => v === n).length === 9

  if (!state.grid?.length) return null

  return (
    <div className="flex flex-col gap-4 h-full">
      <Puzzle
        puzzle={puzzle}
        solution={state.solution}
        grid={state.grid}
        candidates={state.candidates}
        hint={hint}
        onSetValue={setValue}
        onAddCandidate={toggle('ADD')}
        onRemoveCandidate={toggle('REMOVE')}
        selectedNumber={number}
      />
      {isSolved ? (
        <>
          <Confetti />

          <div className="flex items-center w-full justify-center">
            <button className="button button-lg" onClick={onNewGame}>
              <IconRefresh className="size-4" />
              New game
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4 grow">
          {/* Numbers 1-9 */}
          <RadioGroup
            value={number}
            onChange={n => setNumber(n)}
            size="xs"
            options={numbers.map(n => ({ value: n, disabled: numberIsComplete(n) }))}
            className="w-full"
            optionClassName="grow text-[3cqw] py-[2cqw]"
          />

          {/* next/prev number */}
          <div className="grow">
            <div className="flex flex-row w-full gap-2">
              <button className="button h-12 grow" onClick={prevNumber}>
                <IconArrowLeft className="size-4" aria-hidden="true" />
              </button>
              <button className="button h-12 grow" onClick={nextNumber}>
                <IconArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* hint */}
          {hint && (
            <div className="animate-hint opacity-0 font-sans text-sm border border-gray-600 bg-white/50 rounded p-2 flex flex-row gap-2 ">
              <IconBulb className="size-4 text-gray-600" aria-hidden="true" />
              <span>{changeCase.sentenceCase(hint.label)}</span>
            </div>
          )}

          {/* buttons */}
          <div className="flex flex-row gap-2 pb-12">
            <button
              className="button button-sm"
              title="Copy"
              onClick={() => {
                const { grid } = state
                const text = printGrid(grid)
                navigator.clipboard.writeText(text)
              }}
            >
              <IconCopy className="size-4" aria-hidden="true" />
              Copy
            </button>

            <button className="button button-sm" title="Fill candidates" onClick={fill}>
              <Icon123 className="size-4" aria-hidden="true" />
              Fill
            </button>

            <button className="button button-sm" title="Move" onClick={getHint}>
              <IconBulb className="size-4" aria-hidden="true" />
              Hint
            </button>
          </div>

          {/* undo/redo/reset */}
          <div className="flex flex-row gap-2">
            <button className="button button-lg" title="Undo" onClick={() => dispatch({ type: 'UNDO' })}>
              <IconArrowBackUp className="size-4" aria-hidden="true" />
            </button>
            <button className="button button-lg" title="Redo" onClick={() => dispatch({ type: 'REDO' })}>
              <IconArrowForwardUp className="size-4" aria-hidden="true" />
            </button>
            <button className="button button-lg" title="Reset" onClick={() => reset()}>
              <IconTrash className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

type Props = {
  puzzle: Grid
  onNewGame: () => void
}
