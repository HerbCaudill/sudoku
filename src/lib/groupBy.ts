type Key = string | number | symbol
type KeyOrAccessor<K extends Key, T extends Record<K, Key>> =
  | K // key
  | ((d: T) => T[K]) // OR accessor

// returns a reducer function that groups values from an array of objects by a key
export const groupBy = <
  T extends Record<Key, Key>, //
  GroupKey extends keyof T,
  ValueKey extends keyof T,
>(
  groupKey: KeyOrAccessor<GroupKey, T>,
  valueKey: KeyOrAccessor<ValueKey, T>
) => {
  return (result: Record<T[GroupKey], Array<T[ValueKey]>>, current: T) => {
    const groupAccessor = typeof groupKey === 'function' ? groupKey : (item: T) => item[groupKey]
    const valueAccessor = typeof valueKey === 'function' ? valueKey : (item: T) => item[valueKey]

    const group = groupAccessor(current)
    const value = valueAccessor(current)

    result[group] = result[group] ?? []
    result[group].push(value)

    return result
  }
}
