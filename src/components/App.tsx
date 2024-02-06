import { useState } from 'react'
import { generate } from '../solver/generate'
import cx from 'classnames'
import { col } from 'solver/units'
import { cols, rows } from '../solver/constants'

export const App = () => {
  const [{ puzzle, solution }] = useState(() => generate())
  return (
    <div className="p-8">
      <div className="grid grid-flow-row grid-cols-9 w-96 h-96  border-black border-4 bg-white">
        {puzzle.map((val, i) => {
          return (
            <div
              className={cx('flex content-center justify-center items-center border-black', {
                'border-r': [1, 2, 4, 5, 7, 8].includes(cols[i]),
                'border-r-4': [3, 6].includes(cols[i]),
                'border-b': [1, 2, 4, 5, 7, 8].includes(rows[i]),
                'border-b-4': [3, 6].includes(rows[i]),
              })}
              key={i}
            >
              {val}
            </div>
          )
        })}
      </div>
    </div>
  )
}
