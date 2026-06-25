import i18n from '../i18n'

export const EXPORT_LOCALE = 'ar' as const
export const EXPORT_IS_ARABIC = true as const

export function getExportTranslation() {
  return i18n.getFixedT(EXPORT_LOCALE)
}
