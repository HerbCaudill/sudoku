import { cells } from './constants.js'
import { boxPeers, colPeers, rowPeers } from './peers.js'
import { CandidateGrid } from '../types.js'

type Strategy = (candidates: CandidateGrid) => CandidateGrid

export const nakedTuples =
  (N: number): Strategy =>
  candidates => {
    const tuples = cells.filter(hasCandidateCount(N))
    tuples.forEach(index => {
      const values = candidates[index]
      for (const unitPeers of [rowPeers, colPeers, boxPeers]) {
        const ourPeers = unitPeers[index]
        const matches = ourPeers.filter(hasMatchingCandidates(values))
        // for naked doubles, we need 1 other match; for triples, 2 other matches; etc
        if (matches.length === N - 1) {
          ourPeers
            .filter(hasSomeCandidates(values))
            .filter(excluding(matches))
            .forEach(peer => {
              removeCandidates(candidates, peer, values)
            })
        }
      }
    })

    return candidates
  }

// hidden singles
// export const hiddenTuples =
//   (N: number): Strategy =>
//   candidates => {
//     for (const unitPeers of [rowPeers, colPeers, boxPeers]) {
//       getHiddenSingles(unitPeers).forEach(([index, value]) => {
//         unitPeers[index] //
//           .filter(hasCandidate(value))
//           .forEach(peer => {
//             removeCandidates(candidates, peer, [value])
//           })
//         // set this as the only candidate for this cell
//         candidates[index] = [value]
//       })
//     }
//     return candidates
//   }

// // TODO: hidden doubles etc.

// pointing pairs & triples: if there are any boxes whose values can only go in one row or
// column, eliminate those values from other cells in that row or column
// numbers.forEach(value => {
//   numbers.forEach(boxNumber => {
//     const boxCells = box(boxNumber)
//     const boxCandidates = boxCells.filter(hasCandidate(value))
//     // only works for 2 or 3 candidates (4 won't fit in a single row or column)
//     if (![2, 3].includes(boxCandidates.length)) return
//     for (const which of [rows, cols]) {
//       // are all the candidates in this box in the same row or column?
//       const candidateRowsOrCols = boxCandidates.map(index => which[index])
//       const n = candidateRowsOrCols[0]
//       const singleRowOrCol = !candidateRowsOrCols.some(m => m !== n)
//       if (singleRowOrCol) {
//         // eliminate the value from cells in this row or column outside this box
//         rowOrCol(which)(n)
//           .filter(excluding(boxCells))
//           .filter(hasCandidate(value))
//           .forEach(index => {
//             removeCandidates(index, [value])
//             propagate = true
//           })
//       }
//     }
//   })
// })

// filter predicates

const hasCandidateCount = (count: number) => (candidates: CandidateGrid, index: number) =>
  candidates[index].length === count
const hasNoCandidates = hasCandidateCount(0)
const hasOneCandidate = hasCandidateCount(1)
const hasMultipleCandidates = (candidates: CandidateGrid, index: number) => candidates[index].length > 1
const hasCandidate = (value: number) => (candidates: CandidateGrid, index: number) => candidates[index].includes(value)
const hasSomeCandidates = (values: number[]) => (candidates: CandidateGrid, i: number) =>
  values.some(v => hasCandidate(v)(candidates, i))
const hasMatchingCandidates = (values: number[]) => (candidates: CandidateGrid, index: number) =>
  isSubset(candidates[index], values)
const excluding = (cells: number[]) => (index: number) => !cells.includes(index)

const removeCandidates = (candidates: CandidateGrid, index: number, values: number[]) => {
  candidates[index] = candidates[index].filter(v => !values.includes(v))
}

/** "hidden" singles - candidates that are only found once in a row/col/box */
// const getHiddenSingles = (unitPeers: number[][]) => {
//   return getUnsolvedCells()
//     .map(index => {
//       const isAloneInUnit = (candidate: number) =>
//          . !unitPeers[index] //
//           .some(hasCandidate(candidate))

//       const single = candidates[index].find(isAloneInUnit)
//       if (single) return [index, single]
//     })
//     .filter(Boolean) as [number, number][] // eliminate cases where no single was found
// }
