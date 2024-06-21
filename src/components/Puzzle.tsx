import cx from 'classnames'
import { useState } from 'react'
import { cols, numbers, rows, type CellCandidate, type Move } from 'solver'
import type { CandidateGrid, Grid, SolverState } from 'types'

const DOUBLE_TAP_INTERVAL = 400

export const Puzzle = ({
  puzzle,
  solution,
  grid,
  candidates = {},
  state,
  index,
  hint,
  selectedNumber = 0,
  onSetValue = () => {},
  onAddCandidate = () => {},
  onRemoveCandidate = () => {},
}: Props) => {
  // in a swipe gesture, we add candidates or remove candidates based on whether
  // the first cell we touched had the selected number
  const [pointerAction, setPointerAction] = useState<'remove' | 'add' | null>(null)

  // track the last tap for each cell
  const [lastTap, setLastTap] = useState<Record<number, number>>({})

  const pointerDown = (i: number) => {
    // detect double tap
    let now = new Date().getTime()
    let interval = now - lastTap[i]
    setLastTap({ ...lastTap, [i]: now })
    if (interval < DOUBLE_TAP_INTERVAL) {
      // double tap: set value
      onSetValue(i)
    } else {
      // single tap or swipe: toggle candidates
      if (candidates[i]?.includes(selectedNumber)) {
        setPointerAction('remove')
        onRemoveCandidate(i)
      } else {
        setPointerAction('add')
        onAddCandidate(i)
      }
    }
  }

  const pointerMove = ({ clientX, clientY }: React.PointerEvent) => {
    if (pointerAction === null) return

    // find the element under the pointer
    const element = document.elementFromPoint(clientX, clientY)
    const index = element?.getAttribute('data-index')

    if (index === undefined) return // no element
    if (index === null) return // no data-index attribute

    const i = Number(index)
    if (pointerAction === 'remove') onRemoveCandidate(i)
    else if (pointerAction === 'add') onAddCandidate(i)
  }

  const pointerUp = () => setPointerAction(null)

  const hintRemove = ({ index, value }: CellCandidate) =>
    hint?.removals.find(r => r.index === index && r.value === value) !== undefined

  const hintHighlight = ({ index, value }: CellCandidate) =>
    hint?.matches.find(r => r.index === index && r.value === value) !== undefined

  return (
    <div className="aspect-square outlinepointer-events-none">
      <div className="grid grid-rows-9 h-full grid-cols-9 border-black border-4 bg-white">
        {grid.map((v, i) => {
          const cellCandidates = candidates[i]?.length > 0 ? candidates[i] : null
          const value = v > 0 ? v : null
          const isMistake = value && solution && solution[i] && value !== solution[i]

          // CELL
          return (
            <div
              className={cx(
                'flex content-center justify-center items-center aspect-square', //
                'pointer-events-auto cursor-pointer ',
                {
                  'animate-highlight': index === i && state !== 'CONTRADICTION',
                  'animate-contradiction': index === i && state === 'CONTRADICTION',

                  'bg-danger-500 text-white': isMistake,
                  'bg-neutral-400/60 text-white': !isMistake && selectedNumber === value,
                  'bg-primary-100': value === null && cellCandidates?.includes(selectedNumber),

                  'border-r border-r-neutral-400': [1, 2, 4, 5, 7, 8].includes(cols[i]),
                  'border-r-[.6cqw] border-r-black': [3, 6].includes(cols[i]),
                  'border-b border-b-neutral-400': [1, 2, 4, 5, 7, 8].includes(rows[i]),
                  'border-b-[.6cqw] border-b-black': [3, 6].includes(rows[i]),
                }
              )}
              onPointerDown={e => pointerDown(i)}
              onPointerMove={e => pointerMove(e)}
              onPointerUp={e => pointerUp()}
              data-index={i}
              key={i}
            >
              {value ? (
                // value
                <div
                  className={cx(
                    { 'font-bold ': puzzle[i] === 0 }, // values we've solved are bold
                    'pointer-events-none text-[5cqw]'
                  )}
                >
                  {value}
                </div>
              ) : (
                // candidates grid
                <div
                  className={cx(
                    'pointer-events-none',
                    'w-full h-full grid grid-rows-3 grid-cols-3 text-[2.2cqw] p-[1px] text-neutral-500'
                  )}
                >
                  {numbers.map((val, j) => {
                    const include = cellCandidates?.includes(val)
                    return (
                      <span
                        key={j}
                        className={cx(
                          'text-center rounded-full border border-transparent size-[3.4cqw] leading-[3.2cqw] aspect-square',
                          {
                            'border-danger-600 text-danger-300': include && hintRemove({ index: i, value: val }),
                            'border-blue-500k text-white bg-primary-500':
                              include && hintHighlight({ index: i, value: val }),
                          }
                        )}
                      >
                        {include ? val : ' '}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

type Props = {
  /** initial state of the puzzle */
  puzzle: Grid

  /** solution to the puzzle (used for flagging mistakes) */
  solution?: Grid

  /** current solved values of the puzzle */
  grid: Grid

  /** current candidates for each cell */
  candidates?: CandidateGrid

  // BOT SOLVER

  /** current state of the solver */
  state?: SolverState

  /** index of the cell that was just set */
  index?: number

  /** value of the cell that was just set */
  value?: number

  // HUMAN SOLVER

  /** currently selected number (for highlighting candidate cells) */
  selectedNumber?: number

  /** handler for setting cell value */
  onSetValue?: (i: number) => void

  /** handler for adding cell candidate */
  onAddCandidate?: (i: number) => void

  /** handler for removing cell candidate */
  onRemoveCandidate?: (i: number) => void

  hint?: Move
}
