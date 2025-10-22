'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Smartphone, 
  Monitor, 
  Tablet,
  Globe,
  Calendar,
  Download,
  QrCode
} from 'lucide-react'

interface AnalyticsData {
  summary: {
    totalScans: number
    uniqueDays: number
    avgScansPerDay: number
    period: string
  }
  charts: {
    scansByDate: Array<{ date: string; count: number }>
  }
  topQRCodes: Array<{
    id: string
    title: string
    shortId: string
    type: string
    scans: number
  }>
  topLocations: Array<{
    location: string
    count: number
  }>
  devices: Array<{
    device: string
    count: number
  }>
}

interface AnalyticsDashboardProps {
  userId: string
}

export default function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7d')
  const [selectedQR, setSelectedQR] = useState<string>('')

  useEffect(() => {
    fetchAnalytics()
  }, [userId, period, selectedQR])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        userId,
        period
      })
      
      if (selectedQR) {
        params.append('qrCodeId', selectedQR)
      }

      const response = await fetch(`/api/analytics?${params}`)
      const data = await response.json()

      if (data.success) {
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />
      case 'desktop':
        return <Monitor className="w-4 h-4" />
      case 'tablet':
        return <Tablet className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-slate-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada data analytics tersedia</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-slate-600">Pantau performa QR code Anda</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Hari</SelectItem>
              <SelectItem value="30d">30 Hari</SelectItem>
              <SelectItem value="90d">90 Hari</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Scans</p>
                <p className="text-2xl font-bold">{analytics.summary.totalScans.toLocaleString('id-ID')}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Hari Aktif</p>
                <p className="text-2xl font-bold">{analytics.summary.uniqueDays}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Rata-rata/Hari</p>
                <p className="text-2xl font-bold">{analytics.summary.avgScansPerDay}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Periode</p>
                <p className="text-2xl font-bold">{analytics.summary.period}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Scans Over Time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Scans Over Time</CardTitle>
            <CardDescription>
              Jumlah scan per hari dalam {analytics.summary.period}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {analytics.charts.scansByDate.length > 0 ? (
                <div className="h-full flex items-end space-x-2">
                  {analytics.charts.scansByDate.map((item, index) => {
                    const maxCount = Math.max(...analytics.charts.scansByDate.map(d => d.count))
                    const height = (item.count / maxCount) * 100
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-primary rounded-t-sm hover:bg-primary/80 transition-colors cursor-pointer"
                          style={{ height: `${height}%` }}
                          title={`${formatDate(item.date)}: ${item.count} scans`}
                        />
                        <span className="text-xs text-slate-500 mt-1">
                          {formatDate(item.date)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <p>Tidak ada data dalam periode ini</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>
              Jenis device yang digunakan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.devices.length > 0 ? (
                analytics.devices.map((device, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.device)}
                      <span className="capitalize">{device.device}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{device.count}</Badge>
                      <div className="w-16 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ 
                            width: `${(device.count / analytics.summary.totalScans) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-4">Tidak ada data device</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top QR Codes and Locations */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top QR Codes */}
        <Card>
          <CardHeader>
            <CardTitle>Top QR Codes</CardTitle>
            <CardDescription>
              QR code dengan scan terbanyak
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topQRCodes.length > 0 ? (
                analytics.topQRCodes.map((qr, index) => (
                  <div key={qr.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{qr.title}</p>
                        <p className="text-sm text-slate-500">{qr.shortId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{qr.scans}</p>
                      <p className="text-xs text-slate-500">scans</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-4">Tidak ada QR code dengan scan</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
            <CardDescription>
              Lokasi dengan scan terbanyak
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topLocations.length > 0 ? (
                analytics.topLocations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-500" />
                        <span>{location.location}</span>
                      </div>
                    </div>
                    <Badge variant="secondary">{location.count}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-4">Tidak ada data lokasi</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}