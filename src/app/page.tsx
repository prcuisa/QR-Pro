'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  QrCode, 
  Zap, 
  BarChart3, 
  Download, 
  Upload, 
  Palette, 
  Link2, 
  Users, 
  Star,
  Check,
  Crown,
  Rocket,
  TrendingUp,
  Shield,
  Globe
} from 'lucide-react'
import QRGenerator from '@/components/qr-generator'
import Link from 'next/link'
import { useAuth } from '@/lib/authx'
import AuthModal from '@/components/auth-modal'

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState('free')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login')
  const { user, logout } = useAuth()

  const features = [
    {
      icon: <QrCode className="w-6 h-6" />,
      title: "QR Code Custom",
      description: "Buat QR code dengan warna, logo, dan frame custom sesuai brand Anda"
    },
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Bulk Generate",
      description: "Generate ratusan QR code sekaligus dari file Excel/CSV"
    },
    {
      icon: <Link2 className="w-6 h-6" />,
      title: "Dynamic QR",
      description: "Ubah link tujuan tanpa mengganti QR code yang sudah tercetak"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics & Tracking",
      description: "Pantau statistik scan QR code secara real-time"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Multiple Export",
      description: "Export dalam format PNG, PDF, atau ZIP untuk batch download"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "API Integration",
      description: "Integrasi mudah dengan sistem lain menggunakan API"
    }
  ]

  const pricingPlans = [
    {
      id: 'free',
      name: 'Gratis',
      price: 'Rp 0',
      period: '/bulan',
      description: 'Cocok untuk personal testing',
      icon: <Star className="w-5 h-5" />,
      features: [
        '5 QR Code Static',
        'Warna basic',
        'Download PNG',
        'No watermark',
        'Support email'
      ],
      limitations: [
        'Tidak ada dynamic QR',
        'Tidak ada analytics',
        'Tidak ada bulk generate'
      ],
      highlighted: false,
      buttonText: 'Mulai Gratis'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'Rp 49.000',
      period: '/bulan',
      description: 'Untuk bisnis kecil dan menengah',
      icon: <Rocket className="w-5 h-5" />,
      features: [
        'Unlimited QR Code Static',
        '50 QR Code Dynamic/bulan',
        'Custom warna & logo',
        'Frame templates',
        'Analytics dashboard',
        'Bulk generate (100/bulan)',
        'Export PNG & PDF',
        'Priority support'
      ],
      limitations: [],
      highlighted: true,
      buttonText: 'Pilih Premium',
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 'Rp 149.000',
      period: '/bulan',
      description: 'Untuk enterprise dan agency',
      icon: <Crown className="w-5 h-5" />,
      features: [
        'Semua fitur Premium',
        'Unlimited QR Dynamic',
        'Unlimited bulk generate',
        'White-label option',
        'Custom branding',
        'API Access',
        'Advanced analytics',
        'Team collaboration',
        'Dedicated support',
        'Custom integrations'
      ],
      limitations: [],
      highlighted: false,
      buttonText: 'Pilih Pro'
    }
  ]

  const useCases = [
    {
      title: "Payment & E-Wallet",
      description: "QR code untuk pembayaran digital, e-wallet, dan transfer bank",
      icon: "💳"
    },
    {
      title: "Social Media",
      description: "Link ke bio Instagram, WhatsApp, TikTok, dan social media lainnya",
      icon: "📱"
    },
    {
      title: "Business Profile",
      description: "QR code untuk vCard, company profile, dan contact information",
      icon: "👔"
    },
    {
      title: "Event Management",
      description: "Ticketing, check-in, dan event registration QR codes",
      icon: "🎫"
    },
    {
      title: "Restaurant & Menu",
      description: "Digital menu, table ordering, dan restaurant QR codes",
      icon: "🍽️"
    },
    {
      title: "Retail & Product",
      description: "Product information, inventory, dan retail QR codes",
      icon: "🛍️"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">QRGen Pro</span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-slate-600">
                    Hi, {user.name || user.email}!
                  </span>
                  <Button variant="ghost" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setAuthTab('login')
                      setShowAuthModal(true)
                    }}
                  >
                    Masuk
                  </Button>
                  <Button 
                    onClick={() => {
                      setAuthTab('register')
                      setShowAuthModal(true)
                    }}
                  >
                    Daftar Gratis
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered QR Generator
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            QR Generator SaaS Terlengkap di Indonesia
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Buat QR code custom, dynamic, dengan analytics lengkap. 
            Cocok untuk bisnis, event, payment, dan integrasi sistem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8">
              <Rocket className="w-5 h-5 mr-2" />
              Mulai Gratis
            </Button>
            <Link href="/bulk">
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Upload className="w-5 h-5 mr-2" />
                Bulk Generator
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8">
                <BarChart3 className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Demo */}
        <QRGenerator />
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Fitur Lengkap untuk Kebutuhan QR Code Anda
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk membuat dan mengelola QR code profesional
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pilih Paket yang Sesuai untuk Anda
            </h2>
            <p className="text-xl text-slate-600">
              Mulai gratis, upgrade kapan saja sesuai kebutuhan
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.highlighted ? 'border-primary shadow-xl scale-105' : 'hover:shadow-lg transition-shadow'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Paling Populer
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {plan.icon}
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>
                  <div className="mb-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-slate-500">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center gap-2 opacity-60">
                        <span className="w-4 h-4 text-slate-400 flex-shrink-0">×</span>
                        <span className="text-sm text-slate-500">{limitation}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className={`w-full ${plan.highlighted ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Penggunaan QR Code untuk Berbagai Kebutuhan
            </h2>
            <p className="text-xl text-slate-600">
              Solusi QR code untuk berbagai industri dan use case
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-4">{useCase.icon}</div>
                  <CardTitle>{useCase.title}</CardTitle>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap Meningkatkan Bisnis Anda dengan QR Code?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Bergabung dengan ribuan bisnis yang sudah menggunakan QRGen Pro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              <Rocket className="w-5 h-5 mr-2" />
              Mulai Gratis Sekarang
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <TrendingUp className="w-5 h-5 mr-2" />
              Lihat Pricing Lengkap
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <QrCode className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold text-white">QRGen Pro</span>
              </div>
              <p className="text-sm">
                QR Generator SaaS terlengkap di Indonesia dengan fitur custom, dynamic, dan analytics.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produk</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary">QR Generator</a></li>
                <li><a href="#" className="hover:text-primary">Dynamic QR</a></li>
                <li><a href="#" className="hover:text-primary">Bulk Generate</a></li>
                <li><a href="#" className="hover:text-primary">API Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-primary">Harga</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Karir</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 QRGen Pro. All rights reserved. Made with ❤️ in Indonesia.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultTab={authTab}
      />
    </div>
  )
}