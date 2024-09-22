import { CandidateGrid, Grid } from 'types'
import { printCandidates } from 'lib/printCandidates'
import { printGrid } from 'lib/printGrid'
import { stringToGrid } from 'lib/stringToGrid'
import { cells, numbers } from '../lib/constants'
import { stringToCandidates } from '../lib/stringToCandidates'
import { gridToCandidates } from '../lib/gridToCandidates'
import { findNextMove, type Move } from './findNextMove'
import { peers } from 'lib/peers'

export class Board {
  public grid: Grid
  public candidates: CandidateGrid

  constructor(input: { grid: string | Grid } | { candidates: string | CandidateGrid }) {
    if ('grid' in input) {
      this.grid = typeof input.grid === 'string' ? stringToGrid(input.grid) : input.grid
      this.candidates = gridToCandidates(this.grid)
    } else {
      this.candidates = typeof input.candidates === 'string' ? stringToCandidates(input.candidates) : input.candidates
      this.grid = cells.map(i => (this.candidates[i]?.length === 1 ? this.candidates[i][0] : 0))
    }
  }

  printGrid() {
    return printGrid(this.grid)
  }

  printCandidates() {
    return printCandidates(this.candidates)
  }

  /** returns all cells with exactly N candidates (1 for naked singles, 2 for naked doubles, etc.) */
  tuples(N: number) {
    return cells.filter(this.hasCandidateCount(N))
  }

  singles() {
    return this.tuples(1)
  }

  unsolvedCells() {
    return cells.filter(i => this.grid[i] === 0)
  }

  isSolved() {
    return this.unsolvedCells().length === 0
  }

  findNextMove() {
    return findNextMove(this)
  }

  applyMove(move: Move) {
    if (!move) return this
    if (move.solved) {
      const grid = [...this.grid]
      grid[move.solved.index] = move.solved.value
      return new Board({ grid })
    } else {
      const candidates = { ...this.candidates }
      for (const removal of move.removals) {
        candidates[removal.index] = candidates[removal.index].filter(value => value !== removal.value)
      }
      // propagate: if any cell has exactly one candidate, remove that candidate from all peers
      for (const index of cells.filter(i => candidates[i].length === 1)) {
        const value = candidates[index][0]
        for (const peer of peers[index]) {
          candidates[peer] = candidates[peer].filter(v => v !== value)
        }
      }
      return new Board({ candidates })
    }
  }

  setCell(index: number, value: number) {
    const grid = [...this.grid]
    grid[index] = value
    return new Board({ grid })
  }

  // filter predicates

  /** example: `cells.filter(board.hasCandidateCount(3))` */
  hasCandidateCount(count: number) {
    return (index: number) => this.candidates[index].length === count
  }

  /** example: `cells.filter(board.hasNoCandidates())` */
  hasNoCandidates() {
    return this.hasCandidateCount(0)
  }

  /** example: `cells.filter(board.hasOneCandidate())` */
  hasOneCandidate() {
    return this.hasCandidateCount(1)
  }

  /** example: `cells.filter(board.hasMultipleCandidates())` */
  hasMultipleCandidates(index: number) {
    return this.candidates[index].length > 1
  }

  /** example: `cells.filter(board.hasCandidate(7))` */
  hasCandidate(value: number) {
    return (index: number) => this.candidates[index].includes(value)
  }

  /** example: `cells.filter(board.hasCandidates([1,2,3])` */
  hasCandidates(values: number[]) {
    return (index: number) => isSubset(this.candidates[index], values)
  }
}

const isSubset = (a: number[] = [], b: number[]) => a.length > 0 && b.length > 0 && a.every(value => b.includes(value))
