'use client'
import { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'

const empty = { img: '', dest: '', nights: '', persons: '', discount: '', desc: '' }

type Package = { _id: string; img: string; dest: string; nights: string; persons: string; discount: string; desc: string }
type ModalMode = 'add' | 'edit'

function imgSrc(img: string) {
  if (!img) return '/img/package-1.jpg'
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) return img
  return `/img/${img}`
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  const [packages, setPackages] = useState<Package[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>('add')
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = sessionStorage.getItem('admin_token')
    if (t) setToken(t)
  }, [])

  useEffect(() => {
    if (!token) return
    setLoading(true)
    fetch('/api/packages')
      .then(r => r.json())
      .then(data => { setPackages(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      sessionStorage.setItem('admin_token', data.token)
      setToken(data.token)
      Swal.fire({ icon: 'success', title: 'Welcome back!', timer: 1800, showConfirmButton: false, toast: true, position: 'top-end' })
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => { sessionStorage.removeItem('admin_token'); setToken(null) }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setForm(f => ({ ...f, img: data.url }))
    } catch (err: unknown) {
      Swal.fire({ icon: 'error', title: 'Upload Failed', text: err instanceof Error ? err.message : 'Try again', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false })
    } finally {
      setUploading(false)
    }
  }

  const openAdd = () => { setModalMode('add'); setEditId(null); setForm(empty); setStatus('idle'); setShowModal(true) }
  const openEdit = (pkg: Package) => { setModalMode('edit'); setEditId(pkg._id); setForm({ img: pkg.img, dest: pkg.dest, nights: pkg.nights, persons: pkg.persons, discount: pkg.discount, desc: pkg.desc }); setStatus('idle'); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setForm(empty); setStatus('idle'); setEditId(null) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const isEdit = modalMode === 'edit' && editId
      const res = await fetch(isEdit ? `/api/packages/${editId}` : '/api/packages', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `HTTP ${res.status}`)
      }
      const saved = await res.json()
      if (isEdit) {
        setPackages(prev => prev.map(p => p._id === editId ? saved : p))
        Swal.fire({ icon: 'success', title: 'Updated!', text: `${saved.dest} has been updated.`, timer: 2500, showConfirmButton: false, toast: true, position: 'top-end' })
      } else {
        setPackages(prev => [...prev, saved])
        Swal.fire({ icon: 'success', title: 'Package Added!', text: `${saved.dest} has been added.`, timer: 2500, showConfirmButton: false, toast: true, position: 'top-end' })
      }
      closeModal()
    } catch (err: unknown) {
      setStatus('error')
      Swal.fire({ icon: 'error', title: 'Error', text: err instanceof Error ? err.message : 'Something went wrong', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false })
    }
  }

  const handleDelete = async (id: string) => {
    const pkg = packages.find(p => p._id === id)
    const confirm = await Swal.fire({
      title: 'Delete Package?',
      text: `Are you sure you want to delete "${pkg?.dest}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#86B817',
      confirmButtonText: 'Yes, delete it',
    })
    if (!confirm.isConfirmed) return
    setDeleteId(id)
    try {
      await fetch(`/api/packages/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      setPackages(prev => prev.filter(p => p._id !== id))
      Swal.fire({ icon: 'success', title: 'Deleted!', text: `"${pkg?.dest}" removed.`, timer: 2000, showConfirmButton: false, toast: true, position: 'top-end' })
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete. Try again.', timer: 2500, showConfirmButton: false, toast: true, position: 'top-end' })
    }
    setDeleteId(null)
  }

  // ── LOGIN ─────────────────────────────────────────────────────
  if (!token) return (
    <>
      <style>{`
        .adm-login-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#0a0f1e 0%,#1a2540 100%); padding:20px; }
        .adm-login-card { background:#fff; border-radius:24px; padding:48px 40px; width:100%; max-width:420px; box-shadow:0 32px 80px rgba(0,0,0,0.35); }
        .adm-login-logo { display:flex; align-items:center; gap:10px; margin-bottom:32px; justify-content:center; }
        .adm-login-logo-text { font-size:1.3rem; font-weight:900; background:linear-gradient(90deg,#a259c6,#ff4d4d); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .adm-login-title { font-size:1.6rem; font-weight:800; color:#14141f; margin-bottom:6px; text-align:center; }
        .adm-login-sub { color:#888; font-size:0.9rem; text-align:center; margin-bottom:28px; }
        .adm-label { font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#555; margin-bottom:6px; display:block; }
        .adm-input { width:100%; padding:12px 16px; border-radius:12px; border:1.5px solid #e0e0e0; font-size:0.95rem; color:#14141f; background:#fafafa; outline:none; margin-bottom:16px; transition:border-color 0.2s,box-shadow 0.2s; }
        .adm-input:focus { border-color:#86B817; box-shadow:0 0 0 3px rgba(134,184,23,0.15); background:#fff; }
        .adm-login-btn { width:100%; padding:13px; border-radius:50px; border:none; background:linear-gradient(135deg,#86B817,#5a8a00); color:#fff; font-weight:700; font-size:1rem; cursor:pointer; box-shadow:0 6px 20px rgba(134,184,23,0.4); transition:transform 0.2s,box-shadow 0.2s; margin-top:4px; }
        .adm-login-btn:hover:not(:disabled) { transform:translateY(-2px); }
        .adm-login-btn:disabled { opacity:0.7; cursor:not-allowed; }
        .adm-login-error { color:#dc3545; font-size:0.85rem; text-align:center; margin-bottom:12px; }
      `}</style>
      <div className="adm-login-wrap">
        <div className="adm-login-card">
          <div className="adm-login-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/Logos.png" alt="logo" width={36} height={36} />
            <span className="adm-login-logo-text">Akash Holidays</span>
          </div>
          <div className="adm-login-title">Admin Login</div>
          <div className="adm-login-sub">Sign in to manage packages</div>
          <form onSubmit={handleLogin}>
            <label className="adm-label">Email</label>
            <input className="adm-input" type="email" placeholder="admin@email.com" value={loginForm.email} onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} required />
            <label className="adm-label">Password</label>
            <input className="adm-input" type="password" placeholder="••••••••" value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} required />
            {loginError && <div className="adm-login-error">{loginError}</div>}
            <button className="adm-login-btn" type="submit" disabled={loginLoading}>{loginLoading ? 'Signing in...' : 'Sign In'}</button>
          </form>
        </div>
      </div>
    </>
  )

  // ── DASHBOARD ─────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .adm-wrap { min-height:100vh; background:#f4f6fa; }
        .adm-topbar { background:#fff; padding:16px 32px; display:flex; align-items:center; justify-content:space-between; box-shadow:0 2px 12px rgba(0,0,0,0.07); position:sticky; top:0; z-index:100; }
        .adm-topbar-logo { display:flex; align-items:center; gap:10px; }
        .adm-topbar-logo-text { font-size:1.2rem; font-weight:900; background:linear-gradient(90deg,#a259c6,#ff4d4d); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .adm-topbar-right { display:flex; align-items:center; gap:16px; }
        .adm-badge { background:#f0fad8; color:#5a8a00; font-size:0.78rem; font-weight:700; padding:5px 14px; border-radius:50px; border:1px solid #d4edaa; }
        .adm-logout-btn { padding:8px 20px; border-radius:50px; border:1.5px solid #e0e0e0; background:#fff; color:#666; font-weight:700; font-size:0.85rem; cursor:pointer; transition:border-color 0.2s,color 0.2s; }
        .adm-logout-btn:hover { border-color:#dc3545; color:#dc3545; }

        .adm-content { padding:40px 32px; max-width:1200px; margin:0 auto; }
        .adm-header-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; flex-wrap:wrap; gap:16px; }
        .adm-page-title { font-size:1.8rem; font-weight:800; color:#14141f; }
        .adm-page-sub { color:#888; font-size:0.9rem; margin-top:4px; }

        .add-pkg-btn { display:inline-flex; align-items:center; gap:10px; background:linear-gradient(135deg,#86B817,#5a8a00); color:#fff; font-weight:700; font-size:0.95rem; padding:13px 28px; border-radius:50px; border:none; cursor:pointer; box-shadow:0 6px 20px rgba(134,184,23,0.4); transition:transform 0.2s,box-shadow 0.2s; }
        .add-pkg-btn:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(134,184,23,0.5); }

        .adm-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:24px; }
        .adm-pkg-card { background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.07); border:1px solid rgba(0,0,0,0.05); transition:transform 0.3s ease,box-shadow 0.3s ease; }
        .adm-pkg-card:hover { transform:translateY(-6px); box-shadow:0 16px 40px rgba(0,0,0,0.12); }
        .adm-pkg-img { width:100%; height:200px; object-fit:cover; display:block; }
        .adm-pkg-body { padding:18px 20px; }
        .adm-pkg-dest { font-size:1.05rem; font-weight:800; color:#14141f; margin-bottom:6px; }
        .adm-pkg-meta { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px; }
        .adm-pkg-chip { background:#f5fce8; color:#5a8a00; font-size:0.75rem; font-weight:600; padding:3px 10px; border-radius:50px; border:1px solid #d4edaa; }
        .adm-pkg-discount { font-size:0.95rem; font-weight:800; color:#c0392b; margin-bottom:14px; }
        .adm-pkg-actions { display:flex; gap:8px; }
        .adm-edit-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 18px; border-radius:50px; border:1.5px solid #d4edaa; background:#f5fce8; color:#5a8a00; font-weight:700; font-size:0.82rem; cursor:pointer; transition:background 0.2s,border-color 0.2s; }
        .adm-edit-btn:hover { background:#86B817; color:#fff; border-color:#86B817; }
        .adm-delete-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 18px; border-radius:50px; border:1.5px solid #ffcccc; background:#fff5f5; color:#dc3545; font-weight:700; font-size:0.82rem; cursor:pointer; transition:background 0.2s,border-color 0.2s; }
        .adm-delete-btn:hover { background:#dc3545; color:#fff; border-color:#dc3545; }
        .adm-delete-btn:disabled { opacity:0.5; cursor:not-allowed; }

        .adm-empty { text-align:center; padding:80px 20px; color:#aaa; }
        .adm-empty i { font-size:3rem; margin-bottom:16px; display:block; }

        .pkg-modal-backdrop { position:fixed; inset:0; z-index:9999; background:rgba(10,15,30,0.7); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:20px; overflow-y:auto; animation:backdropIn 0.25s ease; }
        @keyframes backdropIn { from{opacity:0} to{opacity:1} }
        .pkg-modal { background:#fff; border-radius:24px; width:100%; max-width:680px; box-shadow:0 32px 80px rgba(0,0,0,0.25); animation:modalSlideUp 0.35s cubic-bezier(0.22,1,0.36,1); overflow:hidden; }
        @keyframes modalSlideUp { from{opacity:0;transform:translateY(40px) scale(0.97)} to{opacity:1;transform:none} }
        .pkg-modal-header { background:linear-gradient(135deg,#86B817,#5a8a00); padding:24px 28px; display:flex; align-items:center; justify-content:space-between; }
        .pkg-modal-header h5 { color:#fff; font-weight:800; font-size:1.2rem; margin:0; }
        .pkg-modal-close { width:34px; height:34px; border-radius:50%; background:rgba(255,255,255,0.2); border:none; cursor:pointer; color:#fff; font-size:1.1rem; display:flex; align-items:center; justify-content:center; transition:background 0.2s; }
        .pkg-modal-close:hover { background:rgba(255,255,255,0.35); }
        .pkg-modal-body { padding:28px; }
        .pkg-form-label { font-weight:700; font-size:0.82rem; color:#444; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:6px; display:block; }
        .pkg-form-input { width:100%; padding:11px 16px; border-radius:12px; border:1.5px solid #e0e0e0; font-size:0.95rem; color:#14141F; background:#fafafa; transition:border-color 0.2s,box-shadow 0.2s; outline:none; }
        .pkg-form-input:focus { border-color:#86B817; box-shadow:0 0 0 3px rgba(134,184,23,0.15); background:#fff; }
        .pkg-img-hint { color:#888; font-size:0.78rem; margin-top:5px; }
        .pkg-preview-img { width:100%; height:160px; object-fit:cover; border-radius:12px; margin-top:10px; border:1px solid #e0e0e0; }
        .pkg-file-upload-area { border:2px dashed #d4edaa; border-radius:12px; padding:22px; text-align:center; cursor:pointer; background:#fafff5; transition:border-color 0.2s,background 0.2s; }
        .pkg-file-upload-area:hover { border-color:#86B817; background:#f5fce8; }
        .pkg-file-upload-area i { font-size:1.8rem; color:#86B817; display:block; margin-bottom:8px; }
        .pkg-file-upload-label { font-weight:700; font-size:0.88rem; color:#5a8a00; display:block; margin-bottom:4px; }
        .pkg-file-upload-sub { font-size:0.76rem; color:#aaa; }
        .pkg-upload-spinner { display:inline-flex; align-items:center; gap:8px; color:#86B817; font-size:0.85rem; font-weight:700; margin-top:8px; }
        .pkg-modal-footer { padding:0 28px 28px; display:flex; gap:12px; justify-content:flex-end; }
        .pkg-cancel-btn { padding:11px 28px; border-radius:50px; border:1.5px solid #e0e0e0; background:#fff; color:#666; font-weight:700; cursor:pointer; }
        .pkg-submit-btn { padding:11px 32px; border-radius:50px; border:none; background:linear-gradient(135deg,#86B817,#5a8a00); color:#fff; font-weight:700; cursor:pointer; box-shadow:0 6px 20px rgba(134,184,23,0.4); display:flex; align-items:center; gap:8px; transition:transform 0.2s,box-shadow 0.2s; }
        .pkg-submit-btn:hover:not(:disabled) { transform:translateY(-2px); }
        .pkg-submit-btn:disabled { opacity:0.7; cursor:not-allowed; }
        .pkg-error { color:#dc3545; font-size:0.85rem; text-align:center; padding:8px 0 0; }
        .pkg-divider { height:1px; background:#f0f0f0; margin:0 28px 20px; }

        .adm-img-note { background:#fffbea; border:1px solid #ffe58f; border-radius:10px; padding:10px 14px; font-size:0.82rem; color:#7a5c00; margin-bottom:20px; display:flex; align-items:flex-start; gap:8px; }
      `}</style>

      <div className="adm-wrap">
        <div className="adm-topbar">
          <div className="adm-topbar-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/Logos.png" alt="logo" width={32} height={32} />
            <span className="adm-topbar-logo-text">Akash Holidays</span>
          </div>
          <div className="adm-topbar-right">
            <span className="adm-badge">Admin Panel</span>
            <button className="adm-logout-btn" onClick={handleLogout}><i className="fa fa-sign-out-alt"></i> Logout</button>
          </div>
        </div>

        <div className="adm-content">
          <div className="adm-header-row">
            <div>
              <div className="adm-page-title">Manage Packages</div>
              <div className="adm-page-sub">{packages.length} package{packages.length !== 1 ? 's' : ''} listed</div>
            </div>
            <button className="add-pkg-btn" onClick={openAdd}><i className="fa fa-plus"></i> Add New Package</button>
          </div>

          <div className="adm-img-note">
            <i className="fa fa-info-circle" style={{ marginTop: 2 }}></i>
            <span>Images are uploaded to <strong>Cloudinary</strong>. Only the secure URL is saved in MongoDB — no binary data stored.</span>
          </div>

          {loading ? (
            <div className="adm-empty"><i className="fa fa-spinner fa-spin"></i> Loading packages...</div>
          ) : packages.length === 0 ? (
            <div className="adm-empty"><i className="fa fa-suitcase"></i> No packages yet. Add your first one!</div>
          ) : (
            <div className="adm-grid">
              {packages.map(pkg => (
                <div key={pkg._id} className="adm-pkg-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="adm-pkg-img" src={imgSrc(pkg.img)} alt={pkg.dest} />
                  <div className="adm-pkg-body">
                    <div className="adm-pkg-dest">{pkg.dest}</div>
                    <div className="adm-pkg-meta">
                      <span className="adm-pkg-chip"><i className="fa fa-calendar-alt"></i> {pkg.nights}</span>
                      <span className="adm-pkg-chip"><i className="fa fa-user"></i> {pkg.persons}</span>
                    </div>
                    <div className="adm-pkg-discount">🔥 {pkg.discount}</div>
                    <div className="adm-pkg-actions">
                      <button className="adm-edit-btn" onClick={() => openEdit(pkg)}>
                        <i className="fa fa-edit"></i> Edit
                      </button>
                      <button className="adm-delete-btn" onClick={() => handleDelete(pkg._id)} disabled={deleteId === pkg._id}>
                        <i className="fa fa-trash"></i> {deleteId === pkg._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="pkg-modal-backdrop" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="pkg-modal">
            <div className="pkg-modal-header">
              <h5><i className={`fa fa-${modalMode === 'edit' ? 'edit' : 'plus-circle'} me-2`}></i>{modalMode === 'edit' ? 'Edit Package' : 'Add New Package'}</h5>
              <button className="pkg-modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="pkg-modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="pkg-form-label">Package Image</label>
                    <div className="pkg-file-upload-area" onClick={() => fileInputRef.current?.click()}>
                      <i className="fa fa-cloud-upload-alt"></i>
                      <span className="pkg-file-upload-label">Click to upload image</span>
                      <span className="pkg-file-upload-sub">JPG, PNG, WEBP — uploaded to Cloudinary</span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    {uploading && (
                      <div className="pkg-upload-spinner">
                        <i className="fa fa-spinner fa-spin"></i> Uploading to Cloudinary...
                      </div>
                    )}
                    {form.img && !uploading && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.img} alt="preview" className="pkg-preview-img" onError={e => (e.currentTarget.style.display = 'none')} />
                    )}
                    {form.img && !uploading && (
                      <div className="pkg-img-hint">✓ Cloudinary URL saved: {form.img.slice(0, 60)}...</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="pkg-form-label">Destination</label>
                    <input className="pkg-form-input" placeholder="e.g. Goa" name="dest" value={form.dest} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="pkg-form-label">Discount</label>
                    <input className="pkg-form-input" placeholder="e.g. 35% OFF" name="discount" value={form.discount} onChange={handleChange} required />
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
                <button type="submit" className="pkg-submit-btn" disabled={status === 'loading' || uploading}>
                  {status === 'loading'
                    ? <><i className="fa fa-spinner fa-spin"></i> Saving...</>
                    : <><i className="fa fa-check"></i> {modalMode === 'edit' ? 'Save Changes' : 'Add Package'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
