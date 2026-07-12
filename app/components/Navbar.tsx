'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Packages', href: '#pack' },
  { label: 'Destinations', href: '#destination' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style>{`
        .nav-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: background 0.35s ease, box-shadow 0.35s ease, padding 0.35s ease;
          padding: 18px 0;
        }
        .nav-root.scrolled {
          background: rgba(10,15,30,0.96);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 4px 32px rgba(0,0,0,0.35);
          padding: 10px 0;
        }
        .nav-root:not(.scrolled) {
          background: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent);
        }

        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        /* Logo */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .nav-logo-text {
          font-size: 1.6rem;
          font-weight: 800;
          background: linear-gradient(90deg, #a259c6 0%, #ff4d4d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 1px;
        }

        /* Links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0; padding: 0;
        }
        .nav-links a {
          color: rgba(255,255,255,0.85);
          font-size: 0.9rem;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 8px;
          text-decoration: none;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .nav-links a:hover {
          color: #86B817;
          background: rgba(134,184,23,0.1);
        }

        /* Right actions */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .nav-phone {
          display: flex;
          align-items: center;
          gap: 7px;
          color: rgba(255,255,255,0.8);
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 8px;
          transition: color 0.2s;
        }
        .nav-phone:hover { color: #86B817; }
        .nav-phone i { color: #86B817; }
        .nav-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #86B817, #5a8a00);
          color: #fff;
          font-size: 0.88rem;
          font-weight: 700;
          padding: 10px 22px;
          border-radius: 50px;
          text-decoration: none;
          box-shadow: 0 4px 18px rgba(134,184,23,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(134,184,23,0.5); color: #fff; }
        .nav-admin {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.07);
          border: 1.5px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.8);
          font-size: 0.82rem;
          font-weight: 700;
          padding: 9px 18px;
          border-radius: 50px;
          text-decoration: none;
          backdrop-filter: blur(8px);
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
          white-space: nowrap;
          letter-spacing: 0.3px;
        }
        .nav-admin:hover {
          background: rgba(162,89,198,0.18);
          border-color: #a259c6;
          color: #c97ef5;
          transform: translateY(-2px);
        }
        .nav-admin i { font-size: 0.78rem; }

        /* Hamburger */
        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 6px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
        }
        .nav-hamburger span {
          display: block;
          width: 22px; height: 2px;
          background: #fff;
          border-radius: 2px;
          transition: transform 0.3s, opacity 0.3s;
        }
        .nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; }
        .nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile menu */
        .nav-mobile {
          display: none;
          flex-direction: column;
          gap: 4px;
          padding: 16px 24px 20px;
          background: rgba(10,15,30,0.97);
          backdrop-filter: blur(16px);
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .nav-mobile.open { display: flex; }
        .nav-mobile a {
          color: rgba(255,255,255,0.85);
          font-size: 0.95rem;
          font-weight: 600;
          padding: 10px 12px;
          border-radius: 8px;
          text-decoration: none;
          transition: color 0.2s, background 0.2s;
        }
        .nav-mobile a:hover { color: #86B817; background: rgba(134,184,23,0.08); }
        .nav-mobile-cta {
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #86B817, #5a8a00) !important;
          color: #fff !important;
          border-radius: 50px !important;
          padding: 12px !important;
          font-weight: 700 !important;
        }
        .nav-mobile-admin {
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1.5px solid rgba(162,89,198,0.4) !important;
          color: #c97ef5 !important;
          border-radius: 50px !important;
          padding: 11px !important;
          font-weight: 700 !important;
          background: rgba(162,89,198,0.08) !important;
        }

        @media (max-width: 991px) {
          .nav-links, .nav-phone { display: none; }
          .nav-hamburger { display: flex; }
        }
        @media (max-width: 480px) {
          .nav-inner { padding: 0 20px; }
          .nav-cta { display: none; }
        }
      `}</style>

      <header className={`nav-root${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          {/* Logo */}
          <Link href="/" className="nav-logo">
            <Image src="/img/Logos.png" alt="Akash Holidays" width={44} height={44} />
            <span className="nav-logo-text">Akash Holidays</span>
          </Link>

          {/* Desktop links */}
          <ul className="nav-links">
            {navLinks.map(l => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="nav-actions">
            <a href="tel:+917905146329" className="nav-phone">
              <i className="fa fa-phone-alt"></i> +91 79051 46329
            </a>
            <Link href="/admin" className="nav-admin">
              <i className="fa fa-lock"></i> Admin
            </Link>
            <a href="https://wa.me/919839685724" target="_blank" rel="noreferrer" className="nav-cta">
              <i className="fab fa-whatsapp"></i> Book Now
            </a>
            {/* Hamburger */}
            <div
              className={`nav-hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(o => !o)}
            >
              <span /><span /><span />
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`nav-mobile${menuOpen ? ' open' : ''}`}>
          {navLinks.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
          <a href="https://wa.me/919839685724" target="_blank" rel="noreferrer" className="nav-mobile-cta" onClick={() => setMenuOpen(false)}>
            <i className="fab fa-whatsapp"></i> Book on WhatsApp
          </a>
          <Link href="/admin" className="nav-mobile-admin" onClick={() => setMenuOpen(false)}>
            <i className="fa fa-lock"></i> Admin Panel
          </Link>
        </div>
      </header>
    </>
  )
}
