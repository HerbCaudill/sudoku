import { useState } from 'react'
import { useKeyboard } from '../hooks/useKeyboard'
import { CandidateGrid, Grid, numbers } from '../solver'
import { Puzzle } from './Puzzle'
import { RadioGroup } from './RadioGroup'

export const HumanSolver = ({ puzzle, solution }: { puzzle: Grid; solution: Grid }) => {
  const [number, setNumber] = useState<number>(1)

  const [grid, setGrid] = useState<Grid>(puzzle)
  const [candidates, setCandidates] = useState<CandidateGrid>({})

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
    if (newGrid[i] === number) newGrid[i] = 0
    else newGrid[i] = number
    setGrid(newGrid)
  }

  const onSetCandidate = (i: number) => {
    const newCandidates = { ...candidates }
    const cellCandidates = newCandidates[i] ?? []
    if (cellCandidates.includes(number)) {
      newCandidates[i] = cellCandidates.filter(n => n !== number)
    } else {
      newCandidates[i] = [...cellCandidates, number]
    }
    setCandidates(newCandidates)
  }

  return (
    <>
      <Puzzle
        puzzle={puzzle}
        grid={grid}
        candidates={candidates}
        onSetValue={onSetValue}
        onSetCandidate={onSetCandidate}
        number={number}
      />
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
