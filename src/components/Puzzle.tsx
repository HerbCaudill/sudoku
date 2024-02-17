import cx from 'classnames'
import { Grid, InterimResult, cols, numbers, rows } from '../solver'
import { useState } from 'react'

export const Puzzle = ({ puzzle, step, number }: { puzzle: Grid; step: InterimResult; number: number }) => {
  const { state, index, value } = step
  const [grid, setGrid] = useState(step.grid)
  const [candidates, setCandidates] = useState(step.candidates ?? {})
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
                // 'bg-blue-100': value && !isFixed, //
                'bg-neutral-100': isFixed,
                'hover:bg-neutral-50': !isFixed,

                'border-r border-r-neutral-400': [1, 2, 4, 5, 7, 8].includes(cols[i]),
                'border-r-[.6cqw] border-r-black': [3, 6].includes(cols[i]),
                'border-b border-b-neutral-400': [1, 2, 4, 5, 7, 8].includes(rows[i]),
                'border-b-[.6cqw] border-b-black': [3, 6].includes(rows[i]),
              })}
              // set value on double click
              onDoubleClick={() => {
                if (isFixed) return // can't modify fixed cells
                // TODO check

                const newGrid = [...grid]
                if (newGrid[i] === number) newGrid[i] = 0
                else newGrid[i] = number
                setGrid(newGrid)
              }}
              // set candidates on click
              onClick={() => {
                if (isFixed) return // can't modifyx fixed cells
                if (value) return // no candidates for cells with value
                const newCandidates = { ...candidates }
                const cellCandidates = newCandidates[i] ?? []
                if (cellCandidates.includes(number)) {
                  newCandidates[i] = cellCandidates.filter(n => n !== number)
                } else {
                  newCandidates[i] = [...cellCandidates, number]
                }
                setCandidates(newCandidates)
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
