import { MetadataRoute } from 'next'
import { connectDB } from '@/lib/db'
import { Package } from '@/lib/models'

const BASE = 'https://akash-holidays.in'

type PackageDoc = { dest: string; updatedAt?: Date }

function toSlug(dest: string) {
  return dest.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let packages: PackageDoc[] = []
  try {
    await connectDB()
    packages = await Package.find({}, 'dest updatedAt').lean() as PackageDoc[]
  } catch { /* use empty */ }

  const packageUrls: MetadataRoute.Sitemap = packages.map(pkg => ({
    url: `${BASE}/packages/${toSlug(pkg.dest)}`,
    lastModified: pkg.updatedAt ?? new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [
    { url: BASE,                          lastModified: new Date(), changeFrequency: 'daily' as const,   priority: 1.0 },
    { url: `${BASE}/packages/kashmir`,    lastModified: new Date(), changeFrequency: 'weekly' as const,  priority: 0.95 },
    { url: `${BASE}/packages/char-dham`,  lastModified: new Date(), changeFrequency: 'weekly' as const,  priority: 0.95 },
    { url: `${BASE}/packages/kedarnath`,  lastModified: new Date(), changeFrequency: 'weekly' as const,  priority: 0.95 },
    { url: `${BASE}/packages/goa`,        lastModified: new Date(), changeFrequency: 'weekly' as const,  priority: 0.9  },
    { url: `${BASE}/packages/kerala`,     lastModified: new Date(), changeFrequency: 'weekly' as const,  priority: 0.9  },
    ...packageUrls,
  ].filter((entry, index, self) =>
    index === self.findIndex(e => e.url === entry.url)
  )
}
