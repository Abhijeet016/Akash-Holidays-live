'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

type Package = {
  _id: string
  img: string
  dest: string
  nights: string
  persons: string
  discount: string
  desc: string
}

function toSlug(dest: string) {
  return dest.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function imgSrc(img: string) {
  if (!img) return '/img/package-1.jpg'
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) return img
  return `/img/${img}`
}

const PAGE_SIZE = 6

export default function PackagesSection({ initial }: { initial: Package[] }) {
  const [packages] = useState<Package[]>(initial)
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const shown = packages.slice(0, visible)
  const hasMore = visible < packages.length

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    setLoading(true)
    setTimeout(() => {
      setVisible(v => Math.min(v + PAGE_SIZE, packages.length))
      setLoading(false)
    }, 400)
  }, [loading, hasMore, packages.length])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() },
      { rootMargin: '200px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <style>{`
        /* ── Section ── */
        .pkg-section {
          background: linear-gradient(180deg, #f0f7e6 0%, #ffffff 100%);
          padding: 90px 0 100px;
        }

        .pkg-header-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #86B817 0%, #5a8a00 100%);
          color: #fff; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 2.5px; text-transform: uppercase;
          padding: 7px 22px; border-radius: 50px;
          box-shadow: 0 4px 18px rgba(134,184,23,0.4);
          margin-bottom: 18px;
        }
        .pkg-title { font-size: 2.7rem; font-weight: 900; color: #14141F; line-height: 1.15; }
        .pkg-title span { color: #86B817; }
        .pkg-subtitle { color: #6c757d; font-size: 1rem; max-width: 500px; margin: 12px auto 44px; }

        /* ── Card ── */
        .pkg-card {
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.05);
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .pkg-card:hover {
          transform: translateY(-14px);
          box-shadow: 0 28px 64px rgba(134,184,23,0.18), 0 8px 24px rgba(0,0,0,0.08);
        }

        /* ── Image ── */
        .pkg-card-img-wrap {
          position: relative; height: 240px; overflow: hidden; cursor: zoom-in; flex-shrink: 0;
        }
        .pkg-card-img-wrap img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.22,1,0.36,1);
          display: block;
        }
        .pkg-card:hover .pkg-card-img-wrap img { transform: scale(1.08); }

        /* gradient overlay */
        .pkg-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.1) 50%, transparent 100%);
        }

        /* destination pill — bottom left */
        .pkg-dest-pill {
          position: absolute; bottom: 14px; left: 14px;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(10px);
          color: #14141F; font-weight: 800; font-size: 0.88rem;
          padding: 6px 14px; border-radius: 50px;
          display: flex; align-items: center; gap: 6px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.15);
        }
        .pkg-dest-pill i { color: #86B817; font-size: 0.8rem; }

        /* ── Discount ribbon — luxury folded corner tag ── */
        .pkg-ribbon-wrap {
          position: absolute; top: 0; left: 0;
          width: 108px; height: 108px;
          z-index: 4; pointer-events: none; overflow: hidden;
          border-radius: 24px 0 0 0;
        }
        .pkg-ribbon {
          position: absolute;
          top: 22px; left: -30px;
          width: 148px;
          padding: 9px 0 8px;
          text-align: center;
          transform: rotate(-45deg);
          background: linear-gradient(135deg, #BF953F 0%, #FCF6BA 40%, #B38728 60%, #FBF5B7 80%, #AA771C 100%);
          box-shadow:
            0 3px 10px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.6),
            inset 0 -1px 0 rgba(0,0,0,0.15);
          border-top: 1px solid rgba(255,255,255,0.5);
          border-bottom: 1px solid rgba(0,0,0,0.2);
        }
        .pkg-ribbon-label {
          display: block;
          font-size: 0.6rem; font-weight: 900;
          letter-spacing: 1.8px; text-transform: uppercase;
          color: #3d2600;
          text-shadow: 0 1px 0 rgba(255,255,255,0.5);
          line-height: 1;
          margin-bottom: 2px;
        }
        .pkg-ribbon-value {
          display: block;
          font-size: 0.82rem; font-weight: 900;
          color: #1a0f00;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 0 rgba(255,255,255,0.4);
          line-height: 1;
        }
        @keyframes ribbonSheen {
          0%   { opacity: 0; left: -60%; }
          50%  { opacity: 0.55; }
          100% { opacity: 0; left: 130%; }
        }
        .pkg-ribbon::after {
          content: '';
          position: absolute; top: 0; left: -60%;
          width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent);
          animation: ribbonSheen 3.2s ease-in-out infinite;
          transform: skewX(-20deg);
        }

        /* duration pill — top right */
        .pkg-duration-pill {
          position: absolute; top: 12px; right: 12px;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(8px);
          color: #fff; font-size: 0.75rem; font-weight: 700;
          padding: 5px 12px; border-radius: 50px;
          display: flex; align-items: center; gap: 5px;
          z-index: 3;
        }

        /* ── Body ── */
        .pkg-card-body {
          padding: 22px 22px 24px;
          display: flex; flex-direction: column; flex: 1;
        }

        /* rating row */
        .pkg-rating-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 10px;
        }
        .pkg-stars { display: flex; gap: 2px; }
        .pkg-star { color: #FE8800; font-size: 0.85rem; }
        .pkg-rating-text { color: #888; font-size: 0.78rem; font-weight: 600; margin-left: 6px; }
        .pkg-persons-chip {
          display: inline-flex; align-items: center; gap: 5px;
          background: #f5fce8; color: #5a8a00;
          font-size: 0.75rem; font-weight: 700;
          padding: 4px 12px; border-radius: 50px;
          border: 1px solid #d4edaa;
        }

        /* title */
        .pkg-card-title {
          font-size: 1.1rem; font-weight: 800; color: #14141F;
          margin-bottom: 8px; line-height: 1.3;
        }

        /* desc */
        .pkg-card-desc {
          color: #6c757d; font-size: 0.85rem; line-height: 1.65;
          margin-bottom: 18px; flex: 1;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }

        /* divider */
        .pkg-card-divider { height: 1px; background: #f0f0f0; margin-bottom: 18px; }

        /* buttons row */
        .pkg-btn-row { display: flex; gap: 8px; flex-wrap: wrap; }

        .pkg-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          font-weight: 700; font-size: 0.82rem;
          padding: 10px 18px; border-radius: 50px; text-decoration: none;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
          white-space: nowrap; flex: 1;
        }
        .pkg-btn:hover { transform: translateY(-2px); }

        .pkg-btn-explore {
          background: linear-gradient(135deg, #86B817, #5a8a00);
          color: #fff;
          box-shadow: 0 4px 14px rgba(134,184,23,0.35);
        }
        .pkg-btn-explore:hover { box-shadow: 0 8px 22px rgba(134,184,23,0.5); color: #fff; }

        .pkg-btn-book {
          background: linear-gradient(135deg, #14141F, #2d2d3a);
          color: #fff;
          box-shadow: 0 4px 14px rgba(0,0,0,0.2);
        }
        .pkg-btn-book:hover { box-shadow: 0 8px 22px rgba(0,0,0,0.3); color: #fff; }

        .pkg-btn-wa {
          background: linear-gradient(135deg, #25D366, #128C7E);
          color: #fff;
          box-shadow: 0 4px 14px rgba(37,211,102,0.35);
          flex: 0 0 auto; padding: 10px 14px;
        }
        .pkg-btn-wa:hover { box-shadow: 0 8px 22px rgba(37,211,102,0.5); color: #fff; }

        /* ── Infinite scroll sentinel ── */
        .pkg-sentinel { height: 1px; }
        .pkg-loader {
          text-align: center; padding: 40px 0 10px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          color: #86B817; font-weight: 700; font-size: 0.9rem;
        }
        .pkg-spinner {
          width: 22px; height: 22px; border-radius: 50%;
          border: 3px solid #d4edaa;
          border-top-color: #86B817;
          animation: pkgSpin 0.7s linear infinite;
        }
        @keyframes pkgSpin { to { transform: rotate(360deg); } }
        .pkg-all-loaded {
          text-align: center; padding: 36px 0 0;
          color: #86B817; font-weight: 700; font-size: 0.9rem;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        @keyframes pkgFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pkg-card-animate { animation: pkgFadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }

        /* ── Lightbox ── */
        .pkg-lightbox {
          position: fixed; inset: 0; z-index: 99999;
          background: rgba(0,0,0,0.93);
          display: flex; align-items: center; justify-content: center;
          cursor: zoom-out; animation: lbIn 0.2s ease;
        }
        @keyframes lbIn { from { opacity: 0; } to { opacity: 1; } }
        .pkg-lightbox img {
          max-width: 90vw; max-height: 88vh; border-radius: 16px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6);
          animation: lbZoom 0.3s cubic-bezier(0.22,1,0.36,1); cursor: default;
        }
        @keyframes lbZoom { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
        .pkg-lightbox-close {
          position: absolute; top: 20px; right: 24px;
          width: 42px; height: 42px; border-radius: 50%;
          background: rgba(255,255,255,0.15); border: none;
          color: #fff; font-size: 1.2rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .pkg-lightbox-close:hover { background: rgba(255,255,255,0.3); }

        @media (max-width: 576px) {
          .pkg-title { font-size: 2rem; }
          .pkg-card-img-wrap { height: 210px; }
          .pkg-btn { font-size: 0.78rem; padding: 9px 14px; }
        }
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

          <div className="row g-4 mt-2">
            {shown.map((pkg, i) => (
              <div
                key={pkg._id || i}
                className="col-lg-4 col-md-6 pkg-card-animate"
                style={{ animationDelay: `${(i % PAGE_SIZE) * 60}ms` }}
              >
                <div className="pkg-card" id={`pkg-${pkg.dest.toLowerCase().replace(/\s+/g, '-')}`}>

                  {/* Image */}
                  <div className="pkg-card-img-wrap" onClick={() => setLightbox(imgSrc(pkg.img))}>
                    <img src={imgSrc(pkg.img)} alt={`${pkg.dest} tour package`} loading="lazy" />
                    <div className="pkg-img-overlay" />

                    {/* Discount — luxury gold ribbon, top-left corner */}
                    <div className="pkg-ribbon-wrap">
                      <div className="pkg-ribbon">
                        <span className="pkg-ribbon-label">Save</span>
                        <span className="pkg-ribbon-value">{pkg.discount || 'Deal'}</span>
                      </div>
                    </div>

                    {/* Duration — top right */}
                    {pkg.nights && (
                      <div className="pkg-duration-pill">
                        <i className="fa fa-clock"></i> {pkg.nights}
                      </div>
                    )}

                    {/* Destination — bottom left */}
                    <div className="pkg-dest-pill">
                      <i className="fa fa-map-marker-alt"></i> {pkg.dest}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="pkg-card-body">

                    {/* Rating + persons */}
                    <div className="pkg-rating-row">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="pkg-stars">
                          {[1,2,3,4,5].map(s => <span key={s} className="pkg-star">★</span>)}
                        </div>
                        <span className="pkg-rating-text">4.9 (120+)</span>
                      </div>
                      <span className="pkg-persons-chip">
                        <i className="fa fa-user"></i> {pkg.persons}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="pkg-card-title">{pkg.dest} Tour Package</div>

                    {/* Description */}
                    <p className="pkg-card-desc">{pkg.desc}</p>

                    <div className="pkg-card-divider" />

                    {/* Buttons */}
                    <div className="pkg-btn-row">
                      <a href={`/packages/${toSlug(pkg.dest)}`} className="pkg-btn pkg-btn-explore">
                        <i className="fa fa-compass"></i> Explore
                      </a>
                      <a href={`/packages/${toSlug(pkg.dest)}`} className="pkg-btn pkg-btn-book">
                        <i className="fa fa-ticket-alt"></i> Book Now
                      </a>
                      <a
                        href={`https://wa.me/919839685724?text=Hi! I'm interested in the ${pkg.dest} tour package (${pkg.nights}). Please share details.`}
                        target="_blank" rel="noreferrer"
                        className="pkg-btn pkg-btn-wa"
                        title="Chat on WhatsApp"
                      >
                        <i className="fab fa-whatsapp" style={{ fontSize: '1rem' }}></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {loading && (
            <div className="pkg-loader">
              <div className="pkg-spinner" />
              Loading more packages…
            </div>
          )}

          {!hasMore && (
            <p className="pkg-all-loaded">
              <i className="fa fa-check-circle" />
              You&apos;ve explored all {packages.length} packages!
            </p>
          )}

          {/* invisible sentinel — triggers next batch when scrolled into view */}
          <div ref={sentinelRef} className="pkg-sentinel" />
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
