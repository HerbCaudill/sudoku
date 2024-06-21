import { boxes, cols, rows } from './constants'
import { Grid } from 'types'

/** returns the indices of all elements of row/col/box #n */

export const unit = (whichUnit: Grid) => (n: number) => {
  return whichUnit
    .map((value, index) => [value, index]) // transform to array of [value, index]
    .filter(([value, _index]) => value === n) // only include the ones matching n
    .map(([_value, index]) => index) // only return the indices
}

export const row = unit(rows)
export const col = unit(cols)
export const box = unit(boxes)

export const unitByType = { row, col, box }
