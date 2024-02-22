export const arraysMatch = <T>(a: T[], b: T[]) => {
  return a.length === b.length && a.every(v => b.includes(v))
}
