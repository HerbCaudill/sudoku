import { CandidateGrid, Grid } from 'types'
import { getUnsolved } from './getUnsolved'
import { boxPeers, colPeers, peers, rowPeers } from './peers'
import { cells, numbers } from './constants'

export class Board {
  constructor(public candidates: CandidateGrid) {}

  /** returns all cells with exactly N candidates (1 for naked singles, 2 for naked doubles, etc.) */
  tuples = (N: number) => cells.filter(this.hasCandidateCount(N))

  // filter predicates

  /** cells.filter(board.hasCandidateCount(3)) */
  hasCandidateCount = (count: number) => (index: number) => this.candidates[index].length === count

  /** cells.filter(board.hasNoCandidates()) */
  hasNoCandidates = this.hasCandidateCount(0)

  /** cells.filter(board.hasOneCandidate()) */
  hasOneCandidate = this.hasCandidateCount(1)

  /** cells.filter(board.hasMultipleCandidates()) */
  hasMultipleCandidates = (index: number) => this.candidates[index].length > 1

  /** cells.filter(board.hasCandidate(7)) */
  hasCandidate = (value: number) => (index: number) => this.candidates[index].includes(value)

  /** cells.filter(board.hasCandidates([1,2,3]) */
  hasCandidates = (values: number[]) => (index: number) => isSubset(this.candidates[index], values)
}

const isSubset = (a: number[] = [], b: number[]) => a.length > 0 && b.length > 0 && a.every(value => b.includes(value))
