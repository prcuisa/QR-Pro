import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const PLAN_LIMITS = {
  FREE: {
    qrCodes: 5,
    dynamicQRCodes: 0,
    bulkGenerate: 0,
    analytics: false,
    customBranding: false,
    apiAccess: false
  },
  PREMIUM: {
    qrCodes: -1, // unlimited
    dynamicQRCodes: 50,
    bulkGenerate: 100,
    analytics: true,
    customBranding: false,
    apiAccess: false
  },
  PRO: {
    qrCodes: -1, // unlimited
    dynamicQRCodes: -1, // unlimited
    bulkGenerate: -1, // unlimited
    analytics: true,
    customBranding: true,
    apiAccess: true
  },
  ENTERPRISE: {
    qrCodes: -1, // unlimited
    dynamicQRCodes: -1, // unlimited
    bulkGenerate: -1, // unlimited
    analytics: true,
    customBranding: true,
    apiAccess: true
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const subscription = await db.subscription.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    if (!subscription) {
      // Create default free subscription
      const newSubscription = await db.subscription.create({
        data: {
          userId,
          plan: 'FREE',
          status: 'active'
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        subscription: newSubscription,
        limits: PLAN_LIMITS.FREE,
        usage: {
          qrCodesGenerated: 0,
          dynamicQRCodes: 0,
          bulkGenerated: 0
        }
      })
    }

    const limits = PLAN_LIMITS[subscription.plan as keyof typeof PLAN_LIMITS]

    return NextResponse.json({
      success: true,
      subscription,
      limits,
      usage: {
        qrCodesGenerated: subscription.qrCodesGenerated,
        dynamicQRCodes: subscription.dynamicQRCodes,
        bulkGenerated: subscription.bulkGenerated
      }
    })

  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, plan, paymentMethodId } = body

    if (!userId || !plan) {
      return NextResponse.json(
        { error: 'User ID and plan are required' },
        { status: 400 }
      )
    }

    if (!Object.keys(PLAN_LIMITS).includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    // In a real implementation, you would process payment here
    // For now, we'll just update the subscription
    const subscription = await db.subscription.upsert({
      where: { userId },
      update: {
        plan: plan as any,
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        cancelAtPeriodEnd: false
      },
      create: {
        userId,
        plan: plan as any,
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        cancelAtPeriodEnd: false
      }
    })

    return NextResponse.json({
      success: true,
      subscription,
      limits: PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS],
      message: `Successfully upgraded to ${plan} plan`
    })

  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const subscription = await db.subscription.update({
      where: { userId },
      data: {
        cancelAtPeriodEnd: true
      }
    })

    return NextResponse.json({
      success: true,
      subscription,
      message: 'Subscription will be cancelled at the end of the billing period'
    })

  } catch (error) {
    console.error('Error cancelling subscription:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}