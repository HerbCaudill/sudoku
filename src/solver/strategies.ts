import { arraysMatch } from 'lib/arraysMatch'
import { box, boxes, cells, numbers, unitByType, unitLookup, units } from 'lib/constants'
import { excluding } from 'lib/excluding'
import { peers } from 'lib/peers'
import { group } from 'lib/group'
import { Board } from './Board'
import type { Candidate } from 'types'

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

export const genericStrategy = ({
  N,
  sets,
  A,
  B,
}: {
  N: number
  sets: number[][]
  A: keyof Candidate
  B: keyof Candidate
}): Strategy => {
  return board => {
    const allCandidates = board.candidates
    const candidateSets = sets.map(unit => unit.flatMap(cell => allCandidates.filter(c => c.cell === cell)))
    for (const candidates of candidateSets) {
      // group the values by A, e.g.
      // {
      //   0: [1, 2],
      //   2: [5, 6],
      //   10: [1, 2],
      //   11: [1, 3, 4],
      //   18: [2, 3, 4],
      //   20: [1, 2, 3],
      // }
      const B_by_A = group(
        candidates,
        d => d[A],
        d => d[B]
      )

      // group the cells by value set, e.g.
      // [
      //   { values: [1, 2],    cells: [0, 10] },
      //   { values: [5, 6],    cells: [2]     },
      //   { values: [1, 3, 4], cells: [11]    },
      //   { values: [2, 3, 4], cells: [18]    },
      //   { values: [1, 2, 3], cells: [20]    },
      // ]
      const A_by_B_set = Object.entries(
        group(
          Object.entries(B_by_A),
          ([a, b_set]) => b_set.join(','),
          ([a, b_set]) => Number(a)
        )
      ).map(([b_set, a_set]) => ({ b_set: b_set.split(',').map(Number), a_set }))

      // look for a group that has exactly N values and N cells, e.g.
      // { values: [1, 2], cells: [0, 10] }
      const match = A_by_B_set.find(({ b_set, a_set }) => a_set.length === N && b_set.length === N)
      if (match) {
        // remove the matched values from all other cells in the unit e.g.
        // [
        //   { cell: 11, value: 1 },
        //   { cell: 18, value: 2 },
        //   { cell: 20, value: 1 },
        //   { cell: 20, value: 2 }
        // ]
        const removals = candidates
          .filter(
            candidate =>
              !match.a_set.includes(candidate[A]) && // other cells
              match.b_set.includes(candidate[B]) // with this value
          )
          .map(({ cell, value }) => ({ cell, value }))
        if (removals.length) {
          const matchedDimensions = match.a_set.flatMap(a => match.b_set.map(b => ({ a, b })))
          const matches = candidates
            .filter(c => matchedDimensions.some(({ a, b }) => c[A] === a && c[B] === b))
            .map(({ cell, value }) => ({ cell, value }))
          return {
            matches,
            removals,
          }
        }
      }
    }
    return null
  }
}

export const nakedTuples = (N: number) => genericStrategy({ N, sets: units, A: 'cell', B: 'value' })
export const hiddenTuples = (N: number) => genericStrategy({ N, sets: units, A: 'value', B: 'cell' })

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
