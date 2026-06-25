export type SoftDeletable = {
  isDeleted: boolean
}

export function withSoftDeleteDefaults<T extends SoftDeletable>(
  items: Omit<T, 'isDeleted'>[],
): T[] {
  return items.map((item) => ({ ...item, isDeleted: false }) as T)
}

export function softDeleteById<T extends { id: number; isDeleted: boolean }>(
  items: T[],
  id: number,
): T[] {
  return items.map((item) => (item.id === id ? { ...item, isDeleted: true } : item))
}

export function isActiveRecord(item: { isDeleted?: boolean }) {
  return !item.isDeleted
}
