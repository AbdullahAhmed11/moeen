import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'
import type { ExportColumn } from '../types/export'

const ARABIC_FONT_FAMILY = '"Noto Sans Arabic", Tahoma, "Arial Unicode MS", Arial, sans-serif'

function buildSheetData<T>(data: T[], columns: ExportColumn<T>[]) {
  const headers = columns.map((column) => column.header)
  const rows = data.map((row) => columns.map((column) => String(column.getValue(row))))
  return { headers, rows }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function getTimestamp() {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function buildArabicTableHtml(title: string, headers: string[], rows: string[][]) {
  const headCells = headers
    .map(
      (header) =>
        `<th style="padding:10px 12px;border:1px solid #c7d2fe;background:#4f46e5;color:#fff;font-weight:600;text-align:right;white-space:nowrap;">${escapeHtml(header)}</th>`,
    )
    .join('')

  const bodyRows = rows
    .map((row, index) => {
      const background = index % 2 === 0 ? '#ffffff' : '#f8fafc'
      const cells = row
        .map(
          (cell) =>
            `<td style="padding:8px 12px;border:1px solid #e2e8f0;background:${background};text-align:right;white-space:nowrap;">${escapeHtml(cell)}</td>`,
        )
        .join('')
      return `<tr>${cells}</tr>`
    })
    .join('')

  return `
    <div dir="rtl" lang="ar" style="font-family:${ARABIC_FONT_FAMILY};color:#0f172a;padding:24px;background:#ffffff;width:1100px;box-sizing:border-box;">
      <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;text-align:right;color:#1e293b;">${escapeHtml(title)}</h1>
      <table style="width:100%;border-collapse:collapse;font-size:12px;direction:rtl;table-layout:auto;">
        <thead><tr>${headCells}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>
  `
}

async function waitForArabicFont() {
  if (!document.fonts?.load) return
  try {
    await Promise.all([
      document.fonts.load('400 12px "Noto Sans Arabic"'),
      document.fonts.load('700 20px "Noto Sans Arabic"'),
      document.fonts.load('400 12px Tahoma'),
    ])
  } catch {
    // Fall back to system fonts if web font is unavailable.
  }
}

function addCanvasToPdf(canvas: HTMLCanvasElement, doc: jsPDF) {
  const margin = 20
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const contentWidth = pageWidth - margin * 2
  const contentHeight = pageHeight - margin * 2
  const imgHeight = (canvas.height * contentWidth) / canvas.width

  if (imgHeight <= contentHeight) {
    doc.addImage(canvas.toDataURL('image/png'), 'PNG', margin, margin, contentWidth, imgHeight)
    return
  }

  const sliceHeightPx = Math.floor((contentHeight * canvas.width) / contentWidth)
  let sourceY = 0
  let pageIndex = 0

  while (sourceY < canvas.height) {
    const currentSliceHeight = Math.min(sliceHeightPx, canvas.height - sourceY)
    const sliceCanvas = document.createElement('canvas')
    sliceCanvas.width = canvas.width
    sliceCanvas.height = currentSliceHeight

    const context = sliceCanvas.getContext('2d')
    if (!context) break

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height)
    context.drawImage(
      canvas,
      0,
      sourceY,
      canvas.width,
      currentSliceHeight,
      0,
      0,
      canvas.width,
      currentSliceHeight,
    )

    const renderedHeight = (currentSliceHeight * contentWidth) / canvas.width
    if (pageIndex > 0) doc.addPage()
    doc.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', margin, margin, contentWidth, renderedHeight)

    sourceY += currentSliceHeight
    pageIndex += 1
  }
}

export function exportToExcel<T>(baseFilename: string, data: T[], columns: ExportColumn<T>[]) {
  const { headers, rows } = buildSheetData(data, columns)
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
  worksheet['!rtl'] = true
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'البيانات')
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  downloadBlob(blob, `${baseFilename}_${getTimestamp()}.xlsx`)
}

export async function exportElementToPdf(
  element: HTMLElement,
  title: string,
  baseFilename: string,
) {
  const overlay = document.createElement('div')
  overlay.style.position = 'fixed'
  overlay.style.inset = '0'
  overlay.style.zIndex = '999999'
  overlay.style.background = '#ffffff'
  overlay.style.overflow = 'auto'
  overlay.style.padding = '24px'
  overlay.style.display = 'flex'
  overlay.style.justifyContent = 'center'
  overlay.style.alignItems = 'flex-start'

  const wrapper = document.createElement('div')
  wrapper.dir = 'rtl'
  wrapper.lang = 'ar'
  wrapper.style.fontFamily = ARABIC_FONT_FAMILY
  wrapper.style.color = '#0f172a'
  wrapper.style.background = '#ffffff'
  wrapper.style.padding = '24px'
  wrapper.style.boxSizing = 'border-box'

  const heading = document.createElement('h1')
  heading.textContent = title
  heading.style.margin = '0 0 16px'
  heading.style.fontSize = '20px'
  heading.style.fontWeight = '700'
  heading.style.textAlign = 'right'

  const clone = element.cloneNode(true) as HTMLElement
  clone.style.background = '#ffffff'

  wrapper.appendChild(heading)
  wrapper.appendChild(clone)
  overlay.appendChild(wrapper)
  document.body.appendChild(overlay)

  try {
    await waitForArabicFont()
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    await new Promise((resolve) => setTimeout(resolve, 350))

    const canvas = await html2canvas(wrapper, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: wrapper.offsetWidth,
      height: wrapper.offsetHeight,
      windowWidth: wrapper.offsetWidth,
      windowHeight: wrapper.offsetHeight,
      onclone: (clonedDoc) => {
        const clonedTarget = clonedDoc.body.querySelector('[dir="rtl"]') as HTMLElement | null
        if (clonedTarget) {
          clonedTarget.style.fontFamily = ARABIC_FONT_FAMILY
          clonedTarget.style.background = '#ffffff'
        }
      },
    })

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('PDF canvas is empty')
    }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
    addCanvasToPdf(canvas, doc)
    doc.save(`${baseFilename}_${getTimestamp()}.pdf`)
  } finally {
    document.body.removeChild(overlay)
  }
}

export async function exportToPdf<T>(
  title: string,
  baseFilename: string,
  data: T[],
  columns: ExportColumn<T>[],
) {
  const { headers, rows } = buildSheetData(data, columns)

  const overlay = document.createElement('div')
  overlay.style.position = 'fixed'
  overlay.style.inset = '0'
  overlay.style.zIndex = '999999'
  overlay.style.background = '#ffffff'
  overlay.style.overflow = 'auto'
  overlay.style.padding = '24px'
  overlay.style.display = 'flex'
  overlay.style.justifyContent = 'center'
  overlay.style.alignItems = 'flex-start'

  const container = document.createElement('div')
  container.innerHTML = buildArabicTableHtml(title, headers, rows)
  overlay.appendChild(container)
  document.body.appendChild(overlay)

  try {
    await waitForArabicFont()
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    await new Promise((resolve) => setTimeout(resolve, 350))

    const target = container.firstElementChild as HTMLElement
    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: target.offsetWidth,
      height: target.offsetHeight,
      windowWidth: target.offsetWidth,
      windowHeight: target.offsetHeight,
      onclone: (clonedDoc) => {
        const clonedTarget = clonedDoc.body.querySelector('[dir="rtl"]') as HTMLElement | null
        if (clonedTarget) {
          clonedTarget.style.fontFamily = ARABIC_FONT_FAMILY
          clonedTarget.style.background = '#ffffff'
        }
      },
    })

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('PDF canvas is empty')
    }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
    addCanvasToPdf(canvas, doc)
    doc.save(`${baseFilename}_${getTimestamp()}.pdf`)
  } finally {
    document.body.removeChild(overlay)
  }
}
