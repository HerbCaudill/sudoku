import { getUnsolvedCells } from './getUnsolvedCells.js'
import { peers } from './peers.js'
import { Grid } from './types.js'

export const getCandidates = (grid: Grid) => {
  const gridCandidates = getUnsolvedCells(grid).reduce<Record<number, number[]>>((result, i) => {
    const peerHas = (value: number) => (peer: number) => grid[peer] === value
    const ourPeers = peers[i]
    const cellCandidates = numbers.filter(value => !ourPeers.some(peerHas(value)))
    return {
      ...result,
      [i]: cellCandidates,
    }
  }, {})
  return gridCandidates
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
