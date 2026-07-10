'use client'
import { useState, useEffect, useMemo } from 'react'

type Package = {
  _id: string
  img: string
  dest: string
  nights: string
  persons: string
  price: string
  desc: string
}

const DISCOUNT_OPTIONS = [10, 15, 20, 25, 30, 35, 40]

function getDiscount(id: string) {
  // deterministic per package so it doesn't change on re-render
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff
  return DISCOUNT_OPTIONS[Math.abs(hash) % DISCOUNT_OPTIONS.length]
}

function calcOriginal(price: string, discountPct: number) {
  const num = parseFloat(price.replace(/,/g, ''))
  if (isNaN(num)) return null
  const original = num / (1 - discountPct / 100)
  return Math.round(original)
}

function formatINR(n: number) {
  return n.toLocaleString('en-IN')
}

function toSlug(dest: string) {
  return dest.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function PackagesSection({ initial }: { initial: Package[] }) {
  const [packages] = useState<Package[]>(initial)
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <style>{`
        .pkg-section { background: linear-gradient(180deg, #f8fdf0 0%, #ffffff 100%); padding: 80px 0; }

        .pkg-header-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #86B817 0%, #5a8a00 100%);
          color: #fff; font-size: 0.75rem; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 6px 20px; border-radius: 50px;
          box-shadow: 0 4px 16px rgba(134,184,23,0.35);
          margin-bottom: 16px;
        }

        .pkg-title { font-size: 2.6rem; font-weight: 800; color: #14141F; line-height: 1.2; }
        .pkg-title span { color: #86B817; }
        .pkg-subtitle { color: #6c757d; font-size: 1.05rem; max-width: 520px; margin: 0 auto 36px; }

        .pkg-card {
          background: #fff; border-radius: 20px; overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          border: 1px solid rgba(0,0,0,0.05);
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease;
          height: 100%;
        }
        .pkg-card:hover { transform: translateY(-12px); box-shadow: 0 24px 56px rgba(134,184,23,0.2); }

        .pkg-card-img-wrap { position: relative; height: 220px; overflow: hidden; }
        .pkg-card-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .pkg-card:hover .pkg-card-img-wrap img { transform: scale(1.1); }
        .pkg-card-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%);
        }
        .pkg-card-dest-badge {
          position: absolute; bottom: 14px; left: 14px;
          background: rgba(255,255,255,0.95); backdrop-filter: blur(8px);
          color: #14141F; font-weight: 700; font-size: 0.9rem;
          padding: 5px 14px; border-radius: 50px;
          display: flex; align-items: center; gap: 6px;
        }
        .pkg-card-dest-badge i { color: #86B817; }
        .pkg-card-price-badge {
          position: absolute; top: 16px; right: -4px;
          display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
          z-index: 2;
        }
        .pkg-ribbon {
          background: linear-gradient(135deg, #ff4d4d, #c0392b);
          color: #fff; font-weight: 900; font-size: 0.82rem;
          padding: 7px 18px 7px 22px;
          clip-path: polygon(12% 0%, 100% 0%, 100% 100%, 12% 100%, 0% 50%);
          box-shadow: -2px 4px 14px rgba(192,57,43,0.5);
          letter-spacing: 0.8px;
          position: relative;
        }
        .pkg-ribbon::after {
          content: '';
          position: absolute;
          bottom: -6px; right: 0;
          border-left: 4px solid transparent;
          border-right: 0px solid transparent;
          border-top: 6px solid #8b1a0e;
        }
        .pkg-original-price {
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          color: rgba(255,255,255,0.8); font-size: 0.72rem; font-weight: 600;
          padding: 3px 10px 3px 8px;
          clip-path: polygon(8% 0%, 100% 0%, 100% 100%, 8% 100%, 0% 50%);
          text-decoration: line-through;
          text-decoration-color: #ff6b6b;
        }

        .pkg-card-body { padding: 20px 22px 24px; }
        .pkg-card-meta { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
        .pkg-meta-chip {
          display: inline-flex; align-items: center; gap: 5px;
          background: #f5fce8; color: #5a8a00;
          font-size: 0.78rem; font-weight: 600;
          padding: 4px 12px; border-radius: 50px;
          border: 1px solid #d4edaa;
        }
        .pkg-card-desc { color: #6c757d; font-size: 0.88rem; line-height: 1.6; margin-bottom: 18px; }
        .pkg-stars { color: #FE8800; font-size: 0.8rem; margin-bottom: 16px; letter-spacing: 2px; }
        .pkg-price-row {
          display: flex; align-items: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap;
        }
        .pkg-price-final {
          font-size: 1.3rem; font-weight: 900; color: #86B817;
        }
        .pkg-price-original {
          font-size: 0.88rem; color: #aaa; text-decoration: line-through;
          text-decoration-color: #ff4d4d;
        }
        .pkg-price-save {
          background: #fff3f3; color: #c0392b;
          font-size: 0.72rem; font-weight: 800;
          padding: 3px 10px; border-radius: 50px;
          border: 1px solid #ffd0d0;
        }

        .pkg-book-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #86B817, #5a8a00);
          color: #fff; font-weight: 700; font-size: 0.85rem;
          padding: 10px 24px; border-radius: 50px; text-decoration: none;
          box-shadow: 0 4px 16px rgba(134,184,23,0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .pkg-book-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(134,184,23,0.45); color: #fff; }

        /* Lightbox */
        .pkg-lightbox {
          position: fixed; inset: 0; z-index: 99999;
          background: rgba(0,0,0,0.92);
          display: flex; align-items: center; justify-content: center;
          cursor: zoom-out;
          animation: lbFadeIn 0.2s ease;
        }
        @keyframes lbFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .pkg-lightbox img {
          max-width: 90vw; max-height: 88vh;
          border-radius: 16px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6);
          animation: lbZoomIn 0.3s cubic-bezier(0.22,1,0.36,1);
          cursor: default;
        }
        @keyframes lbZoomIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        .pkg-lightbox-close {
          position: absolute; top: 20px; right: 24px;
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,255,255,0.15); border: none;
          color: #fff; font-size: 1.2rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .pkg-lightbox-close:hover { background: rgba(255,255,255,0.3); }
      `}</style>

      <div className="pkg-section" id="pack">
        <div className="container">
          <div className="text-center mb-2">
            <div className="pkg-header-badge">
              <i className="fa fa-suitcase"></i> Travel Packages
            </div>
            <h2 className="pkg-title">Explore Our <span>Awesome Packages</span></h2>
            <p className="pkg-subtitle">Handpicked destinations with the best deals, curated just for you.</p>
          </div>

          <div className="row g-4 mt-2 justify-content-center">
            {packages.map((pkg, i) => {
              const disc = getDiscount(pkg._id || pkg.dest)
              const original = calcOriginal(pkg.price, disc)
              const finalPrice = parseFloat(pkg.price.replace(/,/g, ''))
              return (
              <div key={pkg._id || i} className="col-lg-4 col-md-6">
                <div className="pkg-card" id={`pkg-${pkg.dest.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div
                    className="pkg-card-img-wrap"
                    style={{ cursor: 'zoom-in' }}
                    onClick={() => setLightbox(pkg.img.startsWith('data:') ? pkg.img : `/img/${pkg.img}`)}
                  >
                    <img src={pkg.img.startsWith('data:') ? pkg.img : `/img/${pkg.img}`} alt={pkg.dest} />
                    <div className="pkg-card-img-overlay" />
                    <div className="pkg-card-dest-badge">
                      <i className="fa fa-map-marker-alt"></i>{pkg.dest}
                    </div>
                    <div className="pkg-card-price-badge">
                      <span className="pkg-ribbon">🔥 {disc}% OFF</span>
                      {original && <span className="pkg-original-price">₹{formatINR(original)}</span>}
                    </div>
                  </div>
                  <div className="pkg-card-body">
                    <div className="pkg-card-meta">
                      <span className="pkg-meta-chip"><i className="fa fa-calendar-alt"></i>{pkg.nights}</span>
                      <span className="pkg-meta-chip"><i className="fa fa-user"></i>{pkg.persons}</span>
                    </div>
                    <div className="pkg-stars">★★★★★</div>
                    <p className="pkg-card-desc">{pkg.desc}</p>
                    <div className="pkg-price-row">
                      <span className="pkg-price-final">₹{formatINR(finalPrice)}</span>
                      {original && <span className="pkg-price-original">₹{formatINR(original)}</span>}
                      {original && <span className="pkg-price-save">Save ₹{formatINR(original - finalPrice)}</span>}
                    </div>
                    <a href={`/packages/${toSlug(pkg.dest)}`} className="pkg-book-btn" style={{ marginRight: 8 }}>
                      <i className="fa fa-info-circle"></i> View Details
                    </a>
                    <a href="https://wa.me/919839685724" target="_blank" rel="noreferrer" className="pkg-book-btn" style={{ background: '#25D366', boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}>
                      <i className="fab fa-whatsapp"></i> Book Now
                    </a>
                  </div>
                </div>
              </div>
              )
            })}
          </div>
        </div>
      </div>

      {lightbox && (
        <div className="pkg-lightbox" onClick={() => setLightbox(null)}>
          <button className="pkg-lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox} alt="enlarged" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}
