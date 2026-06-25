export type ExportColumn<T> = {
  header: string
  getValue: (row: T) => string | number
}
