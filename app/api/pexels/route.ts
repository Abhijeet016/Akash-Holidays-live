import { NextRequest, NextResponse } from 'next/server'

const cache = new Map<string, string>()

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')
  if (!query) return NextResponse.json({ error: 'Missing query' }, { status: 400 })

  const key = query.toLowerCase()
  if (cache.has(key)) return NextResponse.json({ url: cache.get(key) })

  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'PEXELS_API_KEY not set' }, { status: 500 })

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query + ' travel landscape')}&per_page=5&orientation=landscape`,
      { headers: { Authorization: apiKey } }
    )
    const data = await res.json()
    const url = data.photos?.[0]?.src?.large2x || data.photos?.[0]?.src?.large || ''
    if (url) cache.set(key, url)
    return NextResponse.json({ url })
  } catch {
    return NextResponse.json({ error: 'Pexels fetch failed' }, { status: 500 })
  }
}
