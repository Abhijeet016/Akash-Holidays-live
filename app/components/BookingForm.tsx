'use client'
import { useState } from 'react'
import Swal from 'sweetalert2'

export default function BookingForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', destination: '', date: '', persons: '1', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch(`/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setForm({ name: '', email: '', phone: '', destination: '', date: '', persons: '1', message: '' })
      Swal.fire({ icon: 'success', title: 'Booking Received! 🎉', text: 'We will contact you within 24 hours to confirm your trip.', confirmButtonColor: '#86B817', confirmButtonText: 'Great, Thanks!' })
    } catch {
      Swal.fire({ icon: 'error', title: 'Oops!', text: 'Something went wrong. Please try again.', confirmButtonColor: '#86B817' })
    } finally {
      setStatus('idle')
    }
  }

  return (
    <>
      <style>{`
        .bf-wrap {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .bf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .bf-field { display: flex; flex-direction: column; gap: 6px; }
        .bf-label {
          font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.8px; color: #555;
          display: flex; align-items: center; gap: 6px;
        }
        .bf-label i { color: #86B817; font-size: 0.8rem; }
        .bf-input {
          padding: 12px 16px; border-radius: 12px;
          border: 1.5px solid #e8ecf0; background: #f8fafc;
          font-size: 0.93rem; color: #1a2035; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          width: 100%;
        }
        .bf-input:focus { border-color: #86B817; background: #fff; box-shadow: 0 0 0 3px rgba(134,184,23,0.12); }
        .bf-input::placeholder { color: #b0b8c8; }
        .bf-input option { color: #1a2035; }
        .bf-submit {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #86B817, #5a8a00);
          color: #fff; font-weight: 800; font-size: 1rem;
          border: none; border-radius: 14px; cursor: pointer;
          box-shadow: 0 8px 24px rgba(134,184,23,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          margin-top: 4px;
        }
        .bf-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(134,184,23,0.5); }
        .bf-submit:disabled { opacity: 0.75; cursor: not-allowed; }
        .bf-trust {
          display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 14px;
        }
        .bf-trust-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.75rem; font-weight: 600; color: #888;
        }
        .bf-trust-item i { color: #86B817; }
        @media (max-width: 576px) {
          .bf-row { grid-template-columns: 1fr; }
        }
      `}</style>
      <form onSubmit={handleSubmit}>
        <div className="bf-wrap">
          <div className="bf-row">
            <div className="bf-field">
              <label className="bf-label"><i className="fa fa-user"></i> Full Name</label>
              <input className="bf-input" placeholder="John Doe" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="bf-field">
              <label className="bf-label"><i className="fa fa-envelope"></i> Email</label>
              <input className="bf-input" type="email" placeholder="you@email.com" name="email" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="bf-row">
            <div className="bf-field">
              <label className="bf-label"><i className="fa fa-phone-alt"></i> Phone</label>
              <input className="bf-input" placeholder="+91 98765 43210" name="phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="bf-field">
              <label className="bf-label"><i className="fa fa-map-marker-alt"></i> Destination</label>
              <input className="bf-input" placeholder="e.g. Kashmir" name="destination" value={form.destination} onChange={handleChange} required />
            </div>
          </div>
          <div className="bf-row">
            <div className="bf-field">
              <label className="bf-label"><i className="fa fa-calendar-alt"></i> Travel Date</label>
              <input className="bf-input" type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>
            <div className="bf-field">
              <label className="bf-label"><i className="fa fa-users"></i> Travelers</label>
              <select className="bf-input" name="persons" value={form.persons} onChange={handleChange}>
                {['1','2','3','4','5','6','7','8+'].map(n => <option key={n} value={n}>{n} {n === '1' ? 'Person' : 'Persons'}</option>)}
              </select>
            </div>
          </div>
          <div className="bf-field">
            <label className="bf-label"><i className="fa fa-comment-alt"></i> Special Requirements</label>
            <textarea className="bf-input" rows={3} placeholder="Any special requests, dietary needs, accessibility requirements..." name="message" value={form.message} onChange={handleChange} />
          </div>
          <button type="submit" className="bf-submit" disabled={status === 'loading'}>
            {status === 'loading'
              ? <><i className="fa fa-spinner fa-spin"></i> Submitting...</>
              : <><i className="fa fa-paper-plane"></i> Book My Trip</>}
          </button>
          <div className="bf-trust">
            <span className="bf-trust-item"><i className="fa fa-lock"></i> Secure & Private</span>
            <span className="bf-trust-item"><i className="fa fa-check-circle"></i> Free Cancellation</span>
            <span className="bf-trust-item"><i className="fa fa-headset"></i> 24/7 Support</span>
          </div>
        </div>
      </form>
    </>
  )
}
