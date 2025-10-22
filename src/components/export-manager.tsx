'use client'

import { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Download, 
  FileImage, 
  FileText, 
  Archive,
  Settings,
  CheckCircle,
  Loader2
} from 'lucide-react'

interface ExportItem {
  id: string
  title: string
  dataUrl: string
  shortId: string
}

interface ExportManagerProps {
  items: ExportItem[]
}

export default function ExportManager({ items }: ExportManagerProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'pdf' | 'zip'>('png')
  const [pdfSettings, setPdfSettings] = useState({
    pageSize: 'a4',
    orientation: 'portrait',
    margin: 20,
    qrPerRow: 3
  })
  const [imageSettings, setImageSettings] = useState({
    quality: 0.9,
    size: 300
  })

  const exportSingleImage = async (item: ExportItem, format: 'png' | 'jpg') => {
    const link = document.createElement('a')
    link.download = `${item.title || item.shortId}.${format}`
    link.href = item.dataUrl
    link.click()
  }

  const exportMultipleImages = async (format: 'png' | 'jpg') => {
    if (items.length === 0) return

    setIsExporting(true)
    
    try {
      if (items.length === 1) {
        await exportSingleImage(items[0], format)
      } else {
        // Create ZIP for multiple files
        const zip = new JSZip()

        for (const item of items) {
          const base64Data = item.dataUrl.split(',')[1]
          zip.file(`${item.title || item.shortId}.${format}`, base64Data, { base64: true })
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        saveAs(zipBlob, `qr-codes-${Date.now()}.zip`)
      }
    } catch (error) {
      console.error('Error exporting images:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportToPDF = async () => {
    if (items.length === 0) return

    setIsExporting(true)

    try {
      const pdf = new jsPDF({
        orientation: pdfSettings.orientation as 'portrait' | 'landscape',
        unit: 'mm',
        format: pdfSettings.pageSize
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = pdfSettings.margin
      const usableWidth = pageWidth - (margin * 2)
      const usableHeight = pageHeight - (margin * 2)

      const qrSize = usableWidth / pdfSettings.qrPerRow
      const qrPerCol = Math.floor(usableHeight / qrSize)

      let currentX = margin
      let currentY = margin
      let itemsOnPage = 0

      for (let i = 0; i < items.length; i++) {
        const item = items[i]

        // Add new page if needed
        if (itemsOnPage >= pdfSettings.qrPerRow * qrPerCol) {
          pdf.addPage()
          currentX = margin
          currentY = margin
          itemsOnPage = 0
        }

        // Add QR code to PDF
        try {
          const img = new Image()
          img.src = item.dataUrl
          
          await new Promise((resolve) => {
            img.onload = resolve
          })

          pdf.addImage(img, 'PNG', currentX, currentY, qrSize, qrSize)

          // Add title below QR code
          if (item.title) {
            pdf.setFontSize(8)
            pdf.text(item.title, currentX + qrSize/2, currentY + qrSize + 5, { align: 'center' })
          }

          // Add short ID
          pdf.setFontSize(6)
          pdf.text(item.shortId, currentX + qrSize/2, currentY + qrSize + 10, { align: 'center' })

        } catch (error) {
          console.error('Error adding QR to PDF:', error)
        }

        // Update position
        currentX += qrSize
        itemsOnPage++

        // Move to next row
        if (itemsOnPage % pdfSettings.qrPerRow === 0) {
          currentX = margin
          currentY += qrSize + 15
        }
      }

      pdf.save(`qr-codes-${Date.now()}.pdf`)

    } catch (error) {
      console.error('Error exporting PDF:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportAll = async () => {
    switch (exportFormat) {
      case 'png':
      case 'jpg':
        await exportMultipleImages(exportFormat)
        break
      case 'pdf':
        await exportToPDF()
        break
      case 'zip':
        await exportMultipleImages('png')
        break
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'png':
      case 'jpg':
        return <FileImage className="w-4 h-4" />
      case 'pdf':
        return <FileText className="w-4 h-4" />
      case 'zip':
        return <Archive className="w-4 h-4" />
      default:
        return <Download className="w-4 h-4" />
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Manager
          </CardTitle>
          <CardDescription>
            Export QR codes dalam berbagai format (PNG, JPG, PDF, ZIP)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="quick" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quick">Quick Export</TabsTrigger>
              <TabsTrigger value="settings">Export Settings</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="quick" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="format">Export Format</Label>
                  <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG (High Quality)</SelectItem>
                      <SelectItem value="jpg">JPG (Smaller Size)</SelectItem>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="zip">ZIP Archive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={exportAll} 
                    disabled={isExporting || items.length === 0}
                    className="w-full"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        {getFormatIcon(exportFormat)}
                        <span className="ml-2">
                          Export {items.length} QR Code{items.length !== 1 ? 's' : ''} as {exportFormat.toUpperCase()}
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {items.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Items to Export</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-64 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="text-center">
                          <div className="aspect-square bg-slate-50 rounded-lg mb-2 p-2">
                            <img 
                              src={item.dataUrl} 
                              alt={item.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="text-xs font-medium truncate">{item.title || item.shortId}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Image Settings</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quality">Image Quality</Label>
                    <Input
                      id="quality"
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={imageSettings.quality}
                      onChange={(e) => setImageSettings(prev => ({ ...prev, quality: parseFloat(e.target.value) }))}
                      className="mt-1"
                    />
                    <div className="text-sm text-slate-500 mt-1">
                      {Math.round(imageSettings.quality * 100)}%
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="img-size">Image Size (px)</Label>
                    <Input
                      id="img-size"
                      type="number"
                      min="100"
                      max="1000"
                      value={imageSettings.size}
                      onChange={(e) => setImageSettings(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">PDF Settings</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="page-size">Page Size</Label>
                    <Select value={pdfSettings.pageSize} onValueChange={(value) => setPdfSettings(prev => ({ ...prev, pageSize: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a4">A4</SelectItem>
                        <SelectItem value="a3">A3</SelectItem>
                        <SelectItem value="letter">Letter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="orientation">Orientation</Label>
                    <Select value={pdfSettings.orientation} onValueChange={(value) => setPdfSettings(prev => ({ ...prev, orientation: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="qr-per-row">QR Codes per Row</Label>
                    <Input
                      id="qr-per-row"
                      type="number"
                      min="1"
                      max="6"
                      value={pdfSettings.qrPerRow}
                      onChange={(e) => setPdfSettings(prev => ({ ...prev, qrPerRow: parseInt(e.target.value) }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="margin">Margin (mm)</Label>
                    <Input
                      id="margin"
                      type="number"
                      min="5"
                      max="50"
                      value={pdfSettings.margin}
                      onChange={(e) => setPdfSettings(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="text-center">
                <Badge className="mb-4 bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Export Preview
                </Badge>
                <p className="text-slate-600 mb-6">
                  Preview how your QR codes will look when exported
                </p>
              </div>

              {exportFormat === 'pdf' ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">PDF Layout Preview</CardTitle>
                    <CardDescription>
                      {pdfSettings.qrPerRow} QR codes per row • {pdfSettings.pageSize} • {pdfSettings.orientation}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 bg-slate-50">
                      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${pdfSettings.qrPerRow}, 1fr)` }}>
                        {items.slice(0, pdfSettings.qrPerRow * 2).map((item) => (
                          <div key={item.id} className="text-center">
                            <div className="aspect-square bg-white border rounded p-2 mb-2">
                              <img 
                                src={item.dataUrl} 
                                alt={item.title}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <p className="text-xs font-medium truncate">{item.title || item.shortId}</p>
                            <p className="text-xs text-slate-500">{item.shortId}</p>
                          </div>
                        ))}
                      </div>
                      {items.length > pdfSettings.qrPerRow * 2 && (
                        <p className="text-center text-sm text-slate-500 mt-4">
                          ... and {items.length - (pdfSettings.qrPerRow * 2)} more QR codes
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="aspect-square bg-slate-50 rounded-lg mb-2">
                          <img 
                            src={item.dataUrl} 
                            alt={item.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-xs font-medium truncate">{item.title || item.shortId}</p>
                        <p className="text-xs text-slate-500">{exportFormat.toUpperCase()}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}