import cx from 'classnames'
import { CandidateGrid, Grid, SolverState, cols, numbers, rows } from '../solver'

export const Puzzle = ({
  puzzle,
  grid,
  candidates = {},
  state,
  index,
  onSetValue = () => {},
  onSetCandidate = () => {},
  number = 0,
}: Props) => {
  return (
    <div className="aspect-square">
      <div className="grid grid-rows-9 h-full grid-cols-9 border-black border-4 bg-white">
        {grid.map((v, i) => {
          const isFixed = puzzle[i] > 0
          const cellCandidates = candidates[i]?.length > 0 ? candidates[i] : null
          const value = v > 0 ? v : null

          return (
            <div
              className={cx('flex content-center justify-center items-center border-black cursor-pointer ', {
                'animate-highlight': index === i && state !== 'CONTRADICTION',
                'animate-contradiction': index === i && state === 'CONTRADICTION',

                // 'bg-neutral-100': isFixed && number !== value,
                // 'hover:bg-neutral-50': !isFixed
                'bg-neutral-4 00 text-white': number === value,
                'bg-primary-100': value === null && cellCandidates?.includes(number),

                'border-r border-r-neutral-400': [1, 2, 4, 5, 7, 8].includes(cols[i]),
                'border-r-[.6cqw] border-r-black': [3, 6].includes(cols[i]),
                'border-b border-b-neutral-400': [1, 2, 4, 5, 7, 8].includes(rows[i]),
                'border-b-[.6cqw] border-b-black': [3, 6].includes(rows[i]),
              })}
              onDoubleClick={() => {
                if (isFixed) return
                onSetValue(i)
              }}
              onClick={() => {
                if (isFixed) return
                if (value) return
                onSetCandidate(i)
              }}
              key={i}
            >
              {value ? (
                // value
                <div className={cx({ 'font-bold ': isFixed }, 'text-[4cqw] p-2')}>{value}</div>
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

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

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

  /** handler for setting cell value */
  onSetValue?: (i: number) => void

  /** handler for toggling cell candidate */
  onSetCandidate?: (i: number) => void

  /** currently selected number (for highlighting candidate cells) */
  number?: number
}
