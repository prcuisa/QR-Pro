'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { 
  QrCode, 
  Download, 
  Eye, 
  Copy, 
  Palette, 
  Upload, 
  FileText, 
  Link, 
  Mail, 
  Phone, 
  MapPin, 
  Wifi,
  Calendar,
  Video,
  Image,
  Settings,
  BarChart3,
  Users,
  Lock,
  Globe,
  Zap,
  Plus,
  Trash2,
  Edit
} from 'lucide-react'

export default function Dashboard() {
  const [qrType, setQrType] = useState('url')
  const [qrData, setQrData] = useState({
    url: '',
    text: '',
    email: '',
    phone: '',
    address: '',
    wifi: {
      ssid: '',
      password: '',
      encryption: 'WPA'
    },
    event: {
      title: '',
      start: '',
      end: '',
      location: ''
    }
  })
  const [design, setDesign] = useState({
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    pattern: 'square',
    eyePattern: 'square',
    logo: null,
    size: 300,
    errorCorrection: 'M'
  })
  const [advanced, setAdvanced] = useState({
    isDynamic: false,
    password: '',
    expiresAt: '',
    customDomain: '',
    trackingEnabled: true
  })

  const qrTypes = [
    { id: 'url', label: 'URL/Website', icon: <Link className="w-4 h-4" /> },
    { id: 'text', label: 'Plain Text', icon: <FileText className="w-4 h-4" /> },
    { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { id: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4" /> },
    { id: 'sms', label: 'SMS', icon: <Phone className="w-4 h-4" /> },
    { id: 'wifi', label: 'WiFi', icon: <Wifi className="w-4 h-4" /> },
    { id: 'location', label: 'Location', icon: <MapPin className="w-4 h-4" /> },
    { id: 'event', label: 'Event', icon: <Calendar className="w-4 h-4" /> },
    { id: 'video', label: 'Video', icon: <Video className="w-4 h-4" /> },
    { id: 'image', label: 'Image', icon: <Image className="w-4 h-4" /> }
  ]

  const recentQRCodes = [
    {
      id: 1,
      name: 'Menu Resto',
      type: 'url',
      scans: 1250,
      created: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Voucher Promo',
      type: 'text',
      scans: 890,
      created: '2024-01-14',
      status: 'active'
    },
    {
      id: 3,
      name: 'Contact Card',
      type: 'vcard',
      scans: 456,
      created: '2024-01-13',
      status: 'paused'
    },
    {
      id: 4,
      name: 'WiFi Guest',
      type: 'wifi',
      scans: 234,
      created: '2024-01-12',
      status: 'active'
    }
  ]

  const handleGenerateQR = () => {
    console.log('Generating QR with data:', { qrType, qrData, design, advanced })
  }

  const handleBulkUpload = () => {
    console.log('Opening bulk upload dialog')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <QrCode className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">QR Generator Prcuisa</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
          </div>
        </div>
      </header>

      <div className="container px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* QR Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  QR Code Generator
                </CardTitle>
                <CardDescription>
                  Pilih tipe QR code dan masukkan data yang ingin di-encode
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                  {qrTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={qrType === type.id ? 'default' : 'outline'}
                      className="h-auto p-3 flex flex-col gap-2"
                      onClick={() => setQrType(type.id)}
                    >
                      {type.icon}
                      <span className="text-xs">{type.label}</span>
                    </Button>
                  ))}
                </div>

                {/* Data Input Form */}
                <div className="space-y-4">
                  {qrType === 'url' && (
                    <div>
                      <Label htmlFor="url">URL/Website</Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://example.com"
                        value={qrData.url}
                        onChange={(e) => setQrData({...qrData, url: e.target.value})}
                      />
                    </div>
                  )}

                  {qrType === 'text' && (
                    <div>
                      <Label htmlFor="text">Plain Text</Label>
                      <Textarea
                        id="text"
                        placeholder="Enter your text here..."
                        value={qrData.text}
                        onChange={(e) => setQrData({...qrData, text: e.target.value})}
                        rows={4}
                      />
                    </div>
                  )}

                  {qrType === 'email' && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          value={qrData.email}
                          onChange={(e) => setQrData({...qrData, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="Email subject" />
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Email message" rows={3} />
                      </div>
                    </div>
                  )}

                  {qrType === 'phone' && (
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+628123456789"
                        value={qrData.phone}
                        onChange={(e) => setQrData({...qrData, phone: e.target.value})}
                      />
                    </div>
                  )}

                  {qrType === 'wifi' && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="ssid">Network Name (SSID)</Label>
                        <Input
                          id="ssid"
                          placeholder="WiFi Network Name"
                          value={qrData.wifi.ssid}
                          onChange={(e) => setQrData({...qrData, wifi: {...qrData.wifi, ssid: e.target.value}})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="wifi-password">Password</Label>
                        <Input
                          id="wifi-password"
                          type="password"
                          placeholder="WiFi Password"
                          value={qrData.wifi.password}
                          onChange={(e) => setQrData({...qrData, wifi: {...qrData.wifi, password: e.target.value}})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="encryption">Encryption</Label>
                        <Select value={qrData.wifi.encryption} onValueChange={(value) => setQrData({...qrData, wifi: {...qrData.wifi, encryption: value}})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WPA">WPA/WPA2</SelectItem>
                            <SelectItem value="WEP">WEP</SelectItem>
                            <SelectItem value="nopass">No Password</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {qrType === 'location' && (
                    <div>
                      <Label htmlFor="address">Location/Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter address or coordinates"
                        value={qrData.address}
                        onChange={(e) => setQrData({...qrData, address: e.target.value})}
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Design Customization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Design Customization
                </CardTitle>
                <CardDescription>
                  Kustomisasi tampilan QR code sesuai brand Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="colors" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="pattern">Pattern</TabsTrigger>
                    <TabsTrigger value="logo">Logo</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="colors" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fg-color">Foreground Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="fg-color"
                            type="color"
                            value={design.foregroundColor}
                            onChange={(e) => setDesign({...design, foregroundColor: e.target.value})}
                          />
                          <Input
                            value={design.foregroundColor}
                            onChange={(e) => setDesign({...design, foregroundColor: e.target.value})}
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bg-color">Background Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="bg-color"
                            type="color"
                            value={design.backgroundColor}
                            onChange={(e) => setDesign({...design, backgroundColor: e.target.value})}
                          />
                          <Input
                            value={design.backgroundColor}
                            onChange={(e) => setDesign({...design, backgroundColor: e.target.value})}
                            placeholder="#FFFFFF"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pattern" className="space-y-4">
                    <div>
                      <Label>Data Pattern</Label>
                      <Select value={design.pattern} onValueChange={(value) => setDesign({...design, pattern: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="circle">Circle</SelectItem>
                          <SelectItem value="rounded">Rounded</SelectItem>
                          <SelectItem value="dots">Dots</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Eye Pattern</Label>
                      <Select value={design.eyePattern} onValueChange={(value) => setDesign({...design, eyePattern: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="circle">Circle</SelectItem>
                          <SelectItem value="rounded">Rounded</SelectItem>
                          <SelectItem value="fancy">Fancy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="logo" className="space-y-4">
                    <div>
                      <Label>Upload Logo</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <Label>Size: {design.size}px</Label>
                    <Slider
                      value={[design.size]}
                      onValueChange={(value) => setDesign({...design, size: value[0]})}
                      max={1000}
                      min={100}
                      step={50}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Error Correction</Label>
                    <Select value={design.errorCorrection} onValueChange={(value) => setDesign({...design, errorCorrection: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Low (7%)</SelectItem>
                        <SelectItem value="M">Medium (15%)</SelectItem>
                        <SelectItem value="Q">Quartile (25%)</SelectItem>
                        <SelectItem value="H">High (30%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Advanced Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dynamic QR Code</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable to update URL later without changing QR code
                    </p>
                  </div>
                  <Switch
                    checked={advanced.isDynamic}
                    onCheckedChange={(checked) => setAdvanced({...advanced, isDynamic: checked})}
                  />
                </div>

                {advanced.isDynamic && (
                  <div className="space-y-3 pl-4 border-l-2 border-primary">
                    <div>
                      <Label htmlFor="password">Password Protection</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Optional password"
                        value={advanced.password}
                        onChange={(e) => setAdvanced({...advanced, password: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expires">Expires At</Label>
                      <Input
                        id="expires"
                        type="datetime-local"
                        value={advanced.expiresAt}
                        onChange={(e) => setAdvanced({...advanced, expiresAt: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom-domain">Custom Domain</Label>
                      <Input
                        id="custom-domain"
                        placeholder="yourdomain.com"
                        value={advanced.customDomain}
                        onChange={(e) => setAdvanced({...advanced, customDomain: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Track scans and analytics
                    </p>
                  </div>
                  <Switch
                    checked={advanced.trackingEnabled}
                    onCheckedChange={(checked) => setAdvanced({...advanced, trackingEnabled: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button onClick={handleGenerateQR} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Zap className="w-4 h-4 mr-2" />
                Generate QR Code
              </Button>
              <Button variant="outline" onClick={handleBulkUpload}>
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-gray-400" />
                </div>
                <div className="mt-4 space-y-2">
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent QR Codes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent QR Codes
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentQRCodes.map((qr) => (
                    <div key={qr.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                          <QrCode className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{qr.name}</p>
                          <p className="text-xs text-muted-foreground">{qr.scans} scans</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total QR Codes</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Scans</span>
                    <span className="font-medium">2,830</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Paused</span>
                    <span className="font-medium">6</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}