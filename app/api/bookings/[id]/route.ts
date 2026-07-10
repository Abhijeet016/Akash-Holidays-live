import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Booking } from '@/lib/models'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()
  const { id } = await params
  const { status } = await req.json()
  const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true })
  return NextResponse.json(booking)
}
