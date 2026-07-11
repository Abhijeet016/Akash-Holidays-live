import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { connectDB } from '@/lib/db'
import { Package } from '@/lib/models'

type PackageDoc = {
  _id: string
  img: string
  dest: string
  nights: string
  persons: string
  discount: string
  desc: string
}

async function getAllPackages(): Promise<PackageDoc[]> {
  try {
    await connectDB()
    const packages = await Package.find().lean()
    return JSON.parse(JSON.stringify(packages))
  } catch { return [] }
}

function toSlug(dest: string) {
  return dest.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export async function generateStaticParams() {
  const packages = await getAllPackages()
  return packages.map(pkg => ({ slug: toSlug(pkg.dest) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const packages = await getAllPackages()
  const pkg = packages.find(p => toSlug(p.dest) === slug)
  if (!pkg) return { title: 'Package Not Found' }

  const title = `${pkg.dest} Tour Package | ${pkg.nights} | Akash Holidays Lucknow`
  const description = `Book ${pkg.dest} tour package for ${pkg.persons}. ${pkg.discount} discount. ${pkg.nights} trip. ${pkg.desc} Best deals from Akash Holidays, Lucknow.`
  const url = `https://akash-holidays.in/packages/${slug}`
  const imgUrl = pkg.img.startsWith('data:') ? 'https://akash-holidays.in/img/Logos.png' : `https://akash-holidays.in/img/${pkg.img}`

  return {
    title,
    description,
    keywords: `${pkg.dest} tour package, ${pkg.dest} trip, ${pkg.dest} holiday, ${pkg.dest} travel, tour packages from Lucknow, Akash Holidays ${pkg.dest}, cheap ${pkg.dest} tour, ${pkg.dest} ${pkg.nights}`,
    alternates: { canonical: url },
    openGraph: {
      title, description, url,
      siteName: 'Akash Holidays',
      images: [{ url: imgUrl, width: 1200, height: 630, alt: `${pkg.dest} Tour Package` }],
      type: 'website',
      locale: 'en_IN',
    },
    twitter: { card: 'summary_large_image', title, description, images: [imgUrl] },
  }
}

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const packages = await getAllPackages()
  const pkg = packages.find(p => toSlug(p.dest) === slug)
  if (!pkg) notFound()

  const imgUrl = pkg.img.startsWith('data:') ? '/img/Logos.png' : `/img/${pkg.img}`
  const canonicalUrl = `https://akash-holidays.in/packages/${slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristTrip',
        name: `${pkg.dest} Tour Package`,
        description: pkg.desc,
        image: `https://akash-holidays.in${imgUrl}`,
        url: canonicalUrl,
        touristType: 'Leisure',
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          url: canonicalUrl,
          seller: { '@type': 'TravelAgency', name: 'Akash Holidays', url: 'https://akash-holidays.in' },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://akash-holidays.in' },
          { '@type': 'ListItem', position: 2, name: 'Packages', item: 'https://akash-holidays.in/#pack' },
          { '@type': 'ListItem', position: 3, name: `${pkg.dest} Tour`, item: canonicalUrl },
        ],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <div style={{ paddingTop: 80 }}>
        <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
          <img src={imgUrl} alt={`${pkg.dest} Tour Package`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', color: '#fff' }}>
            <nav aria-label="breadcrumb" style={{ marginBottom: 12 }}>
              <ol style={{ display: 'flex', justifyContent: 'center', gap: 8, listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>
                <li><a href="/" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Home</a></li>
                <li>/</li>
                <li><a href="/#pack" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Packages</a></li>
                <li>/</li>
                <li style={{ color: '#86B817' }}>{pkg.dest}</li>
              </ol>
            </nav>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 900, margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
              {pkg.dest} Tour Package
            </h1>
            <p style={{ fontSize: '1.1rem', marginTop: 10, color: 'rgba(255,255,255,0.85)' }}>
              {pkg.nights} &nbsp;·&nbsp; {pkg.persons} &nbsp;·&nbsp;
              <span style={{ background: 'linear-gradient(135deg,#ff4d4d,#c0392b)', padding: '2px 12px', borderRadius: 50, fontSize: '0.95rem', fontWeight: 800 }}>
                🔥 {pkg.discount}
              </span>
            </p>
          </div>
        </div>

        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-8">
              <h2 style={{ fontWeight: 800, color: '#14141f', marginBottom: 16 }}>About This Package</h2>
              <p style={{ fontSize: '1.05rem', color: '#555', lineHeight: 1.8 }}>{pkg.desc}</p>
              <div className="row g-3 mt-2">
                {[
                  { icon: 'calendar-alt', label: 'Duration', value: pkg.nights },
                  { icon: 'users', label: 'Group Size', value: pkg.persons },
                  { icon: 'map-marker-alt', label: 'Destination', value: pkg.dest },
                  { icon: 'tag', label: 'Discount', value: pkg.discount },
                ].map(item => (
                  <div key={item.label} className="col-sm-6">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: '#f8fdf0', borderRadius: 14, border: '1px solid #d4edaa' }}>
                      <i className={`fa fa-${item.icon}`} style={{ color: '#86B817', fontSize: '1.2rem', width: 20 }}></i>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</div>
                        <div style={{ fontWeight: 700, color: '#14141f' }}>{item.value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <h3 style={{ fontWeight: 800, marginTop: 40, marginBottom: 16, color: '#14141f' }}>What&apos;s Included</h3>
              <div className="row g-2">
                {['Accommodation', 'Meals (as per itinerary)', 'Sightseeing', 'Transport', 'Travel Guide', 'GST & Taxes'].map(item => (
                  <div key={item} className="col-sm-6">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
                      <i className="fa fa-check-circle" style={{ color: '#86B817' }}></i>
                      <span style={{ color: '#444' }}>{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-4">
              <div style={{ position: 'sticky', top: 100, background: '#fff', borderRadius: 20, boxShadow: '0 8px 40px rgba(0,0,0,0.12)', padding: 32, border: '1px solid #eee' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#c0392b', marginBottom: 4 }}>🔥 {pkg.discount}</div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: 24 }}>Limited time offer · Contact us for pricing</div>
                <a
                  href={`https://wa.me/919839685724?text=Hi! I'm interested in the ${pkg.dest} tour package (${pkg.nights}). Please share more details.`}
                  target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#25D366', color: '#fff', fontWeight: 700, padding: '14px 24px', borderRadius: 14, textDecoration: 'none', marginBottom: 12, fontSize: '1rem' }}
                >
                  <i className="fab fa-whatsapp" style={{ fontSize: '1.2rem' }}></i> Book on WhatsApp
                </a>
                <a
                  href="/#booking"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'linear-gradient(135deg, #86B817, #5a8a00)', color: '#fff', fontWeight: 700, padding: '14px 24px', borderRadius: 14, textDecoration: 'none', fontSize: '1rem' }}
                >
                  <i className="fa fa-paper-plane"></i> Enquire Now
                </a>
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f0f0f0' }}>
                  {[
                    { icon: 'lock', text: 'Secure Booking' },
                    { icon: 'undo-alt', text: 'Free Cancellation' },
                    { icon: 'tag', text: 'Best Price Guarantee' },
                  ].map(t => (
                    <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: '0.85rem', color: '#666' }}>
                      <i className={`fa fa-${t.icon}`} style={{ color: '#86B817', width: 16 }}></i> {t.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
