'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Swal from 'sweetalert2'

const API = 'http://localhost:5001'
const empty = { img: '', dest: '', nights: '', persons: '', price: '', desc: '' }

type Package = { _id: string; img: string; dest: string; nights: string; persons: string; price: string; desc: string }

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const [packages, setPackages] = useState<Package[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Persist token in sessionStorage
  useEffect(() => {
    const t = sessionStorage.getItem('admin_token')
    if (t) setToken(t)
  }, [])

  useEffect(() => {
    if (!token) return
    fetch(`${API}/api/packages`)
      .then(r => r.json())
      .then(setPackages)
      .catch(() => {})
  }, [token])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      sessionStorage.setItem('admin_token', data.token)
      setToken(data.token)
      Swal.fire({ icon: 'success', title: 'Welcome back!', text: 'Logged in successfully', timer: 1800, showConfirmButton: false, toast: true, position: 'top-end' })
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token')
    setToken(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
      setForm(f => ({ ...f, img: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const closeModal = () => { setShowModal(false); setForm(empty); setPreview(null); setStatus('idle') }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch(`${API}/api/packages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `HTTP ${res.status}`)
      }
      const newPkg = await res.json()
      setPackages(prev => [...prev, newPkg])
      closeModal()
      Swal.fire({ icon: 'success', title: 'Package Added!', text: `${newPkg.dest} package has been added successfully.`, timer: 2500, showConfirmButton: false, toast: true, position: 'top-end' })
    } catch (err: unknown) {
      setStatus('error')
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      Swal.fire({ icon: 'error', title: 'Error', text: msg, toast: true, position: 'top-end', timer: 3000, showConfirmButton: false })
    }
  }

  const handleDelete = async (id: string) => {
    const pkg = packages.find(p => p._id === id)
    const confirm = await Swal.fire({
      title: 'Delete Package?',
      text: `Are you sure you want to delete "${pkg?.dest}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#86B817',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    })
    if (!confirm.isConfirmed) return
    setDeleteId(id)
    try {
      await fetch(`${API}/api/packages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setPackages(prev => prev.filter(p => p._id !== id))
      Swal.fire({ icon: 'success', title: 'Deleted!', text: `"${pkg?.dest}" has been removed.`, timer: 2000, showConfirmButton: false, toast: true, position: 'top-end' })
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete package. Try again.', timer: 2500, showConfirmButton: false, toast: true, position: 'top-end' })
    }
    setDeleteId(null)
  }

  // ── LOGIN SCREEN ──────────────────────────────────────────────
  if (!token) return (
    <>
      <style>{`
        .adm-login-wrap {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #0a0f1e 0%, #1a2540 100%);
          padding: 20px;
        }
        .adm-login-card {
          background: #fff; border-radius: 24px; padding: 48px 40px;
          width: 100%; max-width: 420px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.35);
        }
        .adm-login-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; justify-content: center; }
        .adm-login-logo-text {
          font-size: 1.3rem; font-weight: 900;
          background: linear-gradient(90deg, #a259c6, #ff4d4d);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .adm-login-title { font-size: 1.6rem; font-weight: 800; color: #14141f; margin-bottom: 6px; text-align: center; }
        .adm-login-sub { color: #888; font-size: 0.9rem; text-align: center; margin-bottom: 28px; }
        .adm-label { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #555; margin-bottom: 6px; display: block; }
        .adm-input {
          width: 100%; padding: 12px 16px; border-radius: 12px;
          border: 1.5px solid #e0e0e0; font-size: 0.95rem; color: #14141f;
          background: #fafafa; outline: none; margin-bottom: 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .adm-input:focus { border-color: #86B817; box-shadow: 0 0 0 3px rgba(134,184,23,0.15); background: #fff; }
        .adm-login-btn {
          width: 100%; padding: 13px; border-radius: 50px; border: none;
          background: linear-gradient(135deg, #86B817, #5a8a00);
          color: #fff; font-weight: 700; font-size: 1rem; cursor: pointer;
          box-shadow: 0 6px 20px rgba(134,184,23,0.4);
          transition: transform 0.2s, box-shadow 0.2s; margin-top: 4px;
        }
        .adm-login-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(134,184,23,0.5); }
        .adm-login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .adm-login-error { color: #dc3545; font-size: 0.85rem; text-align: center; margin-bottom: 12px; }
      `}</style>
      <div className="adm-login-wrap">
        <div className="adm-login-card">
          <div className="adm-login-logo">
            <Image src="/img/Logos.png" alt="logo" width={36} height={36} />
            <span className="adm-login-logo-text">Akash Holidays</span>
          </div>
          <div className="adm-login-title">Admin Login</div>
          <div className="adm-login-sub">Sign in to manage packages</div>
          <form onSubmit={handleLogin}>
            <label className="adm-label">Email</label>
            <input className="adm-input" type="email" placeholder="admin@email.com" value={loginForm.email}
              onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} required />
            <label className="adm-label">Password</label>
            <input className="adm-input" type="password" placeholder="••••••••" value={loginForm.password}
              onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} required />
            {loginError && <div className="adm-login-error">{loginError}</div>}
            <button className="adm-login-btn" type="submit" disabled={loginLoading}>
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </>
  )

  // ── ADMIN DASHBOARD ───────────────────────────────────────────
  return (
    <>
      <style>{`
        .adm-wrap { min-height: 100vh; background: #f4f6fa; }
        .adm-topbar {
          background: #fff; padding: 16px 32px;
          display: flex; align-items: center; justify-content: space-between;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07); position: sticky; top: 0; z-index: 100;
        }
        .adm-topbar-logo { display: flex; align-items: center; gap: 10px; }
        .adm-topbar-logo-text {
          font-size: 1.2rem; font-weight: 900;
          background: linear-gradient(90deg, #a259c6, #ff4d4d);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .adm-topbar-right { display: flex; align-items: center; gap: 16px; }
        .adm-badge {
          background: #f0fad8; color: #5a8a00; font-size: 0.78rem;
          font-weight: 700; padding: 5px 14px; border-radius: 50px;
          border: 1px solid #d4edaa;
        }
        .adm-logout-btn {
          padding: 8px 20px; border-radius: 50px; border: 1.5px solid #e0e0e0;
          background: #fff; color: #666; font-weight: 700; font-size: 0.85rem;
          cursor: pointer; transition: border-color 0.2s, color 0.2s;
        }
        .adm-logout-btn:hover { border-color: #dc3545; color: #dc3545; }

        .adm-content { padding: 40px 32px; max-width: 1200px; margin: 0 auto; }
        .adm-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
        .adm-page-title { font-size: 1.8rem; font-weight: 800; color: #14141f; }
        .adm-page-sub { color: #888; font-size: 0.9rem; margin-top: 4px; }

        .add-pkg-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, #86B817, #5a8a00);
          color: #fff; font-weight: 700; font-size: 0.95rem;
          padding: 13px 28px; border-radius: 50px; border: none; cursor: pointer;
          box-shadow: 0 6px 20px rgba(134,184,23,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .add-pkg-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(134,184,23,0.5); }

        .adm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
        .adm-pkg-card {
          background: #fff; border-radius: 20px; overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.07); border: 1px solid rgba(0,0,0,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .adm-pkg-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
        .adm-pkg-img { width: 100%; height: 200px; object-fit: cover; }
        .adm-pkg-body { padding: 18px 20px; }
        .adm-pkg-dest { font-size: 1.05rem; font-weight: 800; color: #14141f; margin-bottom: 6px; }
        .adm-pkg-meta { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
        .adm-pkg-chip {
          background: #f5fce8; color: #5a8a00; font-size: 0.75rem;
          font-weight: 600; padding: 3px 10px; border-radius: 50px;
          border: 1px solid #d4edaa;
        }
        .adm-pkg-price { font-size: 1rem; font-weight: 800; color: #86B817; margin-bottom: 14px; }
        .adm-delete-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 20px; border-radius: 50px; border: 1.5px solid #ffcccc;
          background: #fff5f5; color: #dc3545; font-weight: 700; font-size: 0.82rem;
          cursor: pointer; transition: background 0.2s, border-color 0.2s;
        }
        .adm-delete-btn:hover { background: #dc3545; color: #fff; border-color: #dc3545; }
        .adm-delete-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .adm-empty { text-align: center; padding: 80px 20px; color: #aaa; }
        .adm-empty i { font-size: 3rem; margin-bottom: 16px; display: block; }

        /* Modal — reuse same styles */
        .pkg-modal-backdrop {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(10,15,30,0.7); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px; overflow-y: auto;
          animation: backdropIn 0.25s ease;
        }
        @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
        .pkg-modal {
          background: #fff; border-radius: 24px; width: 100%; max-width: 680px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.25);
          animation: modalSlideUp 0.35s cubic-bezier(0.22,1,0.36,1); overflow: hidden;
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to   { opacity: 1; transform: none; }
        }
        .pkg-modal-header {
          background: linear-gradient(135deg, #86B817, #5a8a00);
          padding: 24px 28px; display: flex; align-items: center; justify-content: space-between;
        }
        .pkg-modal-header h5 { color: #fff; font-weight: 800; font-size: 1.2rem; margin: 0; }
        .pkg-modal-close {
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(255,255,255,0.2); border: none; cursor: pointer;
          color: #fff; font-size: 1.1rem; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .pkg-modal-close:hover { background: rgba(255,255,255,0.35); }
        .pkg-modal-body { padding: 28px; }
        .pkg-form-label { font-weight: 700; font-size: 0.82rem; color: #444; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; display: block; }
        .pkg-form-input {
          width: 100%; padding: 11px 16px; border-radius: 12px;
          border: 1.5px solid #e0e0e0; font-size: 0.95rem; color: #14141F;
          background: #fafafa; transition: border-color 0.2s, box-shadow 0.2s; outline: none;
        }
        .pkg-form-input:focus { border-color: #86B817; box-shadow: 0 0 0 3px rgba(134,184,23,0.15); background: #fff; }
        .pkg-upload-area {
          border: 2px dashed #d4edaa; border-radius: 14px;
          background: #f8fdf0; padding: 20px; text-align: center; cursor: pointer;
          transition: border-color 0.2s; position: relative;
        }
        .pkg-upload-area:hover { border-color: #86B817; }
        .pkg-upload-area input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
        .pkg-upload-icon { font-size: 2rem; color: #86B817; margin-bottom: 8px; }
        .pkg-upload-text { color: #5a8a00; font-weight: 600; font-size: 0.9rem; }
        .pkg-upload-hint { color: #aaa; font-size: 0.78rem; margin-top: 4px; }
        .pkg-preview-img { width: 100%; height: 180px; object-fit: cover; border-radius: 12px; margin-top: 12px; }
        .pkg-modal-footer { padding: 0 28px 28px; display: flex; gap: 12px; justify-content: flex-end; }
        .pkg-cancel-btn {
          padding: 11px 28px; border-radius: 50px; border: 1.5px solid #e0e0e0;
          background: #fff; color: #666; font-weight: 700; cursor: pointer;
        }
        .pkg-submit-btn {
          padding: 11px 32px; border-radius: 50px; border: none;
          background: linear-gradient(135deg, #86B817, #5a8a00);
          color: #fff; font-weight: 700; cursor: pointer;
          box-shadow: 0 6px 20px rgba(134,184,23,0.4);
          display: flex; align-items: center; gap: 8px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .pkg-submit-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .pkg-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .pkg-error { color: #dc3545; font-size: 0.85rem; text-align: center; padding: 8px 0 0; }
        .pkg-divider { height: 1px; background: #f0f0f0; margin: 0 28px 20px; }
      `}</style>

      <div className="adm-wrap">
        {/* Topbar */}
        <div className="adm-topbar">
          <div className="adm-topbar-logo">
            <Image src="/img/Logos.png" alt="logo" width={32} height={32} />
            <span className="adm-topbar-logo-text">Akash Holidays</span>
          </div>
          <div className="adm-topbar-right">
            <span className="adm-badge">Admin Panel</span>
            <button className="adm-logout-btn" onClick={handleLogout}>
              <i className="fa fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="adm-content">
          <div className="adm-header-row">
            <div>
              <div className="adm-page-title">Manage Packages</div>
              <div className="adm-page-sub">{packages.length} package{packages.length !== 1 ? 's' : ''} listed</div>
            </div>
            <button className="add-pkg-btn" onClick={() => setShowModal(true)}>
              <i className="fa fa-plus"></i> Add New Package
            </button>
          </div>

          {packages.length === 0 ? (
            <div className="adm-empty">
              <i className="fa fa-suitcase"></i>
              No packages yet. Add your first one!
            </div>
          ) : (
            <div className="adm-grid">
              {packages.map(pkg => (
                <div key={pkg._id} className="adm-pkg-card">
                  <img
                    className="adm-pkg-img"
                    src={pkg.img.startsWith('data:') ? pkg.img : `/img/${pkg.img}`}
                    alt={pkg.dest}
                  />
                  <div className="adm-pkg-body">
                    <div className="adm-pkg-dest">{pkg.dest}</div>
                    <div className="adm-pkg-meta">
                      <span className="adm-pkg-chip"><i className="fa fa-calendar-alt"></i> {pkg.nights}</span>
                      <span className="adm-pkg-chip"><i className="fa fa-user"></i> {pkg.persons}</span>
                    </div>
                    <div className="adm-pkg-price">INR {pkg.price}</div>
                    <button
                      className="adm-delete-btn"
                      onClick={() => handleDelete(pkg._id)}
                      disabled={deleteId === pkg._id}
                    >
                      <i className="fa fa-trash"></i>
                      {deleteId === pkg._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Package Modal */}
      {showModal && (
        <div className="pkg-modal-backdrop" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="pkg-modal">
            <div className="pkg-modal-header">
              <h5><i className="fa fa-plus-circle me-2"></i>Add New Package</h5>
              <button className="pkg-modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="pkg-modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="pkg-form-label">Package Banner Image</label>
                    <div className="pkg-upload-area">
                      <input type="file" accept="image/*" onChange={handleImage} required />
                      <div className="pkg-upload-icon"><i className="fa fa-cloud-upload-alt"></i></div>
                      <div className="pkg-upload-text">{preview ? 'Click to change image' : 'Click to upload banner image'}</div>
                      <div className="pkg-upload-hint">JPG, PNG, WEBP supported</div>
                    </div>
                    {preview && <img src={preview} alt="preview" className="pkg-preview-img" />}
                  </div>
                  <div className="col-md-6">
                    <label className="pkg-form-label">Destination</label>
                    <input className="pkg-form-input" placeholder="e.g. Goa" name="dest" value={form.dest} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="pkg-form-label">Price (INR)</label>
                    <input className="pkg-form-input" placeholder="e.g. 29,999.00" name="price" value={form.price} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="pkg-form-label">Duration</label>
                    <input className="pkg-form-input" placeholder="e.g. 3 Nights" name="nights" value={form.nights} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="pkg-form-label">Persons</label>
                    <input className="pkg-form-input" placeholder="e.g. 2 Person" name="persons" value={form.persons} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <label className="pkg-form-label">Description</label>
                    <textarea className="pkg-form-input" rows={3} placeholder="Describe the package..." name="desc" value={form.desc} onChange={handleChange} required />
                  </div>
                  {status === 'error' && <p className="pkg-error">Something went wrong. Please try again.</p>}
                </div>
              </div>
              <div className="pkg-divider" />
              <div className="pkg-modal-footer">
                <button type="button" className="pkg-cancel-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="pkg-submit-btn" disabled={status === 'loading'}>
                  {status === 'loading' ? <><i className="fa fa-spinner fa-spin"></i> Adding...</> : <><i className="fa fa-check"></i> Add Package</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
