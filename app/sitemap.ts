import { MetadataRoute } from 'next'
import { connectDB } from '@/lib/db'
import { Package } from '@/lib/models'

const BASE = 'https://akash-holidays.in'

type PackageDoc = { dest: string }

function toSlug(dest: string) {
  return dest.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let packages: PackageDoc[] = []
  try {
    await connectDB()
    packages = await Package.find({}, 'dest').lean()
  } catch { /* use empty */ }

  const packageUrls: MetadataRoute.Sitemap = packages.map(pkg => ({
    url: `${BASE}/packages/${toSlug(pkg.dest)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/#about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/#services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/#pack`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/#booking`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...packageUrls,
  ]
}
