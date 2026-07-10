import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Team } from '@/lib/models'

export async function GET() {
  await connectDB()
  const team = await Team.find()
  return NextResponse.json(team)
}

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()
  const member = await Team.create(body)
  return NextResponse.json(member, { status: 201 })
}
