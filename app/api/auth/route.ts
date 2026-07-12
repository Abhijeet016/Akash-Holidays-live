import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL,
  process.env.ADMIN_EMAIL_2,
].filter(Boolean)

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (!ADMIN_EMAILS.includes(email) || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '8h' })
  return NextResponse.json({ token })
}
