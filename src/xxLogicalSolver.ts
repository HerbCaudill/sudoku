import { cells, numbers } from './constants.js'
import { getGridCandidates } from './getCandidates.js'
import { boxPeers, colPeers, peers, rowPeers } from './peers.js'
import { Grid } from './types.js'
import { box, col, row } from './units.js'

export function logicalSolver(grid: Grid) {
  let candidates = getGridCandidates(grid)
  let failed: boolean = false
  let solved: boolean = false
  let nextCell: number | undefined = undefined

  const propagateConstraints = () => {
    let propagate = false

    // if there are any naked singles, eliminate those values from peers
    getCellSingles().forEach(([index, single]) => {
      peers[index] //
        .filter(hasCandidate(single))
        .forEach(peer => {
          removeCandidate(peer, single)
          propagate = true
        })
    })

    // if there are any hidden singles, eliminate those values from peers
    const unitType = [rowPeers, colPeers, boxPeers]
    unitType.forEach(unitPeers => {
      getUnitSingles(unitPeers).forEach(([index, value]) => {
        unitPeers[index] //
          .filter(hasCandidate(value))
          .forEach(peer => {
            removeCandidate(peer, value)
            propagate = true
          })
        // set this as the only candidate for this cell
        candidates[index] = [value]
      })
    })

    // can we generalize to doubles, triples, etc?
    // if there are any boxes whose values can only go in one row or column, eliminate those values from other cells in that row or column
    // if we haven't made any changes, don't keep looping
    return propagate
  }

  const removeCandidate = (index: number, value: number) => {
    candidates[index] = candidates[index].filter(v => v !== value)
  }

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
    const singles = getCellSingles()
    if (
      singles.some(([index, single]) => {
        const singlePeers = peers[index].filter(hasOneCandidate)
        return singlePeers.some(hasCandidate(single))
      })
    )
      return true
  }

  // filter predicates
  const hasNoCandidates = (index: number) => candidates[index].length === 0

  const hasOneCandidate = (index: number) => candidates[index].length === 1

  const hasMultipleCandidates = (index: number) => candidates[index].length > 1

  const hasCandidate = (value: number) => (index: number) => candidates[index].includes(value)

  // utilities

  const applySolvedCells = () => {
    return grid.map((value, index) => {
      if (candidates[index].length === 1) return candidates[index][0]
      else return value
    }) as Grid
  }

  const getUnsolvedCells = () => cells.filter(hasMultipleCandidates)

  const isSolved = () => getUnsolvedCells().length === 0

  // choose a cell with the fewest candidates
  const pickNextCell = () => {
    const unsolvedCells = getUnsolvedCells()
    return unsolvedCells.reduce(
      (minIndex, currentIndex) =>
        candidates[currentIndex].length < candidates[minIndex].length ? currentIndex : minIndex,
      unsolvedCells[0]
    )
  }

  /** "naked" singles */
  const getCellSingles = () => {
    return cells //
      .filter(hasOneCandidate)
      .map(index => {
        const single = candidates[index][0]
        return [index, single] as const
      })
  }

  /** "hidden" singles - candidates that are only found once in a row/col/box */
  const getUnitSingles = (unitPeers: number[][]) => {
    return getUnsolvedCells()
      .map(index => {
        const isAloneInUnit = (candidate: number) =>
          !unitPeers[index] //
            .some(hasCandidate(candidate))

        const single = candidates[index].find(isAloneInUnit)
        if (single) return [index, single]
      })
      .filter(Boolean) as [number, number][] // eliminate cases where no single was found
  }

  // main loop

  do {
    // if there are contradictions, return false
    if (hasContradictions()) {
      failed = true
      break
    }

    // if there are no unsolved cells, we're done
    if (cells.every(hasOneCandidate)) {
      solved = true
      break
    }

    // iteratively propagate constraints until nothing changes
  } while (propagateConstraints())

  if (!failed) {
    grid = applySolvedCells()
    nextCell = pickNextCell()
    solved = isSolved()
  }

  return { candidates, failed, solved, nextCell, grid }
}
