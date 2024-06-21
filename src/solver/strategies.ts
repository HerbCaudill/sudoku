import { Board } from './Board'
import { arraysMatch } from 'lib/arraysMatch'
import { cells, numbers, unitLookup } from './constants'
import { excluding } from 'lib/excluding'
import { peers, peersByType } from './peers'
import { box, unitByType } from './units'

export const nakedSingles: Strategy = board => {
  for (const index of cells) {
    if (board.grid[index] === 0 && board.candidates[index].length === 1) {
      const value = board.candidates[index][0]
      const solved = { index, value }
      const removals = peers[index].filter(board.hasCandidate(value)).map(index => ({ index, value }))
      return { solved, matches: [solved], removals }
    }
  }
  return null
}

export const nakedTuples = (N: number): Strategy => {
  return board => {
    // find all cells that have exactly N candidates (e.g. 2 for naked doubles)
    for (const index of board.tuples(N)) {
      const values = board.candidates[index] // e.g. [1,2]

      // for each type of unit
      for (const unitType of ['row', 'col', 'box'] as const) {
        const peers = peersByType[unitType][index]
        // find any peers that have the exact same set of candidates,
        // e.g. another cell containing [1,2]
        const matchingCells = [
          index, // including this
          ...peers.filter(board.hasCandidates(values)),
        ]
        // if there are exactly N matching cells (2 for naked doubles, 3 for naked triples, etc.)
        if (matchingCells.length === N) {
          // no other cells in the unit can have these cells, so remove them
          const otherPeers = peers.filter(excluding(matchingCells))

          const result = {
            matches: matchingCells.flatMap(index =>
              board.candidates[index] //
                .filter(v => values.includes(v))
                .map(value => ({ index, value }))
            ),
            removals: otherPeers.flatMap(index =>
              values //
                .filter(value => {
                  return board.candidates[index].includes(value)
                })
                .map(value => ({ index, value }))
            ),
          }
          if (result.removals.length) return result
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
        const cellsByValue = numbers.reduce(
          (acc, value) => {
            acc[value] = unit.filter(board.hasCandidate(value))
            return acc
          },
          {} as Record<number, number[]>
        )

        for (const value of numbers) {
          // are there N values in this unit that are only found in the same set of N cells?
          // e.g. for hidden doubles, are there 2 values that are only found in the same 2 cells?
          if (cellsByValue[value].length !== N) continue
          const matchingValues = [value].concat(
            numbers.filter(
              otherValue =>
                otherValue !== value && //
                arraysMatch(cellsByValue[value], cellsByValue[otherValue])
            )
          )

          if (matchingValues.length === N) {
            // if so, remove all other candidates from the matching cells
            const matchingCells = cellsByValue[value]
            const result = {
              matches: matchingCells.flatMap(index =>
                board.candidates[index] //
                  .filter(v => matchingValues.includes(v))
                  .map(value => ({ index, value }))
              ),
              removals: matchingCells.flatMap(index =>
                board.candidates[index]
                  .filter(v => !matchingValues.includes(v)) //
                  .map(value => ({ index, value }))
              ),
            }
            if (result.removals.length) return result
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
      const matchingCells = boxCells.filter(board.hasCandidate(value))
      // only works for 2 or 3 candidates (4+ won't fit in a single row or column)
      if (!(matchingCells.length === 2 || matchingCells.length === 3)) continue

      for (const rowOrCol of ['row', 'col'] as const) {
        // are all matchingCells in this box in the same row or column?
        const matchesRowOrCol = matchingCells.map(i => unitLookup[rowOrCol][i])
        const rowOrColIndex = matchesRowOrCol[0]
        const isSingleRowOrCol = matchesRowOrCol.every(i => i === rowOrColIndex)
        if (isSingleRowOrCol) {
          const matches = matchingCells.flatMap(index =>
            board.candidates[index] //
              .filter(v => v === value)
              .map(value => ({ index, value }))
          )

          // if so, remove the value from the rest of the row or column (outside this box)
          const removals = unitByType[rowOrCol](rowOrColIndex)
            .filter(excluding(boxCells))
            .filter(board.hasCandidate(value))
            .map(index => ({ index, value }))
          if (removals.length) return { matches, removals }
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
  index: number
  value: number
}

export type Strategy = (board: Board) => StrategyResult | null
export type StrategyEntry = Strategy & {
  label: string
  difficulty: number
}
