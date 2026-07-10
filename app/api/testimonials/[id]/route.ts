import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Testimonial } from '@/lib/models'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()
  const { id } = await params
  await Testimonial.findByIdAndDelete(id)
  return NextResponse.json({ message: 'Testimonial deleted' })
}
