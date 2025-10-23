import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// Validation schema for updating QR codes
const updateQRSchema = z.object({
  name: z.string().min(1).optional(),
  targetUrl: z.string().optional(),
  password: z.string().optional(),
  expiresAt: z.string().optional(),
  customDomain: z.string().optional(),
  design: z.record(z.any()).optional(),
  settings: z.record(z.any()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED', 'SUSPENDED']).optional(),
})

// GET /api/qr-codes/[id] - Get a specific QR code
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const qrCode = await db.qRCode.findUnique({
      where: { id: params.id },
      include: {
        analytics: {
          orderBy: { scannedAt: 'desc' },
          take: 50
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
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

    return NextResponse.json(qrCode)
  } catch (error) {
    console.error('Error fetching QR code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/qr-codes/[id] - Update a QR code
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateQRSchema.parse(body)

    // Check if QR code exists
    const existingQR = await db.qRCode.findUnique({
      where: { id: params.id }
    })

    if (!existingQR) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404 }
      )
    }

    // Update QR code
    const updateData: any = {}
    
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.targetUrl !== undefined) updateData.targetUrl = validatedData.targetUrl
    if (validatedData.password !== undefined) updateData.password = validatedData.password
    if (validatedData.expiresAt !== undefined) {
      updateData.expiresAt = validatedData.expiresAt ? new Date(validatedData.expiresAt) : null
    }
    if (validatedData.customDomain !== undefined) updateData.customDomain = validatedData.customDomain
    if (validatedData.design !== undefined) updateData.design = validatedData.design
    if (validatedData.settings !== undefined) updateData.settings = validatedData.settings
    if (validatedData.status !== undefined) updateData.status = validatedData.status

    const qrCode = await db.qRCode.update({
      where: { id: params.id },
      data: updateData,
      include: {
        analytics: {
          take: 5,
          orderBy: { scannedAt: 'desc' }
        }
      }
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId: existingQR.userId,
        action: 'UPDATE_QR_CODE',
        resource: 'QRCode',
        resourceId: qrCode.id,
        metadata: {
          updatedFields: Object.keys(updateData)
        }
      }
    })

    return NextResponse.json(qrCode)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating QR code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/qr-codes/[id] - Delete a QR code
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if QR code exists
    const existingQR = await db.qRCode.findUnique({
      where: { id: params.id }
    })

    if (!existingQR) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404 }
      )
    }

    // Soft delete by updating status
    await db.qRCode.update({
      where: { id: params.id },
      data: { status: 'DELETED' }
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId: existingQR.userId,
        action: 'DELETE_QR_CODE',
        resource: 'QRCode',
        resourceId: params.id,
        metadata: {
          name: existingQR.name,
          type: existingQR.type
        }
      }
    })

    return NextResponse.json({ message: 'QR code deleted successfully' })
  } catch (error) {
    console.error('Error deleting QR code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}