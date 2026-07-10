import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Team } from '@/lib/models'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()
  const { id } = await params
  await Team.findByIdAndDelete(id)
  return NextResponse.json({ message: 'Member deleted' })
}
