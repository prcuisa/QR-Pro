import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const qrCodeId = searchParams.get('qrCodeId')
    const period = searchParams.get('period') || '7d'
    const type = searchParams.get('type') || 'overview'

    if (!userId && !qrCodeId) {
      return NextResponse.json(
        { error: 'User ID or QR Code ID is required' },
        { status: 400 }
      )
    }

    // Calculate date range based on period
    const now = new Date()
    let startDate: Date

    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    const where: any = {
      scannedAt: {
        gte: startDate
      }
    }

    if (qrCodeId) {
      where.qrCodeId = qrCodeId
    } else if (userId) {
      where.qrCode = {
        userId: userId
      }
    }

    switch (type) {
      case 'overview':
        return await getOverviewAnalytics(where)
      case 'timeline':
        return await getTimelineAnalytics(where, period)
      case 'devices':
        return await getDeviceAnalytics(where)
      case 'locations':
        return await getLocationAnalytics(where)
      case 'top-qr':
        return await getTopQRAnalytics(where, userId)
      default:
        return await getOverviewAnalytics(where)
    }
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getOverviewAnalytics(where: any) {
  const [
    totalScans,
    uniqueScans,
    totalQRs,
    activeQRs
  ] = await Promise.all([
    db.qRAnalytics.count({ where }),
    db.qRAnalytics.count({ where: { ...where, isUnique: true } }),
    db.qRCode.count({
      where: where.qrCodeId 
        ? { id: where.qrCodeId }
        : { userId: where.qrCode.userId }
    }),
    db.qRCode.count({
      where: where.qrCodeId 
        ? { id: where.qrCodeId, status: 'ACTIVE' }
        : { userId: where.qrCode.userId, status: 'ACTIVE' }
    })
  ])

  return NextResponse.json({
    totalScans,
    uniqueScans,
    totalQRs,
    activeQRs,
    conversionRate: totalQRs > 0 ? ((uniqueScans / totalQRs) * 100).toFixed(2) : 0
  })
}

async function getTimelineAnalytics(where: any, period: string) {
  const scans = await db.qRAnalytics.findMany({
    where,
    select: {
      scannedAt: true,
      isUnique: true
    },
    orderBy: { scannedAt: 'asc' }
  })

  // Group scans by time period
  const groupedData: { [key: string]: { total: number; unique: number } } = {}
  
  scans.forEach(scan => {
    const date = new Date(scan.scannedAt)
    let key: string

    switch (period) {
      case '24h':
        key = date.getHours().toString().padStart(2, '0') + ':00'
        break
      case '7d':
      case '30d':
        key = date.toISOString().split('T')[0]
        break
      case '90d':
        key = date.toISOString().split('T')[0].slice(0, 7) // YYYY-MM
        break
      default:
        key = date.toISOString().split('T')[0]
    }

    if (!groupedData[key]) {
      groupedData[key] = { total: 0, unique: 0 }
    }
    
    groupedData[key].total++
    if (scan.isUnique) {
      groupedData[key].unique++
    }
  })

  return NextResponse.json({
    timeline: Object.entries(groupedData).map(([date, data]) => ({
      date,
      totalScans: data.total,
      uniqueScans: data.unique
    }))
  })
}

async function getDeviceAnalytics(where: any) {
  const deviceStats = await db.qRAnalytics.groupBy({
    by: ['device'],
    where,
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    }
  })

  const total = deviceStats.reduce((sum, stat) => sum + stat._count.id, 0)

  return NextResponse.json({
    devices: deviceStats.map(stat => ({
      device: stat.device || 'Unknown',
      count: stat._count.id,
      percentage: total > 0 ? ((stat._count.id / total) * 100).toFixed(2) : 0
    }))
  })
}

async function getLocationAnalytics(where: any) {
  const locationStats = await db.qRAnalytics.groupBy({
    by: ['country'],
    where: {
      ...where,
      country: {
        not: null
      }
    },
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    },
    take: 10
  })

  const total = locationStats.reduce((sum, stat) => sum + stat._count.id, 0)

  return NextResponse.json({
    locations: locationStats.map(stat => ({
      country: stat.country || 'Unknown',
      count: stat._count.id,
      percentage: total > 0 ? ((stat._count.id / total) * 100).toFixed(2) : 0
    }))
  })
}

async function getTopQRAnalytics(where: any, userId?: string | null) {
  const topQRs = await db.qRCode.findMany({
    where: userId ? { userId } : {},
    select: {
      id: true,
      name: true,
      type: true,
      currentScans: true,
      uniqueScans: true,
      status: true,
      createdAt: true,
      analytics: {
        where: {
          scannedAt: {
            gte: where.scannedAt.gte
          }
        },
        select: {
          isUnique: true
        }
      }
    },
    orderBy: {
      currentScans: 'desc'
    },
    take: 10
  })

  const result = topQRs.map(qr => {
    const recentScans = qr.analytics.length
    const recentUnique = qr.analytics.filter(a => a.isUnique).length
    const conversionRate = qr.currentScans > 0 ? ((qr.uniqueScans / qr.currentScans) * 100).toFixed(2) : 0

    return {
      id: qr.id,
      name: qr.name,
      type: qr.type,
      status: qr.status,
      totalScans: qr.currentScans,
      uniqueScans: qr.uniqueScans,
      recentScans,
      recentUnique,
      conversionRate,
      createdAt: qr.createdAt
    }
  })

  return NextResponse.json({
    topQRs: result
  })
}

// POST /api/analytics - Record a QR code scan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrCodeId, ipAddress, userAgent, referer, country, city, device, browser, os } = body

    if (!qrCodeId) {
      return NextResponse.json(
        { error: 'QR Code ID is required' },
        { status: 400 }
      )
    }

    // Check if QR code exists and is active
    const qrCode = await db.qRCode.findUnique({
      where: { id: qrCodeId }
    })

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404 }
      )
    }

    if (qrCode.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'QR code is not active' },
        { status: 400 }
      )
    }

    // Check if QR code has expired
    if (qrCode.expiresAt && new Date() > qrCode.expiresAt) {
      return NextResponse.json(
        { error: 'QR code has expired' },
        { status: 400 }
      )
    }

    // Check scan limit
    if (qrCode.scanLimit && qrCode.currentScans >= qrCode.scanLimit) {
      return NextResponse.json(
        { error: 'QR code scan limit exceeded' },
        { status: 400 }
      )
    }

    // Check if this is a unique scan (same IP, same QR code in last 24 hours)
    const isUnique = !(await db.qRAnalytics.findFirst({
      where: {
        qrCodeId,
        ipAddress,
        scannedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    }))

    // Record the scan
    await Promise.all([
      // Create analytics record
      db.qRAnalytics.create({
        data: {
          qrCodeId,
          ipAddress,
          userAgent,
          referer,
          country,
          city,
          device,
          browser,
          os,
          isUnique
        }
      }),
      
      // Update QR code scan counts
      db.qRCode.update({
        where: { id: qrCodeId },
        data: {
          currentScans: {
            increment: 1
          },
          uniqueScans: isUnique ? {
            increment: 1
          } : undefined
        }
      })
    ])

    return NextResponse.json({ 
      message: 'Scan recorded successfully',
      isUnique,
      targetUrl: qrCode.isDynamic ? qrCode.targetUrl : null
    })
  } catch (error) {
    console.error('Error recording scan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}