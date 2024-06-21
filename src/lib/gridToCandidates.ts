import { peers } from 'lib/peers'
import { numbers } from 'lib/constants'
import { type Grid } from 'types'

export const gridToCandidates = (grid: Grid) =>
  Object.fromEntries(
    grid.map((value, i) => {
      // if the cell is already solved, return the value
      if (value > 0) return [i, [value]]
      // find candidates for each unsolved cell
      const noMatchingPeer = (v: number) => !peers[i].some(peer => grid[peer] === v)
      return [i, numbers.filter(noMatchingPeer)]
    })
  )
