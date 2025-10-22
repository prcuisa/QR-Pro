'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Camera, 
  FileText, 
  Fingerprint,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Clock,
  Award,
  Users,
  BarChart3,
  TrendingUp,
  Building,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Zap,
  Database,
  Network
} from 'lucide-react'

declare global {
  interface Window {
    ethereum?: any
  }
}

interface IdentityProfile {
  id: string
  walletAddress: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  nationality: string
  address: string
  kycLevel: 'basic' | 'standard' | 'enhanced'
  verificationStatus: 'pending' | 'verified' | 'rejected'
  documents: Document[]
  biometrics: BiometricData
  reputation: ReputationScore
  createdAt: string
  lastUpdated: string
}

interface Document {
  id: string
  type: 'passport' | 'id_card' | 'driving_license' | 'proof_of_address'
  hash: string
  status: 'pending' | 'verified' | 'rejected'
  uploadedAt: string
  url: string
}

interface BiometricData {
  facialRecognition: boolean
  fingerprint: boolean
  voicePrint: boolean
  lastVerified: string
}

interface ReputationScore {
  overall: number
  verificationCount: number
  successRate: number
  trustLevel: 'low' | 'medium' | 'high' | 'excellent'
  badges: string[]
}

interface VerificationRequest {
  id: string
  requesterName: string
  requesterType: 'bank' | 'exchange' | 'employer' | 'government'
  purpose: string
  dataRequested: string[]
  status: 'pending' | 'approved' | 'rejected'
  requestedAt: string
  expiresAt: string
}

export default function Home() {
  const [account, setAccount] = useState<string | null>(null)
  const [profile, setProfile] = useState<IdentityProfile | null>(null)
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSensitiveData, setShowSensitiveData] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [newProfile, setNewProfile] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    address: ''
  })

  const [stats, setStats] = useState({
    totalVerified: 1247,
    pendingRequests: 23,
    successRate: 98.5,
    averageTime: '2.3 minutes',
    partnerCount: 45,
    dataProtected: '2.3M+'
  })

  useEffect(() => {
    checkConnection()
    loadMockData()
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [])

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAccount(accounts[0])
        }
      } catch (error) {
        console.error('Error checking connection:', error)
      }
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null)
      setProfile(null)
    } else {
      setAccount(accounts[0])
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask tidak terinstall. Silakan install MetaMask terlebih dahulu.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      setAccount(accounts[0])
    } catch (error: any) {
      setError(error.message || 'Gagal menghubungkan wallet')
    } finally {
      setIsLoading(false)
    }
  }

  const loadMockData = () => {
    const mockProfile: IdentityProfile = {
      id: '1',
      walletAddress: '0x1234567890123456789012345678901234567890',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+62 812-3456-7890',
      dateOfBirth: '1990-01-15',
      nationality: 'Indonesian',
      address: 'Jakarta, Indonesia',
      kycLevel: 'enhanced',
      verificationStatus: 'verified',
      documents: [
        {
          id: 'doc1',
          type: 'passport',
          hash: '0xabcdef1234567890',
          status: 'verified',
          uploadedAt: '2024-01-15T10:00:00Z',
          url: '/documents/passport.pdf'
        },
        {
          id: 'doc2',
          type: 'proof_of_address',
          hash: '0x1234567890abcdef',
          status: 'verified',
          uploadedAt: '2024-01-15T10:05:00Z',
          url: '/documents/address.pdf'
        }
      ],
      biometrics: {
        facialRecognition: true,
        fingerprint: true,
        voicePrint: false,
        lastVerified: '2024-01-15T10:30:00Z'
      },
      reputation: {
        overall: 95,
        verificationCount: 47,
        successRate: 100,
        trustLevel: 'excellent',
        badges: ['Early Adopter', 'Verified Plus', 'Trusted Member']
      },
      createdAt: '2024-01-01T00:00:00Z',
      lastUpdated: '2024-01-15T10:30:00Z'
    }

    const mockRequests: VerificationRequest[] = [
      {
        id: 'req1',
        requesterName: 'BCA Digital',
        requesterType: 'bank',
        purpose: 'Account opening verification',
        dataRequested: ['name', 'email', 'phone', 'address'],
        status: 'pending',
        requestedAt: '2024-01-20T09:00:00Z',
        expiresAt: '2024-01-27T09:00:00Z'
      },
      {
        id: 'req2',
        requesterName: 'Tokocrypto',
        requesterType: 'exchange',
        purpose: 'KYC verification for trading',
        dataRequested: ['name', 'dateOfBirth', 'nationality'],
        status: 'approved',
        requestedAt: '2024-01-18T14:00:00Z',
        expiresAt: '2024-01-25T14:00:00Z'
      }
    ]

    setProfile(mockProfile)
    setVerificationRequests(mockRequests)
  }

  const createProfile = async () => {
    if (!account || !newProfile.name || !newProfile.email) {
      setError('Mohon lengkapi data profil minimal')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000))

      const newIdentityProfile: IdentityProfile = {
        id: Date.now().toString(),
        walletAddress: account,
        name: newProfile.name,
        email: newProfile.email,
        phone: newProfile.phone,
        dateOfBirth: newProfile.dateOfBirth,
        nationality: newProfile.nationality,
        address: newProfile.address,
        kycLevel: 'basic',
        verificationStatus: 'pending',
        documents: [],
        biometrics: {
          facialRecognition: false,
          fingerprint: false,
          voicePrint: false,
          lastVerified: ''
        },
        reputation: {
          overall: 0,
          verificationCount: 0,
          successRate: 0,
          trustLevel: 'low',
          badges: []
        },
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }

      setProfile(newIdentityProfile)
      setNewProfile({ name: '', email: '', phone: '', dateOfBirth: '', nationality: '', address: '' })
      setActiveTab('overview')
      
      alert('Profil identitas berhasil dibuat di blockchain!')
    } catch (error: any) {
      setError(error.message || 'Gagal membuat profil')
    } finally {
      setIsLoading(false)
    }
  }

  const uploadDocument = async (type: Document['type']) => {
    if (!profile) return

    setIsLoading(true)
    setError(null)

    try {
      // Simulate document upload and verification
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        type,
        hash: `0x${Math.random().toString(16).substr(2, 16)}`,
        status: 'pending',
        uploadedAt: new Date().toISOString(),
        url: `/documents/${type}-${Date.now()}.pdf`
      }

      setProfile(prev => prev ? {
        ...prev,
        documents: [...prev.documents, newDocument],
        lastUpdated: new Date().toISOString()
      } : null)

      // Simulate verification after 3 seconds
      setTimeout(() => {
        setProfile(prev => prev ? {
          ...prev,
          documents: prev.documents.map(doc => 
            doc.id === newDocument.id ? { ...doc, status: 'verified' } : doc
          )
        } : null)
      }, 3000)

      alert(`Dokumen ${type} berhasil diupload dan sedang diverifikasi`)
    } catch (error: any) {
      setError(error.message || 'Gagal upload dokumen')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyBiometrics = async (type: 'facial' | 'fingerprint' | 'voice') => {
    if (!profile) return

    setIsLoading(true)
    setError(null)

    try {
      // Simulate biometric verification
      await new Promise(resolve => setTimeout(resolve, 4000))

      setProfile(prev => prev ? {
        ...prev,
        biometrics: {
          ...prev.biometrics,
          [type === 'facial' ? 'facialRecognition' : type === 'fingerprint' ? 'fingerprint' : 'voicePrint']: true,
          lastVerified: new Date().toISOString()
        },
        lastUpdated: new Date().toISOString()
      } : null)

      alert(`Verifikasi biometrik ${type} berhasil!`)
    } catch (error: any) {
      setError(error.message || 'Gagal verifikasi biometrik')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationRequest = async (requestId: string, action: 'approve' | 'reject') => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1500))

      setVerificationRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: action } : req
      ))

      alert(`Permintaan verifikasi berhasil di-${action}!`)
    } catch (error: any) {
      setError(error.message || 'Gagal memproses permintaan')
    } finally {
      setIsLoading(false)
    }
  }

  const getKycLevelColor = (level: string) => {
    switch (level) {
      case 'basic': return 'bg-blue-100 text-blue-800'
      case 'standard': return 'bg-purple-100 text-purple-800'
      case 'enhanced': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-blue-100 text-blue-800'
      case 'excellent': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRequesterIcon = (type: string) => {
    switch (type) {
      case 'bank': return <Building className="w-4 h-4" />
      case 'exchange': return <TrendingUp className="w-4 h-4" />
      case 'employer': return <Users className="w-4 h-4" />
      case 'government': return <Shield className="w-4 h-4" />
      default: return <Globe className="w-4 h-4" />
    }
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Digital Identity Web3
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  Platform identitas digital terdesentralisasi
                </p>
              </div>
            </div>
            
            <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
              Solusi KYC & identitas digital berbasis blockchain untuk keamanan, 
              privasi, dan compliance yang lebih baik
            </p>

            <Card className="max-w-md mx-auto mb-12">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Lock className="w-5 h-5" />
                  Hubungkan Wallet
                </CardTitle>
                <CardDescription>
                  Hubungkan wallet MetaMask untuk membuat identitas digital Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={connectWallet} 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? 'Menghubungkan...' : 'Hubungkan MetaMask'}
                </Button>
              </CardContent>
            </Card>

            {error && (
              <Alert className="max-w-md mx-auto border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {/* Stats Section */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalVerified.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Identitas Terverifikasi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.successRate}%</p>
                      <p className="text-sm text-gray-600">Tingkat Keberhasilan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Building className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.partnerCount}+</p>
                      <p className="text-sm text-gray-600">Mitra Terpercaya</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Keamanan Blockchain
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Data terenkripsi dan tersimpan permanen di blockchain
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Verifikasi Instan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Proses KYC cepat hanya dalam {stats.averageTime}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Fingerprint className="w-5 h-5 text-green-600" />
                    Biometrik Multi-Factor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Face recognition, fingerprint, dan voice print
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="w-5 h-5 text-purple-600" />
                    Kontrol Data Penuh
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Anda memiliki kontrol penuh atas data pribadi
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Buat Profil Identitas Digital</h1>
            <p className="text-gray-600 mb-8">Lengkapi data diri Anda untuk membuat identitas digital terdesentralisasi</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Data Pribadi
              </CardTitle>
              <CardDescription>
                Informasi dasar yang akan disimpan aman di blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={newProfile.name}
                    onChange={(e) => setNewProfile(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={newProfile.email}
                    onChange={(e) => setNewProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    placeholder="+62 812-3456-7890"
                    value={newProfile.phone}
                    onChange={(e) => setNewProfile(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="dateOfBirth">Tanggal Lahir</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={newProfile.dateOfBirth}
                    onChange={(e) => setNewProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="nationality">Kewarganegaraan</Label>
                  <Input
                    id="nationality"
                    placeholder="Indonesian"
                    value={newProfile.nationality}
                    onChange={(e) => setNewProfile(prev => ({ ...prev, nationality: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Alamat</Label>
                  <Input
                    id="address"
                    placeholder="Jakarta, Indonesia"
                    value={newProfile.address}
                    onChange={(e) => setNewProfile(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </div>
              
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                onClick={createProfile} 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? 'Membuat Profil...' : 'Buat Profil Identitas'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Digital Identity Web3</h1>
                <p className="text-gray-600">Platform identitas digital terdesentralisasi</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Connected Wallet</p>
              <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {account.slice(0, 6)}...{account.slice(-4)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getKycLevelColor(profile.kycLevel)}>
                  KYC {profile.kycLevel.toUpperCase()}
                </Badge>
                <Badge className={getTrustLevelColor(profile.reputation.trustLevel)}>
                  {profile.reputation.trustLevel.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="biometrics">Biometrics</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="reputation">Reputation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profil Identitas
                  </CardTitle>
                  <CardDescription>
                    Informasi identitas digital Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Nama Lengkap</Label>
                      <p className="font-medium">{profile.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Email</Label>
                      <p className="font-medium flex items-center gap-2">
                        {showSensitiveData ? profile.email : '***@***.com'}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowSensitiveData(!showSensitiveData)}
                        >
                          {showSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Telepon</Label>
                      <p className="font-medium">{showSensitiveData ? profile.phone : '***-***-****'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Tanggal Lahir</Label>
                      <p className="font-medium">{profile.dateOfBirth}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Kewarganegaraan</Label>
                      <p className="font-medium">{profile.nationality}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Alamat</Label>
                      <p className="font-medium">{profile.address}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Status Verifikasi</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={
                          profile.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                          profile.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {profile.verificationStatus === 'verified' && <CheckCircle className="w-4 h-4" />}
                          {profile.verificationStatus === 'pending' && <Clock className="w-4 h-4" />}
                          {profile.verificationStatus === 'rejected' && <AlertCircle className="w-4 h-4" />}
                          <span className="ml-1">{profile.verificationStatus}</span>
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Dibuat pada</Label>
                      <p className="font-medium">{new Date(profile.createdAt).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{profile.reputation.overall}</div>
                    <p className="text-sm text-gray-600">Reputation Score</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Verifikasi Berhasil</span>
                      <span className="font-medium">{profile.reputation.verificationCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="font-medium">{profile.reputation.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Documents</span>
                      <span className="font-medium">{profile.documents.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Biometrics</span>
                      <span className="font-medium">
                        {Object.values(profile.biometrics).filter(Boolean).length}/3
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm text-gray-600">Badges</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {profile.reputation.badges.map((badge, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Dokumen Verifikasi
                </CardTitle>
                <CardDescription>
                  Upload dan verifikasi dokumen identitas Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => uploadDocument('passport')}
                    disabled={isLoading}
                    className="h-20 flex-col"
                  >
                    <Camera className="w-6 h-6 mb-2" />
                    Upload Passport
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => uploadDocument('id_card')}
                    disabled={isLoading}
                    className="h-20 flex-col"
                  >
                    <Camera className="w-6 h-6 mb-2" />
                    Upload ID Card
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => uploadDocument('driving_license')}
                    disabled={isLoading}
                    className="h-20 flex-col"
                  >
                    <Camera className="w-6 h-6 mb-2" />
                    Upload Driving License
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => uploadDocument('proof_of_address')}
                    disabled={isLoading}
                    className="h-20 flex-col"
                  >
                    <FileText className="w-6 h-6 mb-2" />
                    Upload Proof of Address
                  </Button>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Dokumen Terupload</h4>
                  <div className="space-y-3">
                    {profile.documents.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium capitalize">{doc.type.replace('_', ' ')}</p>
                              <p className="text-sm text-gray-600">
                                Uploaded: {new Date(doc.uploadedAt).toLocaleDateString('id-ID')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={
                              doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                              doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {doc.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 font-mono">Hash: {doc.hash}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="biometrics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="w-5 h-5" />
                  Verifikasi Biometrik
                </CardTitle>
                <CardDescription>
                  Tingkatkan keamanan dengan verifikasi biometrik multi-faktor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Face Recognition</h3>
                      <p className="text-sm text-gray-600 mb-4">Verifikasi wajah dengan AI</p>
                      {profile.biometrics.facialRecognition ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Button 
                          onClick={() => verifyBiometrics('facial')}
                          disabled={isLoading}
                          className="w-full"
                        >
                          {isLoading ? 'Verifying...' : 'Verify Face'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Fingerprint className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Fingerprint</h3>
                      <p className="text-sm text-gray-600 mb-4">Scan sidik jari</p>
                      {profile.biometrics.fingerprint ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Button 
                          onClick={() => verifyBiometrics('fingerprint')}
                          disabled={isLoading}
                          className="w-full"
                        >
                          {isLoading ? 'Verifying...' : 'Verify Fingerprint'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Voice Print</h3>
                      <p className="text-sm text-gray-600 mb-4">Rekaman suara unik</p>
                      {profile.biometrics.voicePrint ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Button 
                          onClick={() => verifyBiometrics('voice')}
                          disabled={isLoading}
                          className="w-full"
                        >
                          {isLoading ? 'Verifying...' : 'Verify Voice'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {profile.biometrics.lastVerified && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Biometrik terakhir diverifikasi: {new Date(profile.biometrics.lastVerified).toLocaleString('id-ID')}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Permintaan Verifikasi
                </CardTitle>
                <CardDescription>
                  Kelola permintaan akses data dari pihak ketiga
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verificationRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getRequesterIcon(request.requesterType)}
                          <div>
                            <p className="font-semibold">{request.requesterName}</p>
                            <p className="text-sm text-gray-600">{request.purpose}</p>
                          </div>
                        </div>
                        <Badge className={
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {request.status}
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">Data yang diminta:</p>
                        <div className="flex flex-wrap gap-1">
                          {request.dataRequested.map((data, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {data}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          Requested: {new Date(request.requestedAt).toLocaleDateString('id-ID')} - 
                          Expires: {new Date(request.expiresAt).toLocaleDateString('id-ID')}
                        </p>
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleVerificationRequest(request.id, 'approve')}
                              disabled={isLoading}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleVerificationRequest(request.id, 'reject')}
                              disabled={isLoading}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reputation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Reputation & Trust Score
                </CardTitle>
                <CardDescription>
                  Monitoring reputasi dan tingkat kepercayaan identitas Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-2">{profile.reputation.overall}</div>
                  <p className="text-lg text-gray-600">Overall Reputation Score</p>
                  <Badge className={`${getTrustLevelColor(profile.reputation.trustLevel)} mt-2`}>
                    {profile.reputation.trustLevel.toUpperCase()} TRUST LEVEL
                  </Badge>
                </div>

                <Separator />

                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{profile.reputation.verificationCount}</div>
                      <p className="text-sm text-gray-600">Verifikasi Berhasil</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{profile.reputation.successRate}%</div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{profile.reputation.badges.length}</div>
                      <p className="text-sm text-gray-600">Badges Earned</p>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Achievement Badges</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {profile.reputation.badges.map((badge, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Award className="w-6 h-6 text-yellow-600" />
                        <div>
                          <p className="font-medium">{badge}</p>
                          <p className="text-sm text-gray-600">Achievement unlocked</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}