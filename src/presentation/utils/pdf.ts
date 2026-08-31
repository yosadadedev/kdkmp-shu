import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { formatDateLongId } from '@presentation/utils/formatters'

export function buildPdfFileName(periodLabel: string): string {
  const safePeriod = periodLabel
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `Laporan_Keuangan_Bulanan_${safePeriod}_${yyyy}${mm}${dd}.pdf`
}

export interface GenerateMonthlyPdfParams {
  contentEl: HTMLElement
  periodLabel: string
  cooperativeUnitName?: string | null
  operatingRevenueCents: number
  operatingExpensesCents: number
  netProfitCents: number
}

interface CaptureResult {
  dataUrl: string
  widthPx: number
  heightPx: number
}

async function captureElement(el: HTMLElement): Promise<CaptureResult> {
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: el.scrollWidth,
    windowHeight: el.scrollHeight,
  })
  return {
    dataUrl: canvas.toDataURL('image/png'),
    widthPx: canvas.width,
    heightPx: canvas.height,
  }
}

export async function generateMonthlyPdfReport(params: GenerateMonthlyPdfParams): Promise<void> {
  const {
    contentEl,
    periodLabel,
    cooperativeUnitName,
    operatingRevenueCents,
    operatingExpensesCents,
    netProfitCents,
  } = params

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })

  const pageWidthMm = doc.internal.pageSize.getWidth()
  const pageHeightMm = doc.internal.pageSize.getHeight()
  const marginMm = 14
  const safeWidthMm = pageWidthMm - marginMm * 2
  const contentStartYMm = 58
  const contentEndYMm = pageHeightMm - 24

  doc.setFillColor(200, 16, 46)
  doc.rect(0, 0, pageWidthMm, 14, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text('KOPERASI KDKMP', marginMm, 9.4)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(
    (cooperativeUnitName && cooperativeUnitName.length > 0)
      ? `Unit: ${cooperativeUnitName}`
      : 'Sistem Sisa Hasil Usaha (SHU)',
    marginMm,
    12.3,
  )

  const rightHeaderX = pageWidthMm - marginMm
  doc.setFontSize(8.5)
  doc.setTextColor(255, 255, 255)
  doc.text(
    `Dicetak: ${formatDateLongId(new Date())}`,
    rightHeaderX,
    9.4,
    { align: 'right' },
  )
  doc.text(
    `Periode: ${periodLabel}`,
    rightHeaderX,
    12.3,
    { align: 'right' },
  )

  doc.setTextColor(28, 28, 30)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(USER_STRINGS.dashboard.pnlDownloadTitle, marginMm, 30)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(82, 82, 88)
  doc.text(`Laporan Keuangan Periode ${periodLabel}`, marginMm, 36)

  const summaryTopMm = 42
  const summaryBoxWidthMm = safeWidthMm
  const summaryBoxHeightMm = 12
  doc.setDrawColor(232, 232, 236)
  doc.setFillColor(248, 248, 250)
  doc.roundedRect(marginMm, summaryTopMm, summaryBoxWidthMm, summaryBoxHeightMm, 3, 3, 'FD')

  const sumCellMm = summaryBoxWidthMm / 3
  const formatRp = (cents: number) => {
    const rupiah = Math.abs(cents) / 100
    const formatted = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rupiah)
    return `Rp ${formatted}`
  }

  doc.setFontSize(8)
  doc.setTextColor(110, 110, 118)
  doc.setFont('helvetica', 'normal')
  doc.text(USER_STRINGS.dashboard.shuAllocationRevenue, marginMm + 4, summaryTopMm + 4.5)
  doc.text(
    USER_STRINGS.dashboard.shuAllocationOperatingExpense,
    marginMm + sumCellMm + 4,
    summaryTopMm + 4.5,
  )
  doc.text(
    USER_STRINGS.dashboard.shuAllocationNetProfit,
    marginMm + sumCellMm * 2 + 4,
    summaryTopMm + 4.5,
  )

  doc.setFontSize(9.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(200, 16, 46)
  doc.text(formatRp(operatingRevenueCents), marginMm + 4, summaryTopMm + 9.8)
  doc.setTextColor(37, 99, 235)
  doc.text(
    formatRp(operatingExpensesCents),
    marginMm + sumCellMm + 4,
    summaryTopMm + 9.8,
  )
  doc.setTextColor(5, 150, 105)
  doc.text(
    formatRp(netProfitCents),
    marginMm + sumCellMm * 2 + 4,
    summaryTopMm + 9.8,
  )

  doc.setDrawColor(241, 241, 245)
  doc.setLineDashPattern([0.5, 1], 0)
  doc.line(marginMm + sumCellMm, summaryTopMm + 2, marginMm + sumCellMm, summaryTopMm + summaryBoxHeightMm - 2)
  doc.line(marginMm + sumCellMm * 2, summaryTopMm + 2, marginMm + sumCellMm * 2, summaryTopMm + summaryBoxHeightMm - 2)
  doc.setLineDashPattern([], 0)

  const { dataUrl, widthPx, heightPx } = await captureElement(contentEl)

  const pxPerMm = widthPx / safeWidthMm
  const contentImageHeightMm = heightPx / pxPerMm
  const imageWidthMm = safeWidthMm

  const availableHeightMm = contentEndYMm - contentStartYMm

  if (contentImageHeightMm <= availableHeightMm) {
    doc.addImage(
      dataUrl,
      'PNG',
      marginMm,
      contentStartYMm,
      imageWidthMm,
      contentImageHeightMm,
      undefined,
      'FAST',
    )
  } else {
    const pxPerPage = pxPerMm * availableHeightMm
    const pagesNeeded = Math.ceil(heightPx / pxPerPage)

    for (let i = 0; i < pagesNeeded; i++) {
      if (i > 0) {
        doc.addPage('a4', 'portrait')

        doc.setFillColor(200, 16, 46)
        doc.rect(0, 0, pageWidthMm, 8, 'F')
        doc.setFontSize(8)
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'normal')
        doc.text(`Laporan Keuangan Bulanan · ${periodLabel}`, marginMm, 5.4)
        doc.text(
          `Halaman ${i + 1} / ${pagesNeeded}`,
          rightHeaderX,
          5.4,
          { align: 'right' },
        )
      }

      const startPx = i * pxPerPage
      const endPx = Math.min(startPx + pxPerPage, heightPx)
      const sliceHeightPx = endPx - startPx
      const sliceHeightMm = sliceHeightPx / pxPerMm

      const sliceCanvas = document.createElement('canvas')
      sliceCanvas.width = widthPx
      sliceCanvas.height = sliceHeightPx
      const sctx = sliceCanvas.getContext('2d')
      if (sctx) {
        const full = document.createElement('img')
        await new Promise<void>((resolve) => {
          full.onload = () => resolve()
          full.src = dataUrl
        })
        sctx.fillStyle = '#ffffff'
        sctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height)
        sctx.drawImage(
          full,
          0,
          startPx,
          widthPx,
          sliceHeightPx,
          0,
          0,
          widthPx,
          sliceHeightPx,
        )
      }

      const sliceYStartMm = i === 0 ? contentStartYMm : 14
      doc.addImage(
        sliceCanvas.toDataURL('image/png'),
        'PNG',
        marginMm,
        sliceYStartMm,
        imageWidthMm,
        sliceHeightMm,
        undefined,
        'FAST',
      )
    }
  }

  const lastPageNumber = doc.getNumberOfPages()
  doc.setPage(lastPageNumber)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(148, 148, 156)
  doc.text(
    USER_STRINGS.dashboard.pnlDownloadFooter,
    marginMm,
    pageHeightMm - 10,
  )
  doc.text(
    `Halaman ${lastPageNumber} / ${lastPageNumber}  ·  ${formatDateLongId(new Date())}`,
    pageWidthMm - marginMm,
    pageHeightMm - 10,
    { align: 'right' },
  )

  doc.save(buildPdfFileName(periodLabel))
}

export function buildShuAllocationPdfFileName(periodLabel: string): string {
  const safePeriod = periodLabel
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `Alokasi_SHU_${safePeriod}_${yyyy}${mm}${dd}.pdf`
}

export interface GenerateShuAllocationPdfParams {
  contentEl: HTMLElement
  periodLabel: string
  fiscalYear: number
  cooperativeUnitName?: string | null
}

export async function generateShuAllocationPdfReport(params: GenerateShuAllocationPdfParams): Promise<void> {
  const { contentEl, periodLabel, fiscalYear, cooperativeUnitName } = params

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })

  const pageWidthMm = doc.internal.pageSize.getWidth()
  const pageHeightMm = doc.internal.pageSize.getHeight()
  const marginMm = 14
  const safeWidthMm = pageWidthMm - marginMm * 2
  const contentStartYMm = 44

  doc.setFillColor(200, 16, 46)
  doc.rect(0, 0, pageWidthMm, 14, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text('KOPERASI KDKMP', marginMm, 9.4)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(
    (cooperativeUnitName && cooperativeUnitName.length > 0)
      ? `Unit: ${cooperativeUnitName}`
      : 'Sistem Sisa Hasil Usaha (SHU)',
    marginMm,
    12.3,
  )

  const rightHeaderX = pageWidthMm - marginMm
  doc.setFontSize(8.5)
  doc.setTextColor(255, 255, 255)
  doc.text(`Dicetak: ${formatDateLongId(new Date())}`, rightHeaderX, 9.4, { align: 'right' })
  doc.text(`Periode: ${periodLabel}`, rightHeaderX, 12.3, { align: 'right' })

  doc.setTextColor(28, 28, 30)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(USER_STRINGS.dashboard.shuAllocationDownloadTitle, marginMm, 30)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(82, 82, 88)
  doc.text(USER_STRINGS.dashboard.shuAllocationSubtitle(fiscalYear), marginMm, 36)

  const { dataUrl, widthPx, heightPx } = await captureElement(contentEl)
  const pxPerMm = widthPx / safeWidthMm
  const contentImageHeightMm = heightPx / pxPerMm
  const imageWidthMm = safeWidthMm

  doc.addImage(dataUrl, 'PNG', marginMm, contentStartYMm, imageWidthMm, contentImageHeightMm, undefined, 'FAST')

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(148, 148, 156)
  doc.text(USER_STRINGS.dashboard.pnlDownloadFooter, marginMm, pageHeightMm - 10)
  doc.text(`Dicetak: ${formatDateLongId(new Date())}`, pageWidthMm - marginMm, pageHeightMm - 10, {
    align: 'right',
  })

  doc.save(buildShuAllocationPdfFileName(periodLabel))
}
