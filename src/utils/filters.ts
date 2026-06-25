import { hasSearchQuery } from './tableSearch'

export const ALL_FILTER = 'all'

export function hasActiveFilters(values: string[], search?: string) {
  return hasSearchQuery(search ?? '') || values.some((value) => value !== ALL_FILTER)
}

export function matchesFilter<T>(value: T, filter: string, expected?: T) {
  if (filter === ALL_FILTER) return true
  return String(value) === filter || value === expected
}

export function filterByField<T>(
  items: T[],
  filter: string,
  getValue: (item: T) => string | number,
) {
  if (filter === ALL_FILTER) return items
  return items.filter((item) => String(getValue(item)) === filter)
}
