'use client'
import { useEffect, useState } from 'react'

const animDests = ['Kashmir', 'Thailand', 'Maldives', 'Turkey', 'Ladakh', 'Bali']

type Package = { _id: string; dest: string; [key: string]: unknown }

export default function Hero({ packages = [] }: { packages?: Package[] }) {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)
  const [selectedDest, setSelectedDest] = useState('')

  const destOptions = Array.from(new Set(packages.map(p => p.dest).filter(Boolean)))

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDest) {
      document.getElementById('pack')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    const slug = selectedDest.toLowerCase().replace(/\s+/g, '-')
    const el = document.getElementById(`pkg-${slug}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.style.outline = '3px solid #86B817'
      el.style.borderRadius = '20px'
      setTimeout(() => { el.style.outline = ''; el.style.borderRadius = '' }, 2000)
    } else {
      document.getElementById('pack')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent(c => (c + 1) % animDests.length)
        setVisible(true)
      }, 400)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <style>{`
        .hero-pro {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          background: #0a0f1e;
        }

        /* Video background */
        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        /* Dark overlay on top of video */
        .hero-pro-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(10,15,30,0.55) 0%, rgba(10,15,30,0.25) 50%, rgba(10,15,30,0.45) 100%);
          z-index: 1;
        }

        /* Animated color orbs */
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          z-index: 2;
          animation: orbFloat 12s ease-in-out infinite alternate;
        }
        .hero-orb-1 { width: 500px; height: 500px; background: #86B817; top: -100px; left: -100px; animation-duration: 14s; }
        .hero-orb-2 { width: 400px; height: 400px; background: #FE8800; bottom: -80px; right: -80px; animation-duration: 10s; animation-delay: -4s; }
        .hero-orb-3 { width: 300px; height: 300px; background: #00bfff; top: 40%; left: 55%; animation-duration: 16s; animation-delay: -7s; }
        @keyframes orbFloat {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, 20px) scale(1.1); }
        }

        .hero-pro-content {
          position: relative;
          z-index: 5;
          padding: 120px 0 80px;
        }

        /* Badge */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(134,184,23,0.15);
          border: 1px solid rgba(134,184,23,0.4);
          color: #a8d832;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 7px 20px;
          border-radius: 50px;
          margin-bottom: 28px;
          backdrop-filter: blur(8px);
          animation: fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both;
        }
        .hero-badge-dot {
          width: 7px; height: 7px;
          background: #86B817;
          border-radius: 50%;
          animation: blink 1.5s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .hero-heading {
          font-size: clamp(2.4rem, 5.5vw, 4.2rem);
          font-weight: 900;
          color: #ffffff;
          line-height: 1.1;
          margin-bottom: 10px;
          animation: fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.35s both;
        }
        .hero-gradient-text {
          background: linear-gradient(135deg, #86B817 0%, #c8f040 50%, #FE8800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-dest-word {
          display: inline-block;
          color: #FE8800;
          transition: opacity 0.4s ease, transform 0.4s ease;
          font-style: italic;
        }
        .hero-dest-word.visible { opacity: 1; transform: translateY(0); }
        .hero-dest-word.hidden  { opacity: 0; transform: translateY(-12px); }

        .hero-subtitle {
          color: rgba(255,255,255,0.75);
          font-size: 1.1rem;
          line-height: 1.7;
          max-width: 520px;
          margin-bottom: 40px;
          animation: fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.55s both;
        }

        .hero-ctas {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 56px;
          animation: fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.65s both;
        }
        .hero-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, #86B817, #5a8a00);
          color: #fff; font-weight: 700; font-size: 1rem;
          padding: 15px 36px; border-radius: 50px; text-decoration: none;
          box-shadow: 0 8px 32px rgba(134,184,23,0.45);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: none; cursor: pointer;
        }
        .hero-btn-primary:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(134,184,23,0.55); color: #fff; }
        .hero-btn-secondary {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.08);
          border: 1.5px solid rgba(255,255,255,0.25);
          color: #fff; font-weight: 700; font-size: 1rem;
          padding: 15px 36px; border-radius: 50px; text-decoration: none;
          backdrop-filter: blur(8px);
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }
        .hero-btn-secondary:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.5); transform: translateY(-4px); color: #fff; }

        .hero-stats {
          display: flex;
          gap: 40px;
          flex-wrap: wrap;
          animation: fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.75s both;
        }
        .hero-stat-divider { width: 1px; background: rgba(255,255,255,0.15); align-self: stretch; }
        .hero-stat-num {
          font-size: 1.9rem; font-weight: 900; line-height: 1;
          background: linear-gradient(135deg, #86B817, #c8f040);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .hero-stat-label { color: rgba(255,255,255,0.55); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

        .hero-card-panel {
          animation: fadeSlideLeft 0.9s cubic-bezier(0.22,1,0.36,1) 0.5s both;
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: none; }
        }

        .hero-search-card {
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 24px;
          padding: 32px 28px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
        }
        .hero-search-title { color: #fff; font-weight: 800; font-size: 1.2rem; margin-bottom: 6px; }
        .hero-search-sub { color: rgba(255,255,255,0.65); font-size: 0.85rem; margin-bottom: 24px; }

        .hero-input-group { margin-bottom: 16px; }
        .hero-input-label {
          color: rgba(255,255,255,0.75); font-size: 0.75rem;
          font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
          margin-bottom: 7px; display: flex; align-items: center; gap: 7px;
        }
        .hero-input-label i { color: #86B817; }
        .hero-input {
          width: 100%; padding: 12px 16px;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.25);
          border-radius: 12px; color: #fff; font-size: 0.95rem;
          outline: none; transition: border-color 0.2s, background 0.2s;
        }
        .hero-input::placeholder { color: rgba(255,255,255,0.4); }
        .hero-input:focus { border-color: #86B817; background: rgba(255,255,255,0.22); }
        .hero-input option { background: #1a2035; color: #fff; }

        .hero-search-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #86B817, #5a8a00);
          color: #fff; font-weight: 800; font-size: 1rem;
          border: none; border-radius: 12px; cursor: pointer;
          box-shadow: 0 6px 24px rgba(134,184,23,0.4);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          margin-top: 8px;
        }
        .hero-search-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(134,184,23,0.55); }

        .hero-trust { display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap; }
        .hero-trust-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50px; padding: 5px 12px;
          color: rgba(255,255,255,0.75); font-size: 0.75rem; font-weight: 600;
        }
        .hero-trust-badge i { color: #86B817; font-size: 0.7rem; }

        .hero-float-card {
          position: absolute;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          padding: 12px 16px;
          display: flex; align-items: center; gap: 10px;
          z-index: 6;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        .hero-float-card-1 { top: 18%; right: 2%; animation: floatCard1 6s ease-in-out infinite; }
        .hero-float-card-2 { bottom: 28%; left: 2%; animation: floatCard2 7s ease-in-out infinite; }
        @keyframes floatCard1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes floatCard2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        .hero-float-icon {
          width: 40px; height: 40px; border-radius: 12px;
          background: linear-gradient(135deg, #86B817, #5a8a00);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 1rem;
        }
        .hero-float-label { color: rgba(255,255,255,0.6); font-size: 0.7rem; font-weight: 600; }
        .hero-float-value { color: #fff; font-size: 0.9rem; font-weight: 800; }

        .hero-scroll {
          position: absolute; bottom: 32px; left: 50%;
          transform: translateX(-50%);
          z-index: 6; display: flex; flex-direction: column; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.4); font-size: 0.7rem; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase;
          animation: fadeSlideUp 1s ease 1.2s both;
        }
        .hero-scroll-line {
          width: 1px; height: 48px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent);
          animation: scrollLine 2s ease-in-out infinite;
        }
        @keyframes scrollLine {
          0%, 100% { transform: scaleY(1); opacity: 0.4; }
          50% { transform: scaleY(0.5); opacity: 0.8; }
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: none; }
        }

        @media (max-width: 991px) {
          .hero-pro-content { padding: 100px 0 60px; text-align: center; }
          .hero-subtitle { margin: 0 auto 32px; }
          .hero-ctas { justify-content: center; }
          .hero-stats { justify-content: center; }
          .hero-card-panel { margin-top: 48px; }
          .hero-float-card { display: none; }
          .hero-scroll { display: none; }
        }
        @media (max-width: 576px) {
          .hero-btn-primary, .hero-btn-secondary { padding: 13px 24px; font-size: 0.9rem; }
          .hero-stats { gap: 24px; }
          .hero-stat-num { font-size: 1.5rem; }
        }
      `}</style>

      <div className="hero-pro">
        {/* Background image */}
        <img src="/img/Gemini_Generated_Image_q56vtgq56vtgq56v.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />

        {/* Overlay + orbs */}
        <div className="hero-pro-overlay" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        {/* Floating info cards */}
        <div className="hero-float-card hero-float-card-1">
          <div className="hero-float-icon"><i className="fa fa-star"></i></div>
          <div>
            <div className="hero-float-label">Customer Rating</div>
            <div className="hero-float-value">4.9 / 5.0 ⭐</div>
          </div>
        </div>
<div className="container hero-pro-content">
          <div className="row align-items-center">
            {/* Left content */}
            <div className="col-lg-6">
              <div className="hero-badge">
                <span className="hero-badge-dot"></span>
                #1 Travel Agency in Lucknow
              </div>

              <h1 className="hero-heading">
                Discover the World,<br />
                <span className="hero-gradient-text">One Journey</span> at a Time
              </h1>

              <h2 style={{ fontSize: 'clamp(1.3rem, 2.8vw, 1.9rem)', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 24, animation: 'fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.45s both' }}>
                Your dream trip to{' '}
                <span className={`hero-dest-word ${visible ? 'visible' : 'hidden'}`}>
                  {animDests[current]}
                </span>{' '}awaits you
              </h2>

              <p className="hero-subtitle">
                From the snow-capped peaks of Kashmir to the golden beaches of Thailand — Akash Holidays crafts unforgettable experiences tailored just for you.
              </p>

              <div className="hero-ctas">
                <a href="#pack" className="hero-btn-primary">
                  <i className="fa fa-compass"></i> Explore Packages
                </a>
                <a href="https://wa.me/919839685724" target="_blank" rel="noreferrer" className="hero-btn-secondary">
                  <i className="fab fa-whatsapp"></i> Chat With Us
                </a>
              </div>

              <div className="hero-stats">
                <div>
                  <div className="hero-stat-num">10K+</div>
                  <div className="hero-stat-label">Happy Travelers</div>
                </div>
                <div className="hero-stat-divider" />
                <div>
                  <div className="hero-stat-num">50+</div>
                  <div className="hero-stat-label">Destinations</div>
                </div>
                <div className="hero-stat-divider" />
                <div>
                  <div className="hero-stat-num">15+</div>
                  <div className="hero-stat-label">Years Experience</div>
                </div>
                <div className="hero-stat-divider" />
                <div>
                  <div className="hero-stat-num">4.9★</div>
                  <div className="hero-stat-label">Avg Rating</div>
                </div>
              </div>
            </div>

            {/* Right search card */}
            <div className="col-lg-5 offset-lg-1 hero-card-panel">
              <form className="hero-search-card" onSubmit={handleSearch}>
                <div className="hero-search-title">Plan Your Trip</div>
                <div className="hero-search-sub">Fill in the details and we'll get back to you</div>

                <div className="hero-input-group">
                  <div className="hero-input-label"><i className="fa fa-map-marker-alt"></i> Destination</div>
                  <select className="hero-input" value={selectedDest} onChange={e => setSelectedDest(e.target.value)}>
                    <option value="">Select destination</option>
                    {destOptions.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <div className="hero-input-group">
                      <div className="hero-input-label"><i className="fa fa-calendar-alt"></i> Check In</div>
                      <input type="date" className="hero-input" />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="hero-input-group">
                      <div className="hero-input-label"><i className="fa fa-calendar-alt"></i> Check Out</div>
                      <input type="date" className="hero-input" />
                    </div>
                  </div>
                </div>

                <div className="hero-input-group">
                  <div className="hero-input-label"><i className="fa fa-users"></i> Travelers</div>
                  <select className="hero-input">
                    {['1 Person', '2 Persons', '3 Persons', '4 Persons', '5+ Persons'].map(p => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="hero-search-btn">
                  <i className="fa fa-search"></i> Search Packages
                </button>

                <div className="hero-trust">
                  <span className="hero-trust-badge"><i className="fa fa-check-circle"></i> Free Cancellation</span>
                  <span className="hero-trust-badge"><i className="fa fa-check-circle"></i> Best Price</span>
                  <span className="hero-trust-badge"><i className="fa fa-check-circle"></i> 24/7 Support</span>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          <span>Scroll</span>
        </div>
      </div>
    </>
  )
}
