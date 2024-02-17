import { useState } from 'react'
import { useKeyboard } from '../hooks/useKeyboard'
import { CandidateGrid, Grid, numbers } from '../solver'
import { Puzzle } from './Puzzle'
import { RadioGroup } from './RadioGroup'

export const HumanSolver = ({ puzzle, solution }: { puzzle: Grid; solution: Grid }) => {
  const [grid, setGrid] = useState<Grid>(puzzle)
  const [candidates, setCandidates] = useState<CandidateGrid>({})
  const [selectedNumber, setNumber] = useState<number>(1)

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
    const newGrid = [...grid]
    if (newGrid[i] === selectedNumber) newGrid[i] = 0
    else newGrid[i] = selectedNumber
    setGrid(newGrid)
  }

  const onAddCandidate = (i: number) => {
    const newCandidates = { ...candidates }
    const cellCandidates = newCandidates[i] ?? []
    if (!cellCandidates.includes(selectedNumber)) {
      newCandidates[i] = [...cellCandidates, selectedNumber]
      setCandidates(newCandidates)
    }
  }

  const onRemoveCandidate = (i: number) => {
    const newCandidates = { ...candidates }
    const cellCandidates = newCandidates[i] ?? []
    if (cellCandidates.includes(selectedNumber)) {
      newCandidates[i] = newCandidates[i].filter((n: number) => n !== selectedNumber)
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
        onAddCandidate={onAddCandidate}
        onRemoveCandidate={onRemoveCandidate}
        selectedNumber={selectedNumber}
      />

      {/* Numbers 1-9 */}
      <RadioGroup
        value={selectedNumber}
        onChange={n => setNumber(n)}
        size="xs"
        options={numbers}
        className="w-full"
        optionClassName="grow text-[3cqw] py-[2cqw]"
      />
    </>
  )
}
