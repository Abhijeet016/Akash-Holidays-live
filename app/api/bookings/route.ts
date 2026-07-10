import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Booking } from '@/lib/models'

export async function GET() {
  await connectDB()
  const bookings = await Booking.find().sort({ createdAt: -1 })
  return NextResponse.json(bookings)
}

export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()
  const booking = await Booking.create(body)
  return NextResponse.json(booking, { status: 201 })
}
