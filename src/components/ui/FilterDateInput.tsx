type FilterDateInputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  min?: string
  max?: string
  className?: string
}

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500'

export function FilterDateInput({
  label,
  value,
  onChange,
  min,
  max,
  className,
}: FilterDateInputProps) {
  return (
    <label
      className={['flex min-w-[140px] flex-1 flex-col gap-1.5 sm:max-w-[200px]', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
      <input
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className={inputClassName}
      />
    </label>
  )
}
