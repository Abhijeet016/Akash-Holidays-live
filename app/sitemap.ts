import { MetadataRoute } from 'next'

const API = process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.VERCEL_URL}` || 'http://localhost:3000'

type Package = { dest: string }

function toSlug(dest: string) {
  return dest.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let packages: Package[] = []
  try {
    const res = await fetch(`${API}/api/packages`, { next: { revalidate: 3600 } })
    if (res.ok) packages = await res.json()
  } catch { /* use empty */ }

  const packageUrls: MetadataRoute.Sitemap = packages.map(pkg => ({
    url: `https://akashholidays.com/packages/${toSlug(pkg.dest)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  return [
    { url: 'https://akashholidays.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://akashholidays.com/#about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://akashholidays.com/#services', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://akashholidays.com/#pack', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://akashholidays.com/#booking', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...packageUrls,
  ]
}
