// returns a reducer function that groups values from an array of objects by a key
export const groupReducer = <Element, Key extends string | number | symbol, Value>(
  getKey: (x: Element) => Key,
  getValue: (x: Element) => Value
) => {
  return (result: Record<Key, Value[]>, current: Element) => {
    const key = getKey(current)
    const value = getValue(current)

    return {
      ...result,
      [key]: [...(result[key] ?? []), value],
    }
  }
}

export const group = <Element, Key extends string | number | symbol, Value>(
  arr: Element[],
  getKey: (x: Element) => Key,
  getValue: (x: Element) => Value
) => {
  return arr.reduce(groupReducer(getKey, getValue), {} as Record<Key, Value[]>)
}
