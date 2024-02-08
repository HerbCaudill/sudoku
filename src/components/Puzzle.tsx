import cx from 'classnames'
import { Grid, InterimResult, cols, numbers, rows } from '../solver'

export const Puzzle = ({ puzzle, step }: { puzzle: Grid; step: InterimResult }) => {
  const { grid, candidates = {}, state, index, value } = step
  return (
    <div className="aspect-square" style={{ containerType: 'size' }}>
      <div className="grid grid-rows-9 h-full grid-cols-9  border-black border-4 bg-white">
        {grid.map((v, i) => {
          const isFixed = puzzle[i] > 0
          const cellCandidates = candidates[i]?.length > 0 ? candidates[i] : null
          const value = v > 0 ? v : null

          return (
            <div
              className={cx('flex content-center justify-center items-center border-black', {
                // 'animate-highlight': index === i && state !== 'CONTRADICTION',
                'animate-contradiction': index === i && state === 'CONTRADICTION',
                'bg-blue-100': value && !isFixed, //

                'border-r border-r-gray-300': [1, 2, 4, 5, 7, 8].includes(cols[i]),
                'border-r-[.6cqw] border-r-black': [3, 6].includes(cols[i]),
                'border-b border-b-gray-300': [1, 2, 4, 5, 7, 8].includes(rows[i]),
                'border-b-[.6cqw] border-b-black': [3, 6].includes(rows[i]),
              })}
              key={i}
            >
              {value ? (
                <div
                  className={cx(
                    { 'font-bold': isFixed }, //
                    'text-[4cqw] p-2'
                  )}
                >
                  {value}
                </div>
              ) : (
                <div
                  className={cx(
                    'aspect-square w-full grid grid-rows-3 grid-cols-3', //
                    'text-[2.3cqw] text-gray-500'
                  )}
                >
                  {numbers.map((val, i) => (
                    <div key={i} className="flex content-center justify-center items-center text-center aspect-square">
                      <div className="">{cellCandidates?.includes(val) ? val : ''}</div>
                    </div>
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
