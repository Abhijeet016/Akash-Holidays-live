import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export function verifyAdmin(req: NextRequest): boolean {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) return false
    jwt.verify(token, process.env.JWT_SECRET!)
    return true
  } catch {
    return false
  }
}
