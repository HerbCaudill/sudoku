import { boxes, cells, cols, numbers, rows } from './constants.js'
import { getGridCandidates } from './getCandidates.js'
import { boxPeers, colPeers, peers, rowPeers } from './peers.js'
import { Grid } from './types.js'
import { box, col, row, unit as rowOrCol } from './units.js'

export function logicalSolver(grid: Grid) {
  let candidates = getGridCandidates(grid)
  let failed: boolean = false
  let solved: boolean = false
  let nextCell: number | undefined = undefined
  let iterations = 0

  const propagateConstraints = () => {
    iterations += 1
    if (iterations > 50) throw new Error('Too many iterations')

    let propagate = false

    // naked singles/doubles/etc
    for (let N = 1; N <= 4; N++) {
      const tuples = cells.filter(hasCandidateCount(N))
      tuples.forEach(index => {
        const values = candidates[index]
        for (const unitPeers of [rowPeers, colPeers, boxPeers]) {
          const ourPeers = unitPeers[index]
          const matches = ourPeers.filter(hasMatchingCandidates(values))
          // for naked doubles, we need one other match; for triples, two other matches; etc
          if (matches.length === N - 1) {
            ourPeers
              .filter(hasSomeCandidates(values))
              .filter(excluding(matches))
              .forEach(peer => {
                removeCandidates(peer, values)
                propagate = true
              })
          }
        }
      })
    }

    // hidden singles
    for (const unitPeers of [rowPeers, colPeers, boxPeers]) {
      getHiddenSingles(unitPeers).forEach(([index, value]) => {
        unitPeers[index] //
          .filter(hasCandidate(value))
          .forEach(peer => {
            removeCandidates(peer, [value])
            propagate = true
          })
        // set this as the only candidate for this cell
        candidates[index] = [value]
      })
    }

    // TODO: hidden doubles etc.

    // pointing pairs & triples: if there are any boxes whose values can only go in one row or
    // column, eliminate those values from other cells in that row or column
    numbers.forEach(value => {
      numbers.forEach(boxNumber => {
        const boxCells = box(boxNumber)
        const boxCandidates = boxCells.filter(hasCandidate(value))
        // only works for 2 or 3 candidates (4 won't fit in a single row or column)
        if (![2, 3].includes(boxCandidates.length)) return
        for (const which of [rows, cols]) {
          // are all the candidates in this box in the same row or column?
          const candidateRowsOrCols = boxCandidates.map(index => which[index])
          const rowOrColNumber = candidateRowsOrCols[0]
          const onlyOneRowOrCol = !candidateRowsOrCols.some(n => n !== rowOrColNumber)
          if (onlyOneRowOrCol) {
            // eliminate the value from cells in this row or column outside this box
            rowOrCol(which)(rowOrColNumber)
              .filter(excluding(boxCells))
              .filter(hasCandidate(value))
              .forEach(index => {
                removeCandidates(index, [value])
                propagate = true
              })
          }
        }
      })
    })

    // if we haven't made any changes, don't keep looping
    return propagate
  }

  const removeCandidates = (index: number, values: number[]) => {
    candidates[index] = candidates[index].filter(v => !values.includes(v))
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
    const singles = getNakedSingles()
    if (
      singles.some(([index, single]) => {
        const singlePeers = peers[index].filter(hasOneCandidate)
        return singlePeers.some(hasCandidate(single))
      })
    )
      return true
  }

  // filter predicates

  const hasCandidateCount = (count: number) => (index: number) => candidates[index].length === count
  const hasNoCandidates = hasCandidateCount(0)
  const hasOneCandidate = hasCandidateCount(1)
  const hasMultipleCandidates = (index: number) => candidates[index].length > 1
  const hasCandidate = (value: number) => (index: number) => candidates[index].includes(value)
  const hasSomeCandidates = (values: number[]) => (i: number) => values.some(v => hasCandidate(v)(i))
  const hasMatchingCandidates = (values: number[]) => (index: number) => arraysMatch(candidates[index], values)
  const excluding = (cells: number[]) => (index: number) => !cells.includes(index)

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
  const getNakedSingles = () => {
    return cells //
      .filter(hasOneCandidate)
      .map(index => {
        const single = candidates[index][0]
        return [index, single] as const
      })
  }

  /** "hidden" singles - candidates that are only found once in a row/col/box */
  const getHiddenSingles = (unitPeers: number[][]) => {
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

const arraysMatch = (a: number[], b: number[]) => a.length === b.length && a.every((value, index) => value === b[index])
const distinct = (values: number[]) => [...new Set(values)]
