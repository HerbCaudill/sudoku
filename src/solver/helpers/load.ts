import fs from 'fs'
import path from 'path'

const __dirname = new URL('.', import.meta.url).pathname
const dataDir = path.join(__dirname, '..', '..', 'data')

export const load = (filename: string) => {
  const filePath = path.join(dataDir, filename)
  return fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .filter(
      line =>
        line.length > 0 && //
        !line.startsWith('#')
    )
}

export const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.txt'))
