import { cells, numbers } from './constants.js'
import { peers } from './peers.js'
import { box, col, row } from './units.js'
import { CandidateGrid, Grid } from './types.js'

export const getCandidates = (grid: Grid) => {
  const candidates = getGridCandidates(grid)
  const hasNoCandidates = (index: number) => candidates[index].length === 0
  const hasOneCandidate = (index: number) => candidates[index].length === 1
  const hasCandidate = (value: number) => (index: number) => candidates[index].includes(value)

  const hasContradictions = () => {
    // if any cell has no candidates
    if (cells.some(hasNoCandidates)) return true

    // if any value has no candidates for a row, column, or box
    if (
      [row, col, box].some(unit =>
        numbers.some(unitNumber =>
          numbers.some(
            value => unit(unitNumber).some(hasCandidate(value)) === false //
          )
        )
      )
    )
      return true

    // if any single-candidate cell has a peer with the same single candidate
    const singles = cells.filter(hasOneCandidate).map(index => {
      const single = candidates[index][0]
      return [index, single] as const
    })
    if (
      singles.some(([index, single]) => {
        const singlePeers = peers[index].filter(hasOneCandidate)
        return singlePeers.some(hasCandidate(single))
      })
    )
      return true
  }

  while (true) {
    // if there are no unsolved cells, we're done - return the solved grid
    if (cells.every(hasOneCandidate)) return candidates

    // if there are contradictions, return false
    if (hasContradictions()) return false

    // constraint propagation:
    if (false) {
      // if there are any singles/doubles/etc, eliminate other values from those cells, and eliminate those values from peers
      continue
    }

    if (false) {
      // if there are any boxes whose values can only go in one row or column, eliminate those values from other cells in that row or column
      continue
    }

    // no further constraints - return the candidates
    return candidates
  }
}

const getGridCandidates = (grid: Grid) =>
  cells.reduce<CandidateGrid>((result, i) => {
    if (grid[i] !== 0) {
      return { ...result, [i]: [grid[i]] }
    } else {
      return { ...result, [i]: getCellCandidates(grid, i) }
    }
  }, {})

const getCellCandidates = (grid: Grid, index: number) => {
  const peerHas = (value: number) => (peer: number) => grid[peer] === value
  return numbers.filter(value => !peers[index].some(peerHas(value)))
}
