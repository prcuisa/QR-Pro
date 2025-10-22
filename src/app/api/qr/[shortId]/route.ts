import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { shortId: string } }
) {
  try {
    const shortId = params.shortId

    // Find QR code by short ID
    const qrCode = await db.qRCode.findUnique({
      where: { shortId },
      include: {
        user: {
          include: {
            subscription: true
          }
        }
      }
    })

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404 }
      )
    }

    if (!qrCode.isActive) {
      return NextResponse.json(
        { error: 'QR code is inactive' },
        { status: 410 }
      )
    }

    // Get client information for tracking
    const userAgent = request.headers.get('user-agent') || undefined
    const referer = request.headers.get('referer') || undefined
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.ip

    // Extract location info (simplified - in production you'd use a proper IP geolocation service)
    let country = undefined
    let city = undefined

    // Save scan data
    try {
      await db.qRScan.create({
        data: {
          qrCodeId: qrCode.id,
          shortId: qrCode.shortId,
          ipAddress: ip,
          userAgent,
          referrer: referer,
          country,
          city
        }
      })
    } catch (error) {
      console.error('Error saving scan data:', error)
      // Continue even if tracking fails
    }

    // Redirect to the target URL
    if (qrCode.type === 'DYNAMIC' && qrCode.redirectUrl) {
      return NextResponse.redirect(qrCode.redirectUrl)
    } else if (qrCode.type === 'STATIC') {
      // For static QR, we can't redirect to the data directly
      // In a real app, you might show a page with the data
      return NextResponse.json({
        success: true,
        data: qrCode.data,
        type: 'static',
        message: 'This is a static QR code'
      })
    }

    return NextResponse.json(
      { error: 'No redirect URL available' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error processing QR scan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}