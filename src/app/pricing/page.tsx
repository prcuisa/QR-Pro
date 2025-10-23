'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Globe, 
  BarChart3, 
  Users, 
  Lock, 
  Palette, 
  Download, 
  Database, 
  CreditCard, 
  Crown, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Headphones,
  Rocket,
  Building,
  CheckCircle2,
  XCircle
} from 'lucide-react'

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      id: 'free',
      name: 'Free',
      tagline: 'Perfect untuk mencoba fitur dasar',
      price: {
        monthly: 'Rp 0',
        annual: 'Rp 0'
      },
      period: '/bulan',
      icon: <Star className="w-6 h-6" />,
      color: 'from-gray-600 to-gray-800',
      popular: false,
      features: [
        { text: '5 QR Code Static', included: true },
        { text: '100 scan/bulan', included: true },
        { text: 'Basic templates', included: true },
        { text: 'Export PNG (300dpi)', included: true },
        { text: 'Community support', included: true },
        { text: 'QR Code Dynamic', included: false },
        { text: 'Custom logo & warna', included: false },
        { text: 'Analytics dashboard', included: false },
        { text: 'Bulk generator', included: false },
        { text: 'API Access', included: false },
        { text: 'Custom domain', included: false },
        { text: 'White label', included: false },
        { text: 'Priority support', included: false },
        { text: 'Team collaboration', included: false },
        { text: 'Password protection', included: false }
      ],
      cta: 'Mulai Gratis',
      ctaVariant: 'outline'
    },
    {
      id: 'standard',
      name: 'Standard',
      tagline: 'Perfect untuk bisnis kecil dan UMKM',
      price: {
        monthly: 'Rp 99K',
        annual: 'Rp 79K'
      },
      period: '/bulan',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-purple-600 to-pink-600',
      popular: true,
      features: [
        { text: '50 QR Code (Static & Dynamic)', included: true },
        { text: '5,000 scan/bulan', included: true },
        { text: 'Custom logo & warna', included: true },
        { text: 'Basic analytics', included: true },
        { text: 'Export PNG, SVG, PDF', included: true },
        { text: 'Email support', included: true },
        { text: 'Bulk generator (50/batch)', included: true },
        { text: 'Password protection', included: true },
        { text: 'QR Code expiration', included: true },
        { text: 'Custom domain', included: false },
        { text: 'Advanced analytics', included: false },
        { text: 'API Access', included: false },
        { text: 'White label solution', included: false },
        { text: 'Priority support 24/7', included: false },
        { text: 'Team collaboration', included: false }
      ],
      cta: 'Pilih Standard',
      ctaVariant: 'default'
    },
    {
      id: 'premium',
      name: 'Premium',
      tagline: 'Solusi lengkap untuk enterprise',
      price: {
        monthly: 'Rp 299K',
        annual: 'Rp 239K'
      },
      period: '/bulan',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-amber-600 to-orange-600',
      popular: false,
      features: [
        { text: 'Unlimited QR Code', included: true },
        { text: 'Unlimited scan', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Custom domain', included: true },
        { text: 'White label solution', included: true },
        { text: 'API Access', included: true },
        { text: 'Bulk generator (unlimited)', included: true },
        { text: 'Priority support 24/7', included: true },
        { text: 'Team collaboration (10 users)', included: true },
        { text: 'Password protection', included: true },
        { text: 'Custom branding', included: true },
        { text: 'Advanced security', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'SLA guarantee 99.9%', included: true }
      ],
      cta: 'Pilih Premium',
      ctaVariant: 'default'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      tagline: 'Kustomisasi penuh untuk korporasi',
      price: {
        monthly: 'Custom',
        annual: 'Custom'
      },
      period: '',
      icon: <Building className="w-6 h-6" />,
      color: 'from-slate-700 to-slate-900',
      popular: false,
      features: [
        { text: 'Everything in Premium', included: true },
        { text: 'Unlimited team users', included: true },
        { text: 'Custom development', included: true },
        { text: 'On-premise deployment', included: true },
        { text: 'SSO integration', included: true },
        { text: 'Advanced security compliance', included: true },
        { text: 'Custom analytics reports', included: true },
        { text: 'API rate limit: 1M requests/hour', included: true },
        { text: 'Dedicated infrastructure', included: true },
        { text: 'Custom contracts & SLA', included: true },
        { text: 'Training & onboarding', included: true },
        { text: '24/7 phone support', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'White label with custom domain', included: true },
        { text: 'Priority feature requests', included: true }
      ],
      cta: 'Hubungi Sales',
      ctaVariant: 'outline'
    }
  ]

  const faqs = [
    {
      question: "Apa perbedaan QR Code Static dan Dynamic?",
      answer: "QR Code Static mengandung data yang tidak bisa diubah setelah dibuat, sedangkan QR Code Dynamic bisa diubah target URL-nya kapan saja tanpa mengubah QR code itu sendiri."
    },
    {
      question: "Bisakah saya upgrade/downgrade paket kapan saja?",
      answer: "Ya, Anda bisa upgrade atau downgrade paket kapan saja. Jika upgrade, Anda akan langsung mendapatkan fitur baru. Jika downgrade, perubahan akan berlaku di periode penagihan berikutnya."
    },
    {
      question: "Apakah ada batasan untuk API di paket Premium?",
      answer: "Paket Premium memiliki batasan 10,000 request per jam. Jika Anda membutuhkan lebih, kami merekomendasikan paket Enterprise dengan batasan 1M request per jam."
    },
    {
      question: "Bagaimana dengan keamanan data saya?",
      answer: "Kami menggunakan enkripsi end-to-end, compliance dengan GDPR, dan backup otomatis. Data Anda aman dan hanya bisa diakses oleh Anda dan tim Anda."
    },
    {
      question: "Apakah ada trial untuk paket berbayar?",
      answer: "Ya, kami menawarkan trial 14 hari untuk paket Standard dan Premium. Tidak perlu kartu kredit untuk memulai trial."
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      company: "TechCorp Indonesia",
      content: "QR Generator Prcuisa telah mengubah cara kami melakukan marketing. Analytics yang detail membantu kami memahami customer behavior dengan lebih baik.",
      rating: 5
    },
    {
      name: "Budi Santoso",
      role: "Owner",
      company: "Resto Nusantara",
      content: "Sangat mudah digunakan! Fitur bulk generator menghemat waktu saya berjam-jam. Customer saya suka dengan QR code menu yang bisa di-update kapan saja.",
      rating: 5
    },
    {
      name: "Maya Putri",
      role: "Digital Strategist",
      company: "Creative Agency",
      content: "White label solution memungkinkan kami menawarkan QR code services ke client kami dengan brand kami sendiri. Perfect untuk agency seperti kami!",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Pricing Plans</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Headphones className="w-4 h-4 mr-2" />
              Contact Sales
            </Button>
            <Button size="sm">
              <Rocket className="w-4 h-4 mr-2" />
              Start Free Trial
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            💰 Hemat hingga 20% dengan billing tahunan
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Pilih Paket yang Sesuai untuk Bisnis Anda
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Mulai gratis, upgrade kapan saja. Tidak ada biaya tersembunyi, cancel kapan saja.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isAnnual ? 'font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <span className={`text-sm ${isAnnual ? 'font-medium' : 'text-muted-foreground'}`}>
              Annual
              <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                Save 20%
              </Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-20">
          {plans.map((plan) => (
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
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${plan.color} text-white`}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.tagline}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {plan.price[isAnnual ? 'annual' : 'monthly']}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                  {isAnnual && plan.id !== 'free' && plan.id !== 'enterprise' && (
                    <div className="text-sm text-green-600 mt-1">
                      Billed annually (save 20%)
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      {feature.included ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${feature.included ? '' : 'text-muted-foreground'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator />
                <Button 
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : ''}`}
                  variant={plan.ctaVariant}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Perbandingan Fitur Lengkap</h2>
            <p className="text-xl text-muted-foreground">
              Lihat semua fitur yang tersedia di setiap paket
            </p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Fitur</th>
                      <th className="text-center py-3 px-4">Free</th>
                      <th className="text-center py-3 px-4">Standard</th>
                      <th className="text-center py-3 px-4">Premium</th>
                      <th className="text-center py-3 px-4">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">QR Code Static</td>
                      <td className="text-center py-3 px-4">5</td>
                      <td className="text-center py-3 px-4">25</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">QR Code Dynamic</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">25</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Scan/bulan</td>
                      <td className="text-center py-3 px-4">100</td>
                      <td className="text-center py-3 px-4">5,000</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Custom Logo</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Analytics</td>
                      <td className="text-center py-3 px-4">Basic</td>
                      <td className="text-center py-3 px-4">Standard</td>
                      <td className="text-center py-3 px-4">Advanced</td>
                      <td className="text-center py-3 px-4">Custom</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">API Access</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Custom Domain</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">✓</td>
                      <td className="text-center py-3 px-4">✓</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Team Users</td>
                      <td className="text-center py-3 px-4">1</td>
                      <td className="text-center py-3 px-4">3</td>
                      <td className="text-center py-3 px-4">10</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Apa Kata Mereka</h2>
            <p className="text-xl text-muted-foreground">
              Lebih dari 10,000 bisnis percaya pada QR Generator Prcuisa
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Pertanyaan yang sering diajukan tentang pricing dan fitur
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Siap Memulai QR Code Marketing?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Bergabung dengan 10,000+ bisnis yang sudah menggunakan QR Generator Prcuisa untuk meningkatkan marketing mereka
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
              <Rocket className="w-4 h-4 mr-2" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              <Headphones className="w-4 h-4 mr-2" />
              Hubungi Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}