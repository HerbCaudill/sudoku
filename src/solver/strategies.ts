import { cells, cols, numbers, rows, unitLookup } from './constants.js'
import { boxPeers, colPeers, peersByType, rowPeers } from './peers.js'
import { CandidateGrid } from '../types.js'
import { Board } from './Board.js'
import { box, col, row, unitByType } from './units'
import { excluding } from './excluding.js'
import { arraysMatch } from './arraysMatch.js'

export const nakedTuples = (N: number): Strategy => {
  return candidates => {
    const board = new Board(candidates)
    // find all cells that have exactly N candidates
    for (const index of board.tuples(N)) {
      const values = candidates[index] // e.g. [1,2] for naked doubles

      // for each type of unit
      for (const unitType of ['row', 'col', 'box'] as const) {
        const peers = peersByType[unitType][index]
        // find any peers in this unit that have the exact same set of candidates,
        // e.g. another cell containing [1,2]
        const matches = [
          index, //
          ...peers.filter(board.hasCandidates(values)),
        ]
        if (matches.length === N) {
          // no other cells in the unit can have these cells, so remove them
          const otherPeers = peers.filter(excluding(matches))
          const removals: Removal[] = otherPeers.flatMap(index =>
            values //
              .filter(value => candidates[index].includes(value))
              .map(value => ({ index, value }))
          )
          // only apply the strategy once per call
          if (removals.length) return { matches, removals }
        }
      }
    }
    return emptyResult
  }
}

export const hiddenTuples = (N: number): Strategy => {
  return candidates => {
    const board = new Board(candidates)
    // look at every row, column and box
    for (const unitType of ['row', 'col', 'box'] as const) {
      for (const unitIndex of numbers) {
        const unit = unitByType[unitType](unitIndex)
        // in this unit, map each value to the cells that contain it
        // e.g. if a row is 12 123 23 . . . . . .
        // then the map will be {1: [0,1], 2: [0,1,2], 3: [1,2]}
        const cellsByValue = Object.fromEntries(numbers.map(v => [v, unit.filter(board.hasCandidate(v))]))

        for (const value of numbers) {
          // are there N values in this unit that are only found in the same set of N cells?
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
            const matches = cellsByValue[value]

            const removals = matches.flatMap(index =>
              candidates[index]
                .filter(v => !matchingValues.includes(v)) //
                .map(value => ({ index, value }))
            )
            // only apply the strategy once per call
            if (removals.length) return { matches, removals }
          }
        }
      }
    }
    return emptyResult
  }
}

/** Locked pairs & triples: if there are any boxes whose values can only go in one row or
 * column, eliminate those values from other cells in that row or column. */
export const lockedTuples: Strategy = candidates => {
  const board = new Board(candidates)
  for (const value of numbers) {
    for (const boxNumber of numbers) {
      const boxCells = box(boxNumber)
      const matches = boxCells.filter(board.hasCandidate(value))
      // only works for 2 or 3 candidates (4+ won't fit in a single row or column)
      if (![2, 3].includes(matches.length)) continue

      for (const rowOrCol of ['row', 'col'] as const) {
        // are all matches in this box in the same row or column?
        const matchesRowOrCol = matches.map(i => unitLookup[rowOrCol][i])
        const rowOrColIndex = matchesRowOrCol[0]
        const isSingleRowOrCol = matchesRowOrCol.every(i => i === rowOrColIndex)
        if (isSingleRowOrCol) {
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

  return emptyResult
}

const emptyResult = { matches: [], removals: [] }

const _strategies = {
  nakedSingles: {
    strategy: nakedTuples(1),
    difficulty: 0,
  },
  nakedDoubles: {
    strategy: nakedTuples(2),
    difficulty: 20,
  },
  nakedTriples: {
    strategy: nakedTuples(3),
    difficulty: 30,
  },
  nakedQuads: {
    strategy: nakedTuples(4),
    difficulty: 40,
  },
  hiddenSingles: {
    strategy: hiddenTuples(1),
    difficulty: 0,
  },
  hiddenDoubles: {
    strategy: hiddenTuples(2),
    difficulty: 40,
  },
  hiddenTriples: {
    strategy: hiddenTuples(3),
    difficulty: 50,
  },
  hiddenQuads: {
    strategy: hiddenTuples(4),
    difficulty: 60,
  },
  lockedTuples: {
    strategy: lockedTuples,
    difficulty: 15,
  },
}

export const strategies = Object.keys(_strategies).reduce((acc, _key) => {
  const key = _key as keyof typeof _strategies
  const strategyEntry: AnnotatedStrategy = (candidates: CandidateGrid) => {
    return _strategies[key].strategy(candidates)
  }
  strategyEntry.label = key
  strategyEntry.difficulty = _strategies[key].difficulty
  acc[key] = strategyEntry
  return acc
}, {} as Record<string, AnnotatedStrategy>)

type StrategyResult = {
  /** Cells that matched the strategy. */
  matches: number[]
  /** Candidates to remove. In some cases (e.g. hidden doubles) these will be from the
   * matched cells, in others (e.g. naked doubles, locked doubles) they will be from other cells. */
  removals: Removal[]
}

type Removal = {
  index: number
  value: number
}

type Strategy = (candidates: CandidateGrid) => StrategyResult
type AnnotatedStrategy = Strategy & {
  label: string
  difficulty: number
}
