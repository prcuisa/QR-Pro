'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Clock,
  MapPin,
  QrCode,
  Activity,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedQR, setSelectedQR] = useState('all')

  const statsCards = [
    {
      title: "Total Scans",
      value: "12,543",
      change: "+23.5%",
      trend: "up",
      icon: <Eye className="w-5 h-5" />,
      color: "text-blue-600"
    },
    {
      title: "Unique Scans",
      value: "8,234",
      change: "+18.2%",
      trend: "up", 
      icon: <Users className="w-5 h-5" />,
      color: "text-green-600"
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-2.1%",
      trend: "down",
      icon: <Target className="w-5 h-5" />,
      color: "text-purple-600"
    },
    {
      title: "Avg. Session Time",
      value: "2m 34s",
      change: "+15.3%",
      trend: "up",
      icon: <Clock className="w-5 h-5" />,
      color: "text-orange-600"
    }
  ]

  const deviceStats = [
    { device: "Mobile", count: 6543, percentage: 52.1, icon: <Smartphone className="w-4 h-4" /> },
    { device: "Desktop", count: 4321, percentage: 34.5, icon: <Monitor className="w-4 h-4" /> },
    { device: "Tablet", count: 1679, percentage: 13.4, icon: <Tablet className="w-4 h-4" /> }
  ]

  const locationStats = [
    { country: "Indonesia", count: 5234, percentage: 41.7, flag: "🇮🇩" },
    { country: "Malaysia", count: 2187, percentage: 17.4, flag: "🇲🇾" },
    { country: "Singapore", count: 1654, percentage: 13.2, flag: "🇸🇬" },
    { country: "Thailand", count: 1234, percentage: 9.8, flag: "🇹🇭" },
    { country: "Others", count: 2234, percentage: 17.9, flag: "🌍" }
  ]

  const topQRCodes = [
    { 
      id: 1, 
      name: "Menu Resto", 
      scans: 3456, 
      unique: 2890, 
      conversion: 4.2,
      trend: "up",
      change: "+12.3%"
    },
    { 
      id: 2, 
      name: "Voucher Promo", 
      scans: 2890, 
      unique: 2341, 
      conversion: 3.8,
      trend: "up", 
      change: "+8.7%"
    },
    { 
      id: 3, 
      name: "Contact Card", 
      scans: 1876, 
      unique: 1543, 
      conversion: 2.9,
      trend: "down", 
      change: "-3.2%"
    },
    { 
      id: 4, 
      name: "WiFi Guest", 
      scans: 1234, 
      unique: 1098, 
      conversion: 2.1,
      trend: "up", 
      change: "+5.4%"
    },
    { 
      id: 5, 
      name: "Event Registration", 
      scans: 987, 
      unique: 876, 
      conversion: 6.7,
      trend: "up", 
      change: "+15.2%"
    }
  ]

  const hourlyData = [
    { hour: "00:00", scans: 234 },
    { hour: "04:00", scans: 156 },
    { hour: "08:00", scans: 567 },
    { hour: "12:00", scans: 1234 },
    { hour: "16:00", scans: 987 },
    { hour: "20:00", scans: 876 },
    { hour: "23:00", scans: 432 }
  ]

  const dailyData = [
    { date: "Mon", scans: 1234, unique: 987 },
    { date: "Tue", scans: 1567, unique: 1234 },
    { date: "Wed", scans: 1890, unique: 1456 },
    { date: "Thu", scans: 2134, unique: 1678 },
    { date: "Fri", scans: 2456, unique: 1890 },
    { date: "Sat", scans: 1987, unique: 1543 },
    { date: "Sun", scans: 1675, unique: 1234 }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Analytics Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedQR} onValueChange={setSelectedQR}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All QR Codes</SelectItem>
                <SelectItem value="menu">Menu Resto</SelectItem>
                <SelectItem value="voucher">Voucher Promo</SelectItem>
                <SelectItem value="contact">Contact Card</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">vs last period</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scan Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Scan Trends
                </CardTitle>
                <CardDescription>
                  QR code scan activity over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="daily" className="w-full">
                  <TabsList>
                    <TabsTrigger value="hourly">Hourly</TabsTrigger>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="hourly" className="mt-6">
                    <div className="h-64 flex items-end justify-between gap-2">
                      {hourlyData.map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div 
                            className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-md"
                            style={{ height: `${(data.scans / 1234) * 100}%` }}
                          />
                          <span className="text-xs text-muted-foreground">{data.hour}</span>
                          <span className="text-xs font-medium">{data.scans}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="daily" className="mt-6">
                    <div className="h-64 flex items-end justify-between gap-2">
                      {dailyData.map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div 
                            className="w-full bg-gradient-to-t from-blue-600 to-cyan-600 rounded-t-md"
                            style={{ height: `${(data.scans / 2456) * 100}%` }}
                          />
                          <span className="text-xs text-muted-foreground">{data.date}</span>
                          <span className="text-xs font-medium">{data.scans}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="weekly" className="mt-6">
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Weekly view coming soon...
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Device Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Device Analytics
                </CardTitle>
                <CardDescription>
                  QR code scans by device type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceStats.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          {device.icon}
                        </div>
                        <div>
                          <p className="font-medium">{device.device}</p>
                          <p className="text-sm text-muted-foreground">{device.count.toLocaleString()} scans</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                            style={{ width: `${device.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{device.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Geographic Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Geographic Analytics
                </CardTitle>
                <CardDescription>
                  QR code scans by location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locationStats.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{location.flag}</span>
                        <div>
                          <p className="font-medium">{location.country}</p>
                          <p className="text-sm text-muted-foreground">{location.count.toLocaleString()} scans</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full"
                            style={{ width: `${location.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{location.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top QR Codes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Top QR Codes
                </CardTitle>
                <CardDescription>
                  Best performing QR codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topQRCodes.map((qr, index) => (
                    <div key={qr.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{qr.name}</p>
                          <p className="text-xs text-muted-foreground">{qr.scans.toLocaleString()} scans</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {qr.trend === 'up' ? (
                            <ArrowUpRight className="w-3 h-3 text-green-500" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-red-500" />
                          )}
                          <span className={`text-xs font-medium ${
                            qr.trend === 'up' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {qr.change}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{qr.conversion}% conv.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <QrCode className="w-4 h-4 mr-2" />
                  Create New QR Code
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button className="w-full" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Report
                </Button>
                <Button className="w-full" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Share Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Load Time</span>
                    <span className="font-medium">1.2s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Bounce Rate</span>
                    <span className="font-medium">32.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Page Views</span>
                    <span className="font-medium">45.2K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Session Duration</span>
                    <span className="font-medium">3m 24s</span>
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