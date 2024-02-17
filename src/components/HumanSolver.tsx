import { useState } from 'react'
import { useKeyboard } from '../hooks/useKeyboard'
import { CandidateGrid, Grid, numbers } from '../solver'
import { Puzzle } from './Puzzle'
import { RadioGroup } from './RadioGroup'

export const HumanSolver = ({ puzzle, solution }: { puzzle: Grid; solution: Grid }) => {
  const [grid, setGrid] = useState<Grid>(puzzle)
  const [candidates, setCandidates] = useState<CandidateGrid>({})
  const [number, setNumber] = useState<number>(1)

  // TODO: refactor to use reducer so we can undo/redo

  // TODO: highlight incorrect cells

  useKeyboard(({ key }: KeyboardEvent) => {
    switch (key) {
      case 'ArrowLeft': {
        setNumber(n => (n === 1 ? 9 : n - 1))
        break
      }
      case 'ArrowRight':
      case ' ': {
        setNumber(n => (n === 9 ? 1 : n + 1))
        break
      }
    }
  })

  const onSetValue = (i: number) => {
    if (puzzle[i]) return // can't change fixed cells
    const newGrid = [...grid]
    if (newGrid[i] === number) newGrid[i] = 0
    else newGrid[i] = number
    setGrid(newGrid)
  }

  const toggleCandidate = (addOrRemove: 'add' | 'remove') => (i: number) => {
    if (!i) return
    if (puzzle[i]) return // can't change fixed cells
    if (grid[i] > 0) return // can't add candidates to cells with values
    const newCandidates = { ...candidates }
    const cellCandidates = newCandidates[i] ?? []
    if (addOrRemove === 'add' && !cellCandidates.includes(number)) {
      newCandidates[i] = [...cellCandidates, number]
      setCandidates(newCandidates)
    } else if (addOrRemove === 'remove' && cellCandidates.includes(number)) {
      newCandidates[i] = newCandidates[i].filter((n: number) => n !== number)
      setCandidates(newCandidates)
    }
  }

  return (
    <>
      <Puzzle
        puzzle={puzzle}
        grid={grid}
        candidates={candidates}
        onSetValue={onSetValue}
        onAddCandidate={toggleCandidate('add')}
        onRemoveCandidate={toggleCandidate('remove')}
        selectedNumber={number}
      />

      {/* Numbers 1-9 */}
      <RadioGroup
        value={number}
        onChange={n => setNumber(n)}
        size="xs"
        options={numbers}
        className="w-full"
        optionClassName="grow text-[3cqw] py-[2cqw]"
      />
    </>
  )
}
