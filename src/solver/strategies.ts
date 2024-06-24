import { arraysMatch } from 'lib/arraysMatch'
import { box, boxes, cells, numbers, unitByType, unitLookup, units } from 'lib/constants'
import { excluding } from 'lib/excluding'
import { peers } from 'lib/peers'
import { groupBy } from '../lib/groupBy'
import { Board } from './Board'

export const nakedSingles: Strategy = board => {
  for (const cell of cells) {
    if (board.grid[cell] === 0 && board.candidateGrid[cell].length === 1) {
      const value = board.candidateGrid[cell][0]
      const solved = { cell, value }
      const removals = peers[cell].filter(board.hasCandidate(value)).map(cell => ({ cell, value }))
      return { solved, matches: [solved], removals }
    }
  }
  return null
}

export const nakedTuples = (N: number): Strategy => {
  return board => {
    for (const unit of board.unitCandidates()) {
      const valuesByCell = unit.reduce(groupBy('cell', 'value'), {})

      const cellsByValueSet = Object.entries(valuesByCell).reduce(
        (result, current) => {
          const [cell, values] = current
          if (values.length === N) {
            const k_values = values.join()
            result[k_values] = result[k_values] ?? []
            result[k_values].push(parseInt(cell))
          }
          return result
        },
        {} as Record<string, number[]>
      )

      for (const [k_values, cells] of Object.entries(cellsByValueSet)) {
        if (cells.length === N) {
          const values = k_values.split(',').map(Number)
          if (values.length === N) {
            const matches = cells.flatMap(cell => values.map(value => ({ cell, value })))
            const removals = unit
              .filter(c => !cells.includes(c.cell) && values.includes(c.value))
              .map(c => ({ cell: c.cell, value: c.value }))

            if (removals.length) return { matches, removals }
          }
        }
      }
    }
    return null
  }
}

export const hiddenTuples = (N: number): Strategy => {
  return board => {
    // look at every row, column and box
    for (const unitType of ['row', 'col', 'box'] as const) {
      for (const unitIndex of numbers) {
        const unit = unitByType[unitType](unitIndex)
        // in this unit, map each value to the cells that contain it
        // e.g. if a row is 12 123 23 . . . . . .
        // then the map will be {1: [0,1], 2: [0,1,2], 3: [1,2]}
        // const cellsByValue = numbers.reduces

        const cellsByValue = (value: number) => unit.filter(board.hasCandidate(value))

        for (const value of numbers) {
          // are there N values in this unit that are only found in the same set of N cells?
          // e.g. for hidden doubles, are there 2 values that are only found in the same 2 cells?
          const cells = cellsByValue(value)
          if (cells.length !== N) continue
          const values = numbers.filter(
            otherValue => value === otherValue || arraysMatch(cells, cellsByValue(otherValue))
          )

          if (values.length !== N) continue

          // yes, remove all other candidates from the matching cells
          const cellCandidates = cells.flatMap(cell => board.candidateGrid[cell].map(value => ({ cell, value })))
          const removals = cellCandidates.filter(({ value }) => !values.includes(value))
          if (removals.length) {
            const matches = cellCandidates.filter(({ value }) => values.includes(value))
            return { matches, removals }
          }
        }
      }
    }
    return null
  }
}

/** Locked pairs & triples: if there are any boxes whose values can only go in one row or
 * column, eliminate those values from other cells in that row or column. */
export const lockedTuples: Strategy = board => {
  for (const value of numbers) {
    for (const boxNumber of numbers) {
      const boxCells = box(boxNumber)
      const cells = boxCells.filter(board.hasCandidate(value))
      // only works for 2 or 3 candidates (4+ won't fit in a single row or column)
      if (!(cells.length === 2 || cells.length === 3)) continue

      for (const rowOrCol of ['row', 'col'] as const) {
        // are all this box's candidates in the same line?
        const lineNumbers = cells.map(i => unitLookup[rowOrCol][i])
        const lineNumber = lineNumbers[0]
        const isSingleLine = lineNumbers.every(i => i === lineNumber)
        if (isSingleLine) {
          const line = unitByType[rowOrCol]
          const lineCells = line(lineNumber)
          // if so, remove the value from the rest of the line (outside this box)
          const removals = lineCells
            .filter(excluding(boxCells))
            .filter(board.hasCandidate(value))
            .map(cell => ({ cell, value }))

          if (removals.length) {
            const matches = cells.map(cell => ({ cell, value }))
            return { matches, removals }
          }
        }
      }
    }
  }
  return null
}

export const boxLineReduction: Strategy = board => {
  for (const value of numbers) {
    for (const rowOrCol of ['row', 'col'] as const) {
      for (const unitIndex of numbers) {
        // are all this line's candidates in the same box?
        const line = unitByType[rowOrCol](unitIndex)
        const cells = line.filter(board.hasCandidate(value))
        // only works for 2 or 3 candidates (4+ won't fit in a single row or column)
        if (!(cells.length === 2 || cells.length === 3)) continue

        const boxNumbers = cells.map(i => boxes[i])
        const boxNumber = boxNumbers[0]
        const isSingleBox = boxNumbers.every(i => i === boxNumber)
        if (isSingleBox) {
          const boxCells = box(boxNumber)
          // if so, remove the value from the rest of the box (outside this line)
          const removals = boxCells
            .filter(excluding(cells))
            .filter(board.hasCandidate(value))
            .map(i => ({ cell: i, value }))
          if (removals.length) {
            const matches = cells.map(cell => ({ cell, value }))
            return { matches, removals }
          }
        }
      }
    }
  }

  return null
}

const _strategies = {
  nakedSingle: {
    strategy: nakedSingles,
    difficulty: 0,
  },
  nakedDouble: {
    strategy: nakedTuples(2),
    difficulty: 20,
  },
  nakedTriple: {
    strategy: nakedTuples(3),
    difficulty: 30,
  },
  nakedQuad: {
    strategy: nakedTuples(4),
    difficulty: 40,
  },
  hiddenSingle: {
    strategy: hiddenTuples(1),
    difficulty: 5,
  },
  hiddenDouble: {
    strategy: hiddenTuples(2),
    difficulty: 40,
  },
  hiddenTriple: {
    strategy: hiddenTuples(3),
    difficulty: 50,
  },
  hiddenQuad: {
    strategy: hiddenTuples(4),
    difficulty: 60,
  },
  lockedTuple: {
    strategy: lockedTuples,
    difficulty: 15,
  },
  boxLineReduction: {
    strategy: boxLineReduction,
    difficulty: 20,
  },
}

export const strategies = Object.keys(_strategies).reduce(
  (acc, _key) => {
    const key = _key as keyof typeof _strategies
    const strategyEntry: StrategyEntry = (board: Board) => {
      return _strategies[key].strategy(board)
    }
    strategyEntry.label = key
    strategyEntry.difficulty = _strategies[key].difficulty
    acc[key] = strategyEntry
    return acc
  },
  {} as Record<string, StrategyEntry>
)

export const strategiesByDifficulty = Object.values(strategies).sort((a, b) => a.difficulty - b.difficulty)

export type SolvedCell = {
  /** A single cell that has been solved */
  solved: CellCandidate
}

export type Elimination = {
  /** Candidates that were used in the strategy. We record these so we can highlight them later.  */
  matches: CellCandidate[]

  /** Candidates to remove. In some cases (e.g. hidden doubles) these will be from the
   * matched cells, in others (e.g. naked doubles, locked doubles) they will be from other cells. */
  removals: CellCandidate[]
}

/** Either a solved cell (a naked single), or candidates eliminated using a strategy */
export type StrategyResult = {
  /** A single cell that has been solved */
  solved?: CellCandidate

  /** Candidates that were used in the strategy. We record these so we can highlight them later.  */
  matches: CellCandidate[]

  /** Candidates to remove. In some cases (e.g. hidden doubles) these will be from the
   * matched cells, in others (e.g. naked doubles, locked doubles) they will be from other cells. */
  removals: CellCandidate[]
}

/** A specific candidate in a specific cell */
export type CellCandidate = {
  cell: number
  value: number
}

export type Strategy = (board: Board) => StrategyResult | null
export type StrategyEntry = Strategy & {
  label: string
  difficulty: number
}
