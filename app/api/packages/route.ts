import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Package } from '@/lib/models'
import { verifyAdmin } from '@/lib/auth'

export async function GET() {
  await connectDB()
  const packages = await Package.find()
  return NextResponse.json(packages)
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const pkg = await Package.create(body)
  return NextResponse.json(pkg, { status: 201 })
}
