'use client'

import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  QrCode, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Eye
} from 'lucide-react'

interface BulkQRItem {
  id: string
  data: string
  filename: string
  status: 'pending' | 'generating' | 'completed' | 'error'
  qrDataUrl?: string
  error?: string
}

export default function BulkQRGenerator() {
  const [items, setItems] = useState<BulkQRItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [qrColor, setQrColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const [size, setSize] = useState(300)
  const [fileFormat, setFileFormat] = useState<'png' | 'jpg'>('png')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result
      const fileName = file.name.toLowerCase()

      if (fileName.endsWith('.csv')) {
        parseCSV(data as string)
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        parseExcel(data as ArrayBuffer)
      } else {
        alert('Format file tidak didukung. Gunakan CSV atau Excel.')
      }
    }

    if (fileName.endsWith('.csv')) {
      reader.readAsText(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
  }

  const parseCSV = (data: string) => {
    Papa.parse(data, {
      header: true,
      complete: (results) => {
        processParsedData(results.data as any[])
      },
      error: (error) => {
        console.error('Error parsing CSV:', error)
        alert('Error parsing CSV file')
      }
    })
  }

  const parseExcel = (data: ArrayBuffer) => {
    try {
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)
      processParsedData(jsonData as any[])
    } catch (error) {
      console.error('Error parsing Excel:', error)
      alert('Error parsing Excel file')
    }
  }

  const processParsedData = (data: any[]) => {
    const newItems: BulkQRItem[] = data.map((row, index) => {
      // Try to find the column with data (could be named various things)
      const dataField = row.data || row.url || row.text || row.content || row.link || Object.values(row)[0]
      
      if (!dataField) return null

      return {
        id: `item-${Date.now()}-${index}`,
        data: String(dataField),
        filename: `qr-${index + 1}`,
        status: 'pending' as const
      }
    }).filter(Boolean) as BulkQRItem[]

    setItems(newItems)
  }

  const generateBulkQR = async () => {
    if (items.length === 0) return

    setIsProcessing(true)
    setProgress(0)

    const options = {
      width: size,
      margin: 2,
      color: {
        dark: qrColor,
        light: bgColor
      }
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      setItems(prev => prev.map(it => 
        it.id === item.id ? { ...it, status: 'generating' } : it
      ))

      try {
        const qrDataUrl = await QRCode.toDataURL(item.data, options)
        
        setItems(prev => prev.map(it => 
          it.id === item.id ? { 
            ...it, 
            status: 'completed', 
            qrDataUrl 
          } : it
        ))
      } catch (error) {
        setItems(prev => prev.map(it => 
          it.id === item.id ? { 
            ...it, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error'
          } : it
        ))
      }

      setProgress(((i + 1) / items.length) * 100)
    }

    setIsProcessing(false)
  }

  const downloadAll = async () => {
    const completedItems = items.filter(item => item.status === 'completed' && item.qrDataUrl)
    
    if (completedItems.length === 0) {
      alert('Tidak ada QR code yang berhasil di-generate')
      return
    }

    if (completedItems.length === 1) {
      // Download single file
      const item = completedItems[0]
      const link = document.createElement('a')
      link.download = `${item.filename}.${fileFormat}`
      link.href = item.qrDataUrl!
      link.click()
      return
    }

    // Create ZIP for multiple files
    const zip = new JSZip()

    completedItems.forEach(item => {
      const base64Data = item.qrDataUrl!.split(',')[1]
      zip.file(`${item.filename}.${fileFormat}`, base64Data, { base64: true })
    })

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    saveAs(zipBlob, `bulk-qr-codes-${Date.now()}.zip`)
  }

  const downloadSingle = (item: BulkQRItem) => {
    if (!item.qrDataUrl) return

    const link = document.createElement('a')
    link.download = `${item.filename}.${fileFormat}`
    link.href = item.qrDataUrl
    link.click()
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const clearAll = () => {
    setItems([])
    setProgress(0)
  }

  const getStatusIcon = (status: BulkQRItem['status']) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-slate-400" />
      case 'generating':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: BulkQRItem['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'generating':
        return <Badge className="bg-blue-100 text-blue-800">Generating</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk QR Generator
          </CardTitle>
          <CardDescription>
            Generate ratusan QR code sekaligus dari file Excel atau CSV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload Data</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="preview">Preview & Download</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-semibold mb-2">Upload Excel atau CSV</h3>
                <p className="text-slate-600 mb-4">
                  Upload file Excel (.xlsx, .xls) atau CSV dengan data yang akan dijadikan QR code
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Pilih File
                </Button>
              </div>

              {items.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Data yang akan diproses</CardTitle>
                      <Button variant="outline" size="sm" onClick={clearAll}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Clear All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-64 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Filename</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((item, index) => (
                            <TableRow key={item.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell className="max-w-xs truncate">{item.data}</TableCell>
                              <TableCell>{item.filename}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(item.status)}
                                  {getStatusBadge(item.status)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-sm text-slate-600">
                        Total: {items.length} item
                      </p>
                      <Button 
                        onClick={generateBulkQR} 
                        disabled={isProcessing || items.length === 0}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <QrCode className="w-4 h-4 mr-2" />
                            Generate All QR
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isProcessing && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Processing...</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="qr-color">Warna QR</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="qr-color"
                        type="color"
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bg-color">Warna Background</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="bg-color"
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={bgColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="size">Ukuran QR (px)</Label>
                    <Input
                      id="size"
                      type="range"
                      min="100"
                      max="500"
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="mt-1"
                    />
                    <div className="text-sm text-slate-500 mt-1">{size} x {size} pixels</div>
                  </div>
                  <div>
                    <Label htmlFor="format">Format File</Label>
                    <Select value={fileFormat} onValueChange={(value: 'png' | 'jpg') => setFileFormat(value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG (Recommended)</SelectItem>
                        <SelectItem value="jpg">JPG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Format File CSV/Excel</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Pastikan file Anda memiliki format yang benar. Kolom data bisa bernama:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">data</Badge>
                    <Badge variant="outline">url</Badge>
                    <Badge variant="outline">text</Badge>
                    <Badge variant="outline">content</Badge>
                    <Badge variant="outline">link</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-4">
                    Contoh: Jika Anda memiliki kolom bernama "url", sistem akan otomatis menggunakannya.
                    Jika tidak ada kolom yang cocok, sistem akan menggunakan kolom pertama.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              {items.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-slate-500">
                    <QrCode className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Belum ada data. Upload file terlebih dahulu.</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Preview QR Codes</h3>
                    <Button onClick={downloadAll} disabled={items.filter(item => item.status === 'completed').length === 0}>
                      <Download className="w-4 h-4 mr-2" />
                      Download All ({items.filter(item => item.status === 'completed').length})
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                    {items.map((item) => (
                      <Card key={item.id} className="relative">
                        <CardContent className="p-4">
                          <div className="aspect-square bg-slate-50 rounded-lg mb-2 flex items-center justify-center">
                            {item.qrDataUrl ? (
                              <img 
                                src={item.qrDataUrl} 
                                alt={item.filename}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="text-center text-slate-400">
                                {item.status === 'error' ? (
                                  <AlertCircle className="w-8 h-8 mx-auto mb-1" />
                                ) : (
                                  <QrCode className="w-8 h-8 mx-auto mb-1" />
                                )}
                                <p className="text-xs">
                                  {item.status === 'error' ? 'Error' : 'No preview'}
                                </p>
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-medium truncate mb-1">{item.filename}</p>
                          <div className="flex items-center justify-between">
                            {getStatusBadge(item.status)}
                            {item.qrDataUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => downloadSingle(item)}
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                          {item.error && (
                            <p className="text-xs text-red-500 mt-1">{item.error}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}