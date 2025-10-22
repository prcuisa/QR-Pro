import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const qrCodeId = searchParams.get('qrCodeId')
    const period = searchParams.get('period') || '7d' // 7d, 30d, 90d

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Calculate date range
    const now = new Date()
    let startDate = new Date()

    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Build where clause
    const where: any = {
      scannedAt: {
        gte: startDate
      }
    }

    if (qrCodeId) {
      where.qrCodeId = qrCodeId
    } else {
      // Get all QR codes for this user
      const userQRCodes = await db.qRCode.findMany({
        where: { userId },
        select: { id: true }
      })
      where.qrCodeId = {
        in: userQRCodes.map(qr => qr.id)
      }
    }

    // Get scan data
    const scans = await db.qRScan.findMany({
      where,
      orderBy: { scannedAt: 'desc' },
      include: {
        qrCode: {
          select: {
            id: true,
            title: true,
            shortId: true,
            type: true
          }
        }
      }
    })

    // Calculate analytics
    const totalScans = scans.length
    const uniqueDays = new Set(scans.map(scan => 
      scan.scannedAt.toISOString().split('T')[0]
    )).size

    // Group by date for chart data
    const scansByDate: { [key: string]: number } = {}
    scans.forEach(scan => {
      const date = scan.scannedAt.toISOString().split('T')[0]
      scansByDate[date] = (scansByDate[date] || 0) + 1
    })

    // Group by QR code
    const scansByQR: { [key: string]: any } = {}
    scans.forEach(scan => {
      const qrId = scan.qrCodeId
      if (!scansByQR[qrId]) {
        scansByQR[qrId] = {
          id: scan.qrCode.id,
          title: scan.qrCode.title || 'Untitled',
          shortId: scan.qrCode.shortId,
          type: scan.qrCode.type,
          scans: 0
        }
      }
      scansByQR[qrId].scans++
    })

    // Get top locations (simplified)
    const locations: { [key: string]: number } = {}
    scans.forEach(scan => {
      if (scan.country) {
        const location = scan.city ? `${scan.city}, ${scan.country}` : scan.country
        locations[location] = (locations[location] || 0) + 1
      }
    })

    // Get device info (simplified)
    const devices: { [key: string]: number } = {}
    scans.forEach(scan => {
      if (scan.userAgent) {
        let device = 'Unknown'
        if (scan.userAgent.includes('Mobile')) device = 'Mobile'
        else if (scan.userAgent.includes('Tablet')) device = 'Tablet'
        else if (scan.userAgent.includes('Windows') || scan.userAgent.includes('Mac') || scan.userAgent.includes('Linux')) device = 'Desktop'
        
        devices[device] = (devices[device] || 0) + 1
      }
    })

    return NextResponse.json({
      success: true,
      analytics: {
        summary: {
          totalScans,
          uniqueDays,
          avgScansPerDay: uniqueDays > 0 ? Math.round(totalScans / uniqueDays) : 0,
          period
        },
        charts: {
          scansByDate: Object.entries(scansByDate)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date))
        },
        topQRCodes: Object.values(scansByQR)
          .sort((a, b) => b.scans - a.scans)
          .slice(0, 10),
        topLocations: Object.entries(locations)
          .map(([location, count]) => ({ location, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        devices: Object.entries(devices)
          .map(([device, count]) => ({ device, count }))
          .sort((a, b) => b.count - a.count)
      }
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}