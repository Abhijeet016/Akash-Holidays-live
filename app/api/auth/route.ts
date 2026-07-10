import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '8h' })
  return NextResponse.json({ token })
}
