import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      data,
      type = 'STATIC',
      title,
      foregroundColor = '#000000',
      backgroundColor = '#FFFFFF',
      size = 300,
      errorCorrection = 'M',
      logoUrl,
      frameStyle = 'none',
      userId
    } = body

    if (!data) {
      return NextResponse.json(
        { error: 'Data is required' },
        { status: 400 }
      )
    }

    // Generate QR code
    const options = {
      width: size,
      margin: 2,
      color: {
        dark: foregroundColor,
        light: backgroundColor
      },
      errorCorrectionLevel: errorCorrection as 'L' | 'M' | 'Q' | 'H'
    }

    let qrDataUrl = await QRCode.toDataURL(data, options)

    // Apply frame if needed (simplified version)
    if (frameStyle !== 'none' && logoUrl) {
      // In a real implementation, you'd use canvas to apply frame and logo
      // For now, we'll just use the basic QR code
    }

    // Create short ID for dynamic QR
    const shortId = nanoid(8)

    // Save to database if userId is provided
    let savedQR = null
    if (userId) {
      try {
        savedQR = await db.qRCode.create({
          data: {
            userId,
            title,
            type: type as 'STATIC' | 'DYNAMIC',
            data,
            shortId,
            redirectUrl: type === 'DYNAMIC' ? data : undefined,
            foregroundColor,
            backgroundColor,
            size,
            errorCorrection,
            logoUrl,
            frameStyle,
            qrDataUrl
          }
        })

        // Update user's subscription usage
        if (savedQR.type === 'DYNAMIC') {
          await db.subscription.update({
            where: { userId },
            data: {
              dynamicQRCodes: {
                increment: 1
              }
            }
          })
        } else {
          await db.subscription.update({
            where: { userId },
            data: {
              qrCodesGenerated: {
                increment: 1
              }
            }
          })
        }
      } catch (error) {
        console.error('Error saving QR code:', error)
        // Continue without saving if database fails
      }
    }

    return NextResponse.json({
      success: true,
      qrDataUrl,
      shortId: savedQR?.shortId || shortId,
      id: savedQR?.id,
      message: 'QR code generated successfully'
    })

  } catch (error) {
    console.error('Error generating QR code:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const where: any = { userId }
    if (type) {
      where.type = type.toUpperCase()
    }

    const qrCodes = await db.qRCode.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: {
          select: { scans: true }
        }
      }
    })

    const total = await db.qRCode.count({ where })

    return NextResponse.json({
      success: true,
      data: qrCodes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching QR codes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch QR codes' },
      { status: 500 }
    )
  }
}