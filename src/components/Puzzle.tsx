import cx from 'classnames'
import { CandidateGrid, Grid, SolverState, cols, numbers, rows } from '../solver'
import { useState } from 'react'

export const Puzzle = ({
  puzzle,
  grid,
  candidates = {},
  state,
  index,
  selectedNumber = 0,
  onSetValue = () => {},
  onAddCandidate = () => {},
  onRemoveCandidate = () => {},
}: Props) => {
  const [swipeAction, setSwipeAction] = useState<'remove' | 'add' | null>(null)
  const [lastTap, setLastTap] = useState(0)

  const swipeStart = (i: number) => {
    if (isFixed(i)) return
    // detect double tap
    let now = new Date().getTime()
    let interval = now - lastTap
    if (interval < 600) {
      // double tap
      onSetValue(i)
    } else {
      // single tap
      if (grid[i]) return
      const cellCandidates = candidates[i] ?? []
      if (cellCandidates.includes(selectedNumber)) {
        setSwipeAction('remove')
        onRemoveCandidate(i)
      } else {
        setSwipeAction('add')
        onAddCandidate(i)
      }
    }
    setLastTap(now)
  }

  const swipeMove = ({ clientX, clientY }: React.PointerEvent) => {
    const element = document.elementFromPoint(clientX, clientY)
    const i = Number(element?.getAttribute('data-index'))
    if (!i) return
    if (isFixed(i)) return
    if (grid[i]) return
    if (swipeAction === 'remove') onRemoveCandidate(i)
    else if (swipeAction === 'add') onAddCandidate(i)
  }

  const swipeEnd = () => {
    setSwipeAction(null)
  }

  const isFixed = (i: number) => puzzle[i] > 0

  return (
    <div className="aspect-square touch-none" onTouchEnd={swipeEnd}>
      <div className="grid grid-rows-9 h-full grid-cols-9 border-black border-4 bg-white">
        {grid.map((v, i) => {
          const cellCandidates = candidates[i]?.length > 0 ? candidates[i] : null
          const value = v > 0 ? v : null

          return (
            <div
              className={cx('flex content-center justify-center items-center border-black cursor-pointer ', {
                'animate-highlight': index === i && state !== 'CONTRADICTION',
                'animate-contradiction': index === i && state === 'CONTRADICTION',

                'bg-neutral-400 text-white': selectedNumber === value,
                'bg-primary-100': value === null && cellCandidates?.includes(selectedNumber),

                'border-r border-r-neutral-400': [1, 2, 4, 5, 7, 8].includes(cols[i]),
                'border-r-[.6cqw] border-r-black': [3, 6].includes(cols[i]),
                'border-b border-b-neutral-400': [1, 2, 4, 5, 7, 8].includes(rows[i]),
                'border-b-[.6cqw] border-b-black': [3, 6].includes(rows[i]),
              })}
              onPointerDown={e => swipeStart(i)}
              onPointerMove={swipeMove}
              onPointerUp={swipeEnd}
              data-index={i}
              key={i}
            >
              {value ? (
                // value
                <div className={cx({ 'font-bold ': isFixed(i) }, 'text-[4cqw] p-2')}>{value}</div>
              ) : (
                // candidates
                <div className={cx('w-full px-2 grid grid-rows-3 grid-cols-3 text-[2cqw] text-neutral-500')}>
                  {numbers.map((val, i) => (
                    <span key={i} className="text-center">
                      {cellCandidates?.includes(val) ? val : ' '}
                    </span>
                  ))}
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
}
