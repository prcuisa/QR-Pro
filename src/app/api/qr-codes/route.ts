import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// Validation schema for creating QR codes
const createQRSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['URL', 'TEXT', 'EMAIL', 'PHONE', 'SMS', 'WIFI', 'LOCATION', 'EVENT', 'VIDEO', 'IMAGE', 'VCARD', 'SOCIAL', 'PAYMENT']),
  data: z.record(z.any()),
  isDynamic: z.boolean().default(false),
  targetUrl: z.string().optional(),
  password: z.string().optional(),
  expiresAt: z.string().optional(),
  customDomain: z.string().optional(),
  design: z.record(z.any()).optional(),
  settings: z.record(z.any()).optional(),
  scanLimit: z.number().optional(),
})

// GET /api/qr-codes - Get all QR codes for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const where: any = { userId }
    
    if (status) {
      where.status = status.toUpperCase()
    }
    
    if (type) {
      where.type = type.toUpperCase()
    }

    const [qrCodes, total] = await Promise.all([
      db.qRCode.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          analytics: {
            take: 5,
            orderBy: { scannedAt: 'desc' }
          }
        }
      }),
      db.qRCode.count({ where })
    ])

    return NextResponse.json({
      qrCodes,
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
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/qr-codes - Create a new QR code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createQRSchema.parse(body)

    // Check user's subscription limits
    const user = await db.user.findUnique({
      where: { id: body.userId },
      include: { subscription: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check QR code limits based on subscription
    const existingQRCodes = await db.qRCode.count({
      where: { userId: body.userId }
    })

    const limits = {
      FREE: 5,
      STANDARD: 50,
      PREMIUM: Infinity,
      ENTERPRISE: Infinity
    }

    const userLimit = limits[user.subscription?.plan as keyof typeof limits] || 5
    
    if (existingQRCodes >= userLimit) {
      return NextResponse.json(
        { error: 'QR code limit exceeded for your subscription plan' },
        { status: 403 }
      )
    }

    // Create QR code
    const qrCode = await db.qRCode.create({
      data: {
        userId: body.userId,
        name: validatedData.name,
        type: validatedData.type,
        data: validatedData.data,
        isDynamic: validatedData.isDynamic,
        targetUrl: validatedData.targetUrl,
        password: validatedData.password,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        customDomain: validatedData.customDomain,
        design: validatedData.design,
        settings: validatedData.settings,
        scanLimit: validatedData.scanLimit,
      },
      include: {
        analytics: true
      }
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId: body.userId,
        action: 'CREATE_QR_CODE',
        resource: 'QRCode',
        resourceId: qrCode.id,
        metadata: {
          name: qrCode.name,
          type: qrCode.type,
          isDynamic: qrCode.isDynamic
        }
      }
    })

    return NextResponse.json(qrCode, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating QR code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}