import BulkQRGenerator from '@/components/bulk-qr-generator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Upload, Zap, Users } from 'lucide-react'
import Link from 'next/link'

export default function BulkPage() {
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
                <Upload className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">Bulk QR Generator</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Masuk</Button>
              <Button>Upgrade ke Premium</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center max-w-4xl mx-auto mb-8">
          <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-100">
            <Zap className="w-3 h-3 mr-1" />
            Premium Feature
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Generate Ratusan QR Code Sekaligus
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            Upload file Excel atau CSV dan generate QR code untuk semua data dalam hitungan menit.
            Sempurna untuk event, produk, atau kebutuhan massal lainnya.
          </p>
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">100 QR/Bulan</h3>
                <p className="text-sm text-slate-600">Untuk user Premium</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Excel & CSV</h3>
                <p className="text-sm text-slate-600">Support semua format</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">ZIP Download</h3>
                <p className="text-sm text-slate-600">Download semua sekaligus</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bulk QR Generator Component */}
        <BulkQRGenerator />
      </section>
    </div>
  )
}