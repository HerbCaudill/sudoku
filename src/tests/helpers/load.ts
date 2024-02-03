import fs from 'fs'
import path from 'path'
import { URL } from 'url'
const __dirname = new URL('.', import.meta.url).pathname

export const load = (filename: string) => {
  const filePath = path.join(__dirname, '..', '..', 'benchmark', 'data', filename)
  return fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .filter(
      line =>
        line.length > 0 && //
        !line.startsWith('#')
    )
}
