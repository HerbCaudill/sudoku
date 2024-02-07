import cx from 'classnames'
import { useState } from 'react'
import { cols, rows } from '../solver/constants'
import { generate } from '../solver/generate'

export const App = () => {
  const [{ puzzle, solution }] = useState(() => generate())
  return (
    <div className="p-8  aspect-square w-96 max-w-full max-h-lvh">
      <div className="grid grid-rows-9 h-full grid-cols-9  border-black border-4 bg-white">
        {puzzle.map((val, i) => {
          return (
            <div
              className={cx('flex content-center justify-center items-center border-black', {
                'border-r border-r-gray-300': [1, 2, 4, 5, 7, 8].includes(cols[i]),
                'border-r-2 border-r-black': [3, 6].includes(cols[i]),
                'border-b border-b-gray-300': [1, 2, 4, 5, 7, 8].includes(rows[i]),
                'border-b-2 border-b-black': [3, 6].includes(rows[i]),
              })}
              key={i}
            >
              {val || ''}
            </div>
          )
        })}
      </div>
    </div>
  )
}
