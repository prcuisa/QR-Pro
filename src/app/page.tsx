'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Zap, Shield, Globe, BarChart3, Users, Lock, Palette, Download, Database, CreditCard, Crown, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState('standard')

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "QR Code Static & Dynamic",
      description: "Buat QR code statis dan dinamis dengan kemampuan update URL secara real-time"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Bulk Generator",
      description: "Generate ratusan QR code sekaligus dari file CSV/Excel"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Custom Design",
      description: "Kustomisasi warna, logo, shape, dan gradient sesuai brand Anda"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Custom Domain",
      description: "Gunakan domain sendiri untuk white-label solution"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Pantau performa QR code dengan statistik scan, lokasi, dan device"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Password Protection",
      description: "Amankan QR code penting dengan password protection"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Cloud Storage",
      description: "Simpan logo dan data QR code dengan aman di cloud"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Multi Payment",
      description: "Terima pembayaran via Stripe, Midtrans, dan PayPal"
    }
  ]

  const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      price: 'Rp 0',
      period: '/bulan',
      description: 'Cocok untuk mencoba fitur dasar',
      icon: <Star className="w-5 h-5" />,
      features: [
        '5 QR Code Static',
        '100 scan/bulan',
        'Basic templates',
        'Export PNG',
        'Community support'
      ],
      notIncluded: [
        'Dynamic QR',
        'Custom logo',
        'Analytics',
        'Bulk generator',
        'API Access'
      ],
      popular: false,
      cta: 'Mulai Gratis'
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 'Rp 99K',
      period: '/bulan',
      description: 'Perfect untuk bisnis kecil dan UMKM',
      icon: <Sparkles className="w-5 h-5" />,
      features: [
        '50 QR Code (Static & Dynamic)',
        '5,000 scan/bulan',
        'Custom logo & warna',
        'Basic analytics',
        'Export PNG, SVG, PDF',
        'Email support',
        'Bulk generator (50/batch)'
      ],
      notIncluded: [
        'Custom domain',
        'Advanced analytics',
        'API Access',
        'White label',
        'Priority support'
      ],
      popular: true,
      cta: 'Pilih Standard'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'Rp 299K',
      period: '/bulan',
      description: 'Solusi lengkap untuk enterprise',
      icon: <Crown className="w-5 h-5" />,
      features: [
        'Unlimited QR Code',
        'Unlimited scan',
        'Advanced analytics',
        'Custom domain',
        'White label solution',
        'API Access',
        'Bulk generator (unlimited)',
        'Priority support 24/7',
        'Team collaboration',
        'Password protection'
      ],
      notIncluded: [],
      popular: false,
      cta: 'Pilih Premium'
    }
  ]

  const stats = [
    { label: "QR Code Dibuat", value: "500K+", suffix: "" },
    { label: "Scan Total", value: "10M+", suffix: "" },
    { label: "User Aktif", value: "10K+", suffix: "" },
    { label: "Uptime", value: "99.9", suffix: "%" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">QR Generator Prcuisa</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Fitur
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Harga
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/analytics" className="text-sm font-medium hover:text-primary transition-colors">
              Analytics
            </Link>
            <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
              Admin
            </Link>
            <Button variant="outline">Masuk</Button>
            <Button>Daftar Gratis</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            🚀 Platform QR Code Premium #1 di Indonesia
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            QR Code Generator Professional untuk Bisnis Modern
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Buat, kelola, dan lacak QR code dengan fitur premium. Dynamic QR, analytics lengkap, custom domain, dan white-label solution untuk brand Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Sparkles className="w-4 h-4 mr-2" />
              <Link href="/dashboard">Mulai Gratis</Link>
            </Button>
            <Button size="lg" variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              <Link href="/pricing">Lihat Demo</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Premium untuk Bisnis Anda</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk QR code marketing yang efektif
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pilih Paket yang Sesuai</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Mulai gratis, upgrade kapan saja sesuai kebutuhan bisnis Anda
          </p>
          <div className="mt-4">
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                Lihat Semua Paket
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? 'border-2 border-primary shadow-xl scale-105' : 'border shadow-lg'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                    Paling Populer
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-muted'}`}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 opacity-50">
                      <div className="w-4 h-4 border border-gray-300 rounded-sm flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap Meningkatkan Marketing Anda?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Bergabung dengan 10,000+ bisnis yang sudah menggunakan QR Generator Prcuisa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
              <Download className="w-4 h-4 mr-2" />
              Download App
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              <Shield className="w-4 h-4 mr-2" />
              Garansi 30 Hari
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">QR Generator Prcuisa</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Platform QR Code premium untuk bisnis modern di Indonesia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">QR Generator</Link></li>
                <li><Link href="#" className="hover:text-primary">Analytics</Link></li>
                <li><Link href="#" className="hover:text-primary">API</Link></li>
                <li><Link href="#" className="hover:text-primary">Enterprise</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Tentang Kami</Link></li>
                <li><Link href="#" className="hover:text-primary">Karir</Link></li>
                <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary">Kontak</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Help Center</Link></li>
                <li><Link href="#" className="hover:text-primary">API Docs</Link></li>
                <li><Link href="#" className="hover:text-primary">Status</Link></li>
                <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 QR Generator Prcuisa. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}