import { cells, numbers } from './constants.js'
import { boxPeers, colPeers, peers, rowPeers } from './peers.js'
import { box, col, row } from './units.js'
import { CandidateGrid, Grid, SingleMap } from './types.js'

export class Candidates {
  candidates: CandidateGrid

  constructor(private grid: Grid) {
    this.candidates = getGridCandidates(this.grid)
  }

  find = () => {
    const { hasOneCandidate } = this
    do {
      // if there are no unsolved cells, we're done - return the solved grid
      if (cells.every(hasOneCandidate)) return this.candidates

      // if there are contradictions, return false
      if (this.hasContradictions()) return false

      // iteratively propagate constraints until nothing changes
    } while (this.propagateConstraints())

    return this.candidates
  }

  propagateConstraints = () => {
    let propagate = false

    // if there are any naked singles, eliminate those values from peers
    this.getCellSingles().forEach(([index, single]) => {
      peers[index] //
        .filter(this.hasCandidate(single))
        .forEach(peer => {
          this.removeCandidate(peer, single)
          propagate = true
        })
    })

    // if there are any hidden singles, eliminate those values from peers
    const unitType = [rowPeers, colPeers, boxPeers]
    unitType.forEach(unitPeers => {
      this.getUnitSingles(unitPeers).forEach(([index, value]) => {
        unitPeers[index] //
          .filter(this.hasCandidate(value))
          .forEach(peer => {
            this.removeCandidate(peer, value)
            propagate = true
          })
        // set this as the only candidate for this cell
        this.candidates[index] = [value]
      })
    })

    // can we generalize to doubles, triples, etc?

    // if there are any boxes whose values can only go in one row or column, eliminate those values from other cells in that row or column

    // if we haven't made any changes, don't keep looping
    return propagate
  }

  removeCandidate = (index: number, value: number) => {
    this.candidates[index] = this.candidates[index].filter(v => v !== value)
  }

  hasContradictions = () => {
    const { hasNoCandidates, hasOneCandidate, hasCandidate } = this

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
    const singles = this.getCellSingles()
    if (
      singles.some(([index, single]) => {
        const singlePeers = peers[index].filter(hasOneCandidate)
        return singlePeers.some(hasCandidate(single))
      })
    )
      return true
  }

  // filter predicates

  hasNoCandidates = (index: number) => this.candidates[index].length === 0

  hasOneCandidate = (index: number) => this.candidates[index].length === 1

  hasMultipleCandidates = (index: number) => this.candidates[index].length > 1

  hasCandidate = (value: number) => (index: number) => this.candidates[index].includes(value)

  // utilities

  /** "naked" singles */
  getCellSingles = () => {
    return cells //
      .filter(this.hasOneCandidate)
      .map(index => {
        const single = this.candidates[index][0]
        return [index, single] as const
      })
  }

  /** "hidden" singles - candidates that are only found once in a row/col/box */
  getUnitSingles = (unitPeers: number[][]) => {
    return cells
      .filter(index => this.hasMultipleCandidates(index)) // we deal with naked singles elsewhere
      .map(index => {
        const isAloneInUnit = (candidate: number) =>
          !unitPeers[index] //
            .some(this.hasCandidate(candidate))

        const single = this.candidates[index].find(isAloneInUnit)
        if (single) return [index, single]
      })
      .filter(Boolean) as [number, number][] // eliminate cases where no single was found
  }
}

export const getCandidates = (grid: Grid) => {
  return new Candidates(grid).find()
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

export const isSolved = (candidates: CandidateGrid) => cells.every(index => candidates[index].length === 1)
