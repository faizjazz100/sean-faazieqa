'use client'

import { useState } from 'react'
import Link from 'next/link'

interface FormState {
  name: string
  phone: string
  side: string
  relationship: string
  attending: string
  guests_count: string
  message: string
}

const INIT: FormState = {
  name: '',
  phone: '',
  side: '',
  relationship: '',
  attending: '',
  guests_count: '1',
  message: '',
}

export default function RSVPForm() {
  const [form, setForm] = useState<FormState>(INIT)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="form-success">
        <div className="form-success-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6 14l6 6 10-12" stroke="#a38449" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="form-success-title">
          {form.attending === 'yes' ? 'See you there!' : 'Thank you'}
        </div>
        <p className="form-success-body">
          {form.attending === 'yes'
            ? 'We are so happy you can make it. We cannot wait to celebrate with you on our special day.'
            : 'Thank you for letting us know. You will be missed, and we hope to celebrate with you another time.'}
        </p>
        <Link href="/" className="back-link">
          &larr; Back to invitation
        </Link>
      </div>
    )
  }

  return (
    <form className="rsvp-form-container" onSubmit={handleSubmit} noValidate>
      <p className="form-intro">
        We would be honoured by your presence. Please fill in the details below
        so we can celebrate together.
      </p>

      {/* Name */}
      <div className="form-group">
        <label className="form-label" htmlFor="name">
          Full Name <span className="req">*</span>
        </label>
        <input
          id="name"
          className="form-input"
          type="text"
          placeholder="Your full name"
          value={form.name}
          onChange={set('name')}
          required
        />
      </div>

      {/* Phone — Brunei format */}
      <div className="form-group">
        <label className="form-label" htmlFor="phone">
          Phone Number <span className="req">*</span>
        </label>
        <div className="phone-wrap">
          <span className="phone-prefix">+673</span>
          <input
            id="phone"
            className="form-input phone-input"
            type="tel"
            placeholder="7XX XXXX"
            value={form.phone}
            onChange={set('phone')}
            required
          />
        </div>
      </div>

      {/* Side */}
      <div className="form-group">
        <label className="form-label">
          Groom&rsquo;s or Bride&rsquo;s Side? <span className="req">*</span>
        </label>
        <div className="radio-group">
          {[
            { value: 'groom', label: "Groom's Side" },
            { value: 'bride', label: "Bride's Side" },
          ].map(({ value, label }) => (
            <label key={value} className="radio-option">
              <input
                type="radio"
                name="side"
                value={value}
                checked={form.side === value}
                onChange={set('side')}
                required
              />
              <span className="radio-label">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Relationship */}
      <div className="form-group">
        <label className="form-label" htmlFor="relationship">
          Relationship to the Couple <span className="req">*</span>
        </label>
        <select
          id="relationship"
          className="form-select"
          value={form.relationship}
          onChange={set('relationship')}
          required
        >
          <option value="" disabled>Select your relationship</option>
          <option value="family">Family</option>
          <option value="friend">Friends</option>
          <option value="colleague">Colleague</option>
        </select>
      </div>

      {/* Attending */}
      <div className="form-group">
        <label className="form-label">
          Will you be attending? <span className="req">*</span>
        </label>
        <div className="radio-group">
          {[
            { value: 'yes', label: 'Joyfully Accept' },
            { value: 'no',  label: 'Regretfully Decline' },
          ].map(({ value, label }) => (
            <label key={value} className="radio-option">
              <input
                type="radio"
                name="attending"
                value={value}
                checked={form.attending === value}
                onChange={set('attending')}
                required
              />
              <span className="radio-label">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Guests — only if attending */}
      {form.attending === 'yes' && (
        <div className="form-group">
          <label className="form-label" htmlFor="guests_count">
            Number of Guests (including yourself)
          </label>
          <select
            id="guests_count"
            className="form-select"
            value={form.guests_count}
            onChange={set('guests_count')}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Message */}
      <div className="form-group">
        <label className="form-label" htmlFor="message">
          A Message for the Couple
        </label>
        <textarea
          id="message"
          className="form-textarea"
          placeholder="Share your warmest wishes…"
          value={form.message}
          onChange={set('message')}
        />
      </div>

      {error && <div className="form-error">{error}</div>}

      <button
        type="submit"
        className="form-submit"
        disabled={loading || !form.attending || !form.side || !form.relationship}
      >
        {loading ? 'Sending…' : 'Send RSVP'}
      </button>
    </form>
  )
}
