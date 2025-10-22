'use client'

import { useState, useRef, useEffect } from 'react'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  QrCode, 
  Download, 
  Palette, 
  Image as ImageIcon, 
  Frame,
  Zap,
  Copy,
  Check
} from 'lucide-react'

interface QRGeneratorProps {
  onGenerate?: (qrData: string) => void
}

export default function QRGenerator({ onGenerate }: QRGeneratorProps) {
  const [text, setText] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [foregroundColor, setForegroundColor] = useState('#000000')
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF')
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('M')
  const [size, setSize] = useState(300)
  const [logoUrl, setLogoUrl] = useState('')
  const [frameStyle, setFrameStyle] = useState('none')
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const frameStyles = [
    { value: 'none', label: 'Tanpa Frame' },
    { value: 'rounded', label: 'Rounded' },
    { value: 'square', label: 'Square' },
    { value: 'circle', label: 'Circle' }
  ]

  const errorLevels = [
    { value: 'L', label: 'Low (7%)' },
    { value: 'M', label: 'Medium (15%)' },
    { value: 'Q', label: 'Quartile (25%)' },
    { value: 'H', label: 'High (30%)' }
  ]

  const generateQR = async () => {
    if (!text) return

    try {
      // Try to use API first
      const response = await fetch('/api/qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: text,
          type: 'STATIC',
          title: `QR Code ${Date.now()}`,
          foregroundColor,
          backgroundColor,
          size,
          errorCorrection,
          logoUrl,
          frameStyle,
          userId: null // Set to null for demo, in real app this would come from auth
        })
      })

      if (response.ok) {
        const data = await response.json()
        setQrDataUrl(data.qrDataUrl)
      } else {
        // Fallback to client-side generation
        const options = {
          width: size,
          margin: 2,
          color: {
            dark: foregroundColor,
            light: backgroundColor
          },
          errorCorrectionLevel: errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H'
        }

        const dataUrl = await QRCode.toDataURL(text, options)
        setQrDataUrl(dataUrl)
      }
      
      if (onGenerate) {
        onGenerate(qrDataUrl || '')
      }

      // Apply frame if selected
      if (frameStyle !== 'none') {
        applyFrame(qrDataUrl || '')
      }
    } catch (error) {
      console.error('Error generating QR code:', error)
      // Fallback to client-side generation
      try {
        const options = {
          width: size,
          margin: 2,
          color: {
            dark: foregroundColor,
            light: backgroundColor
          },
          errorCorrectionLevel: errorCorrectionLevel as 'L' | 'M' | 'Q' | 'H'
        }

        const dataUrl = await QRCode.toDataURL(text, options)
        setQrDataUrl(dataUrl)
        
        if (onGenerate) {
          onGenerate(dataUrl)
        }

        if (frameStyle !== 'none') {
          applyFrame(dataUrl)
        }
      } catch (fallbackError) {
        console.error('Fallback QR generation failed:', fallbackError)
      }
    }
  }

  const applyFrame = (qrDataUrl: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = size + 40
      canvas.height = size + 40

      // Clear canvas
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Apply frame style
      ctx.fillStyle = foregroundColor
      
      switch (frameStyle) {
        case 'rounded':
          roundRect(ctx, 10, 10, size + 20, size + 20, 20)
          ctx.fill()
          ctx.fillStyle = backgroundColor
          roundRect(ctx, 20, 20, size, size, 10)
          ctx.fill()
          break
        case 'square':
          ctx.fillRect(10, 10, size + 20, size + 20)
          ctx.fillStyle = backgroundColor
          ctx.fillRect(20, 20, size, size)
          break
        case 'circle':
          ctx.beginPath()
          ctx.arc(size/2 + 20, size/2 + 20, size/2 + 10, 0, 2 * Math.PI)
          ctx.fill()
          ctx.fillStyle = backgroundColor
          ctx.beginPath()
          ctx.arc(size/2 + 20, size/2 + 20, size/2, 0, 2 * Math.PI)
          ctx.fill()
          break
      }

      // Draw QR code
      ctx.drawImage(img, 20, 20, size, size)

      // Add logo if provided
      if (logoUrl) {
        const logoImg = new Image()
        logoImg.onload = () => {
          const logoSize = size * 0.2
          const logoX = (canvas.width - logoSize) / 2
          const logoY = (canvas.height - logoSize) / 2
          
          // White background for logo
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10)
          
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)
          
          // Update data URL
          setQrDataUrl(canvas.toDataURL())
        }
        logoImg.src = logoUrl
      } else {
        setQrDataUrl(canvas.toDataURL())
      }
    }
    img.src = qrDataUrl
  }

  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  }

  const downloadQR = (format: 'png' | 'jpg') => {
    if (!qrDataUrl) return

    const link = document.createElement('a')
    link.download = `qrcode-${Date.now()}.${format}`
    link.href = qrDataUrl
    link.click()
  }

  const copyToClipboard = async () => {
    if (!qrDataUrl) return

    try {
      const blob = await (await fetch(qrDataUrl)).blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (text) {
      generateQR()
    }
  }, [text, foregroundColor, backgroundColor, errorCorrectionLevel, size, frameStyle])

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Code Generator Pro
          </CardTitle>
          <CardDescription>
            Buat QR code custom dengan warna, logo, dan frame sesuai kebutuhan Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="text">Teks atau URL</Label>
                    <Textarea
                      id="text"
                      placeholder="Masukkan URL, teks, atau informasi yang ingin dijadikan QR code..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="foreground">Warna QR</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="foreground"
                          type="color"
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="background">Background</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="background"
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="size">Ukuran (px)</Label>
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
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 bg-slate-50">
                    {qrDataUrl ? (
                      <div className="text-center">
                        <img 
                          src={qrDataUrl} 
                          alt="Generated QR Code" 
                          className="mx-auto mb-4 rounded-lg shadow-lg"
                        />
                        <div className="flex gap-2 justify-center">
                          <Button size="sm" onClick={() => downloadQR('png')}>
                            <Download className="w-4 h-4 mr-1" />
                            PNG
                          </Button>
                          <Button size="sm" variant="outline" onClick={copyToClipboard}>
                            {copied ? (
                              <Check className="w-4 h-4 mr-1" />
                            ) : (
                              <Copy className="w-4 h-4 mr-1" />
                            )}
                            {copied ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-slate-400">
                        <QrCode className="w-24 h-24 mx-auto mb-4" />
                        <p>Masukkan teks untuk generate QR code</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="logo">Logo (Opsional)</Label>
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="mt-1"
                    />
                    {logoUrl && (
                      <div className="mt-2">
                        <img 
                          src={logoUrl} 
                          alt="Logo preview" 
                          className="w-16 h-16 object-contain border rounded"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="frame">Frame Style</Label>
                    <Select value={frameStyle} onValueChange={setFrameStyle}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frameStyles.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="error-level">Error Correction Level</Label>
                    <Select value={errorCorrectionLevel} onValueChange={setErrorCorrectionLevel}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {errorLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500 mt-1">
                      Semakin tinggi level, semakin banyak data yang bisa dipulihkan jika QR code rusak
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <Badge className="mb-4 bg-orange-100 text-orange-800">
                      <ImageIcon className="w-3 h-3 mr-1" />
                      Custom Preview
                    </Badge>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 bg-slate-50">
                      {qrDataUrl ? (
                        <img 
                          src={qrDataUrl} 
                          alt="Custom QR Code" 
                          className="mx-auto rounded-lg shadow-lg"
                        />
                      ) : (
                        <div className="text-slate-400">
                          <Palette className="w-24 h-24 mx-auto mb-4" />
                          <p>Customize QR code Anda</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Templates</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setText('https://wa.me/628123456789')}
                      >
                        💬 WhatsApp Link
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setText('https://instagram.com/username')}
                      >
                        📷 Instagram Profile
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setText('BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+628123456789\nEMAIL:john@example.com\nEND:VCARD')}
                      >
                        👤 Contact Card (vCard)
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setText('WIFI:T:WPA;S:NetworkName;P:Password;;')}
                      >
                        📶 WiFi Network
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Color Presets</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          setForegroundColor('#000000')
                          setBackgroundColor('#FFFFFF')
                        }}
                      >
                        ⚫ Classic Black & White
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          setForegroundColor('#1e40af')
                          setBackgroundColor('#dbeafe')
                        }}
                      >
                        🔵 Blue Theme
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          setForegroundColor('#dc2626')
                          setBackgroundColor('#fee2e2')
                        }}
                      >
                        🔴 Red Theme
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          setForegroundColor('#16a34a')
                          setBackgroundColor('#dcfce7')
                        }}
                      >
                        🟢 Green Theme
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <Badge className="mb-4 bg-purple-100 text-purple-800">
                      <Zap className="w-3 h-3 mr-1" />
                      Advanced Features
                    </Badge>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 bg-slate-50">
                      {qrDataUrl ? (
                        <img 
                          src={qrDataUrl} 
                          alt="Advanced QR Code" 
                          className="mx-auto rounded-lg shadow-lg"
                        />
                      ) : (
                        <div className="text-slate-400">
                          <Frame className="w-24 h-24 mx-auto mb-4" />
                          <p>Gunakan template dan preset untuk mempercepat</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Hidden canvas for frame processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}