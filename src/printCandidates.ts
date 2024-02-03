import { cols, emptyGrid, rows } from './constants.js'
import { getGridCandidates } from './getGridCandidates.js'
import chalk from 'chalk'
import { Grid } from './types.js'

export const printCandidates = (grid: Grid) => {
  const output = Array.from({ length: 37 }, () => Array(37).fill(' '))

  const squarePos = (i: number) => i * 4 + 1
  // fill in the candidate values
  const candidates = getGridCandidates(grid)
  emptyGrid.forEach((_, index) => {
    const row = rows[index] - 1
    const col = cols[index] - 1

    const squareY = squarePos(row)
    const squareX = squarePos(col)
    if (grid[index] > 0) {
      output[squareY + 1][squareX + 1] = chalk.yellow(grid[index])
    } else {
      const squareCandidates = candidates[index] ?? []
      for (let i = 1; i <= 9; i++) {
        const candidate = squareCandidates.includes(i) ? i : ' '
        output[squareY + Math.floor((i - 1) / 3)][squareX + ((i - 1) % 3)] = chalk.dim(candidate)
      }
    }
  })

  // draw dim inner borders
  for (let i = 0; i < 37; i++) {
    for (let j = 0; j < 9; j++) {
      output[i][squarePos(j) + 3] = '│'
      output[squarePos(j) + 3][i] = '─'
    }
  }
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      output[squarePos(i) + 3][squarePos(j) + 3] = '┼'
    }
  }

  // draw borders
  for (let i = 0; i < 37; i++) {
    for (let j = 0; j < 4; j++) {
      output[i][j * 12] = '┃'
      output[j * 12][i] = '━'
    }
  }
  // add corners and junctions
  output[0][0] = '┏'
  output[0][36] = '┓'
  output[36][0] = '┗'
  output[36][36] = '┛'

  output[12][12] = '╋'
  output[12][24] = '╋'
  output[24][12] = '╋'
  output[24][24] = '╋'

  for (let i = 1; i < 3; i++) {
    output[i * 12][0] = '┣'
    output[i * 12][36] = '┫'
    output[0][i * 12] = '┳'
    output[36][i * 12] = '┻'
  }

  return output
    .map(r =>
      r
        // double width
        .map(c =>
          '┣━┏┗╋┻┳'.includes(c)
            ? c + '━' //
            : '─┼'.includes(c)
            ? c + '─'
            : c + ' '
        )
        .join('')
    )
    .join('\n')
}
