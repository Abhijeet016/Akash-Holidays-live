import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Testimonial } from '@/lib/models'

export async function GET() {
  await connectDB()
  const testimonials = await Testimonial.find()
  return NextResponse.json(testimonials)
}

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()
  const testimonial = await Testimonial.create(body)
  return NextResponse.json(testimonial, { status: 201 })
}
