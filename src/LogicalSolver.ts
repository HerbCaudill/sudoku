import { cells, numbers } from './constants.js'
import { boxPeers, colPeers, peers, rowPeers } from './peers.js'
import { box, col, row } from './units.js'
import { CandidateGrid, Grid } from './types.js'
import { getGridCandidates } from './getCandidatesNew.js'

export class LogicalSolver {
  candidates: CandidateGrid
  failed: boolean = false
  solved: boolean = false
  nextCell: number

  constructor(public grid: Grid) {
    try {
      this.calculate()
      this.grid = this.applySolvedCells()
      this.nextCell = this.pickNextCell()
      this.solved = this.isSolved()
    } catch (e) {
      this.failed = true
    }
  }

  calculate = () => {
    this.candidates = getGridCandidates(this.grid)
    do {
      // if there are contradictions, return false
      if (this.hasContradictions()) throw new Error('reached contradiction')

      // if there are no unsolved cells, we're done - return the solved grid
      if (cells.every(this.hasOneCandidate)) return this.candidates

      // iteratively propagate constraints until nothing changes
    } while (this.propagateConstraints())
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

  applySolvedCells = () => {
    return this.grid.map((value, index) => {
      if (this.candidates[index].length === 1) return this.candidates[index][0]
      else return value
    }) as Grid
  }

  getUnsolvedCells = () => cells.filter(this.hasMultipleCandidates)

  isSolved = () => this.getUnsolvedCells().length === 0

  // choose a cell with the fewest candidates
  pickNextCell = () => {
    const unsolvedCells = this.getUnsolvedCells()
    return unsolvedCells.reduce(
      (minIndex, currentIndex) =>
        this.candidates[currentIndex].length < this.candidates[minIndex].length ? currentIndex : minIndex,
      unsolvedCells[0]
    )
  }

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
    return this.getUnsolvedCells()
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
