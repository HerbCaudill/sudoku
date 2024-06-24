import { printCandidates } from 'lib/printCandidates'
import { printGrid } from 'lib/printGrid'
import { stringToGrid } from 'lib/stringToGrid'
import { CandidateGrid, Grid } from 'types'
import { candidateGridToArray } from '../lib/candidateGridToArray'
import { candidatesToGrid } from '../lib/candidatesToGrid'
import { cells, lines, units } from '../lib/constants'
import { gridToCandidates } from '../lib/gridToCandidates'
import { stringToCandidates } from '../lib/stringToCandidates'
import { findNextMove, isFailure, type Move } from './findNextMove'

export class Board {
  public grid: Grid
  public candidateGrid: CandidateGrid

  constructor(input: { grid: string | Grid } | { candidates: string | CandidateGrid }) {
    if ('grid' in input) {
      this.grid = typeof input.grid === 'string' ? stringToGrid(input.grid) : input.grid
      this.candidateGrid = gridToCandidates(this.grid)
    } else {
      this.candidateGrid =
        typeof input.candidates === 'string' ? stringToCandidates(input.candidates) : input.candidates
      this.grid = candidatesToGrid(this.candidateGrid)
    }
  }

  get printGrid() {
    return printGrid(this.grid)
  }

  get printCandidates() {
    return printCandidates(this.candidateGrid)
  }

  get candidates() {
    return candidateGridToArray(this.candidateGrid)
  }

  /** returns all cells with exactly N candidates (1 for naked singles, 2 for naked doubles, etc.) */
  tuples(N: number) {
    return cells.filter(this.hasCandidateCount(N))
  }

  unitCandidates() {
    return units.map(unit => unit.map(cell => this.candidates[cell]))
  }

  lineCandidates() {
    return lines.map(line => line.map(cell => this.candidates[cell]))
  }

  unsolvedCells() {
    return cells.filter(i => this.grid[i] === 0)
  }

  isSolved() {
    return this.unsolvedCells().length === 0
  }

  findNextMove(): Move {
    return findNextMove(this)
  }

  applyMove(move: Move) {
    if (isFailure(move)) return this
    if (move.solved) {
      const grid = [...this.grid]
      grid[move.solved.cell] = move.solved.value
      return new Board({ grid })
    } else {
      const candidates = { ...this.candidateGrid }
      for (const removal of move.removals) {
        candidates[removal.cell] = candidates[removal.cell].filter(value => value !== removal.value)
      }
      return new Board({ candidates })
    }
  }

  // filter predicates

  /** cells.filter(board.hasCandidateCount(3)) */
  hasCandidateCount(count: number) {
    return (index: number) => this.candidateGrid[index].length === count
  }

  /** cells.filter(board.hasNoCandidates()) */
  hasNoCandidates() {
    return this.hasCandidateCount(0)
  }

  /** cells.filter(board.hasOneCandidate()) */
  hasOneCandidate() {
    return this.hasCandidateCount(1)
  }

  /** cells.filter(board.hasMultipleCandidates()) */
  hasMultipleCandidates(index: number) {
    return this.candidateGrid[index].length > 1
  }

  /** cells.filter(board.hasCandidate(7)) */
  hasCandidate(value: number) {
    return (index: number) => this.candidateGrid[index].includes(value)
  }

  /** cells.filter(board.hasCandidates([1,2,3]) */
  hasCandidates(values: number[]) {
    return (index: number) => isSubset(this.candidateGrid[index], values)
  }
}

const isSubset = (a: number[] = [], b: number[]) => a.length > 0 && b.length > 0 && a.every(value => b.includes(value))
