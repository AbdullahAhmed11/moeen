import { ImagePlus, X } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { readImageAsDataUrl } from '../../utils/file'

type DocumentUploadFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

export function DocumentUploadField({ label, value, onChange }: DocumentUploadFieldProps) {
  const { t } = useTranslation()
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    try {
      const dataUrl = await readImageAsDataUrl(file)
      onChange(dataUrl)
    } catch (err) {
      const code = err instanceof Error ? err.message : 'read_failed'
      if (code === 'invalid_type') {
        setError(t('employees.documents.invalidType'))
      } else if (code === 'too_large') {
        setError(t('employees.documents.tooLarge'))
      } else {
        setError(t('employees.documents.uploadFailed'))
      }
    } finally {
      event.target.value = ''
    }
  }

  const handleRemove = () => {
    setError(null)
    onChange('')
  }

  return (
    <div className="space-y-1.5">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>

      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
          <img src={value} alt={label} className="h-36 w-full object-contain p-2" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute end-2 top-2 rounded-lg bg-white/90 p-1.5 text-slate-600 shadow-sm transition-colors hover:bg-red-50 hover:text-red-600 dark:bg-slate-900/90 dark:text-slate-300"
            aria-label={t('employees.documents.remove')}
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className="flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/80 transition-colors hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/5"
        >
          <ImagePlus className="size-8 text-slate-400 dark:text-slate-500" />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t('employees.documents.uploadHint')}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {t('employees.documents.uploadFormats')}
          </span>
        </label>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />

      {!value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          {t('employees.documents.browse')}
        </button>
      )}

      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}
