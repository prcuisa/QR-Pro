import AnalyticsDashboard from '@/components/analytics-dashboard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, BarChart3, QrCode, Users, Settings } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  // Mock user ID - in real app, this would come from authentication
  const userId = "mock-user-id"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">Analytics Dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Settings</Button>
              <Button>Upgrade Plan</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center max-w-4xl mx-auto mb-8">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
            <BarChart3 className="w-3 h-3 mr-1" />
            Premium Analytics
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Dashboard Analytics QR Code
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            Pantau performa QR code Anda secara real-time. Lihat statistik scan, 
            demografi pengguna, dan optimalkan strategi marketing Anda.
          </p>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="qr-codes">QR Codes</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsDashboard userId={userId} />
          </TabsContent>

          <TabsContent value="qr-codes" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    QR Code Management
                  </CardTitle>
                  <CardDescription>
                    Kelola semua QR code Anda dan pantau performanya
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-slate-500">
                    <QrCode className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>QR Code management akan segera tersedia</p>
                    <p className="text-sm">Fitur ini sedang dalam pengembangan</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Dashboard Settings
                  </CardTitle>
                  <CardDescription>
                    Konfigurasi preferensi dashboard dan notifikasi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-slate-500">
                    <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Pengaturan dashboard akan segera tersedia</p>
                    <p className="text-sm">Fitur ini sedang dalam pengembangan</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}