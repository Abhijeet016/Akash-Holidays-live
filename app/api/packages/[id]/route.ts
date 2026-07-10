import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Package } from '@/lib/models'
import { verifyAdmin } from '@/lib/auth'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { id } = await params
  await Package.findByIdAndDelete(id)
  return NextResponse.json({ message: 'Package deleted' })
}
