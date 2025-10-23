import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// Validation schema for creating/updating subscriptions
const subscriptionSchema = z.object({
  userId: z.string(),
  plan: z.enum(['FREE', 'STANDARD', 'PREMIUM', 'ENTERPRISE']),
  billingCycle: z.enum(['MONTHLY', 'YEARLY']),
  paymentMethod: z.string().optional(),
  paymentId: z.string().optional()
})

// Plan pricing configuration
const PLAN_PRICING = {
  FREE: { monthly: 0, yearly: 0 },
  STANDARD: { monthly: 99000, yearly: 792000 }, // Rp 99K/month, Rp 79K/month yearly
  PREMIUM: { monthly: 299000, yearly: 2392000 }, // Rp 299K/month, Rp 239K/month yearly
  ENTERPRISE: { monthly: 0, yearly: 0 } // Custom pricing
}

// GET /api/subscriptions - Get subscription info
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
            name: true,
            email: true
          }
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/subscriptions - Create or update subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = subscriptionSchema.parse(body)

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: validatedData.userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if subscription already exists
    const existingSubscription = await db.subscription.findUnique({
      where: { userId: validatedData.userId }
    })

    const pricing = PLAN_PRICING[validatedData.plan]
    const recurringAmount = validatedData.billingCycle === 'YEARLY' 
      ? pricing.yearly 
      : pricing.monthly

    const startDate = new Date()
    const endDate = validatedData.billingCycle === 'YEARLY'
      ? new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000)
      : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000)

    let subscription
    let transaction

    if (existingSubscription) {
      // Update existing subscription
      subscription = await db.subscription.update({
        where: { userId: validatedData.userId },
        data: {
          plan: validatedData.plan,
          status: 'ACTIVE',
          startDate,
          endDate,
          recurringAmount,
          billingCycle: validatedData.billingCycle,
          autoRenew: true,
          cancelledAt: null
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      // Create transaction for plan change
      transaction = await db.transaction.create({
        data: {
          userId: validatedData.userId,
          subscriptionId: subscription.id,
          type: existingSubscription.plan === 'FREE' ? 'SUBSCRIPTION' : 'UPGRADE',
          amount: recurringAmount,
          currency: 'IDR',
          status: 'PENDING',
          paymentMethod: validatedData.paymentMethod,
          paymentId: validatedData.paymentId,
          description: `${validatedData.plan} plan - ${validatedData.billingCycle.toLowerCase()}`
        }
      })
    } else {
      // Create new subscription
      subscription = await db.subscription.create({
        data: {
          userId: validatedData.userId,
          plan: validatedData.plan,
          status: 'ACTIVE',
          startDate,
          endDate,
          recurringAmount,
          billingCycle: validatedData.billingCycle,
          autoRenew: true
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      // Create initial transaction
      transaction = await db.transaction.create({
        data: {
          userId: validatedData.userId,
          subscriptionId: subscription.id,
          type: 'SUBSCRIPTION',
          amount: recurringAmount,
          currency: 'IDR',
          status: 'PENDING',
          paymentMethod: validatedData.paymentMethod,
          paymentId: validatedData.paymentId,
          description: `${validatedData.plan} plan - ${validatedData.billingCycle.toLowerCase()}`
        }
      })
    }

    // Log activity
    await db.activityLog.create({
      data: {
        userId: validatedData.userId,
        action: existingSubscription ? 'UPDATE_SUBSCRIPTION' : 'CREATE_SUBSCRIPTION',
        resource: 'Subscription',
        resourceId: subscription.id,
        metadata: {
          plan: validatedData.plan,
          billingCycle: validatedData.billingCycle,
          amount: recurringAmount
        }
      }
    })

    return NextResponse.json({
      subscription,
      transaction
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/subscriptions - Cancel subscription
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, cancelImmediately = false } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const subscription = await db.subscription.findUnique({
      where: { userId }
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    const updateData: any = {
      autoRenew: false,
      cancelledAt: new Date()
    }

    if (cancelImmediately) {
      updateData.status = 'CANCELLED'
      updateData.endDate = new Date()
    }

    const updatedSubscription = await db.subscription.update({
      where: { userId },
      data: updateData
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId,
        action: 'CANCEL_SUBSCRIPTION',
        resource: 'Subscription',
        resourceId: subscription.id,
        metadata: {
          cancelImmediately,
          previousPlan: subscription.plan
        }
      }
    })

    return NextResponse.json(updatedSubscription)
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}