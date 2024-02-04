import { cells, numbers } from './constants.js'
import { peers } from './peers.js'
import { box, col, row } from './units.js'
import { CandidateGrid, Grid } from './types.js'

export const getCandidates = (grid: Grid) => {
  const candidates = cells.reduce<Record<number, number[]>>((result, i) => {
    if (grid[i] !== 0) {
      return { ...result, [i]: [grid[i]] }
    } else {
      const peerHas = (value: number) => (peer: number) => grid[peer] === value
      const ourPeers = peers[i]
      const cellCandidates = numbers.filter(value => !ourPeers.some(peerHas(value)))
      return { ...result, [i]: cellCandidates }
    }
  }, {})
  if (hasContradictions(candidates)) return false
  else return candidates
}

export const hasContradictions = (candidates: CandidateGrid) => {
  const unitHasCandidatesFor = (value: number) => (index: number) => candidates[index].includes(value)

  // if any cell has no candidates
  if (cells.some(index => candidates[index].length === 0)) return true

  // if any value has no candidates in a row, column, or box
  if (
    [row, col, box].some(unit =>
      numbers.some(unitNumber => {
        const thisUnit = unit(unitNumber)
        return numbers.some(value => {
          return thisUnit.some(unitHasCandidatesFor(value)) === false
        })
      })
    )
  )
    return true
}
