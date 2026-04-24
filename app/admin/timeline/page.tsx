'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Event = {
  id: string
  sort_order: number
  time: string
  ampm: string
  event_name: string
  description: string
}

const EMPTY: Omit<Event, 'id' | 'sort_order'> = {
  time: '',
  ampm: '',
  event_name: '',
  description: '',
}

export default function TimelinePage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState(EMPTY)
  const [adding, setAdding] = useState(false)
  const [addForm, setAddForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    const res = await fetch('/api/admin/timeline')
    if (res.status === 401) { router.push('/admin/login'); return }
    const d = await res.json()
    setEvents(d.data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function startEdit(ev: Event) {
    setEditId(ev.id)
    setEditForm({ time: ev.time, ampm: ev.ampm, event_name: ev.event_name, description: ev.description })
    setAdding(false)
  }

  async function saveEdit(ev: Event) {
    setSaving(true); setError('')
    const res = await fetch(`/api/admin/timeline/${ev.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, sort_order: ev.sort_order }),
    })
    if (res.ok) { setEditId(null); await load() }
    else setError('Failed to save.')
    setSaving(false)
  }

  async function deleteEvent(id: string) {
    if (!confirm('Delete this event?')) return
    await fetch(`/api/admin/timeline/${id}`, { method: 'DELETE' })
    await load()
  }

  async function move(ev: Event, dir: -1 | 1) {
    const sorted = [...events].sort((a, b) => a.sort_order - b.sort_order)
    const idx = sorted.findIndex(e => e.id === ev.id)
    const swap = sorted[idx + dir]
    if (!swap) return
    await Promise.all([
      fetch(`/api/admin/timeline/${ev.id}`,   { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...ev,   sort_order: swap.sort_order }) }),
      fetch(`/api/admin/timeline/${swap.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...swap, sort_order: ev.sort_order }) }),
    ])
    await load()
  }

  async function addEvent() {
    setSaving(true); setError('')
    const res = await fetch('/api/admin/timeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addForm),
    })
    if (res.ok) { setAdding(false); setAddForm(EMPTY); await load() }
    else setError('Failed to add.')
    setSaving(false)
  }

  const sorted = [...events].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div className="admin-body">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-logo">S<span>&amp;</span>F</div>
          <Link href="/admin" className="admin-header-btn">← Back</Link>
        </div>
      </header>

      <div className="admin-wrap">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, marginTop: 40 }}>
          <div className="admin-page-title" style={{ margin: 0 }}>Order of Events</div>
          <button className="admin-btn" onClick={() => { setAdding(true); setEditId(null) }}>+ Add Event</button>
        </div>

        {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

        {loading ? (
          <div className="admin-loading">Loading…</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Add form */}
            {adding && (
              <div className="tl-admin-card tl-admin-editing">
                <div className="tl-admin-fields">
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input className="form-input" placeholder="Hour (e.g. 7)" value={addForm.time} onChange={e => setAddForm(f => ({ ...f, time: e.target.value }))} style={{ width: 80 }} />
                    <input className="form-input" placeholder="Suffix (e.g. :30 PM)" value={addForm.ampm} onChange={e => setAddForm(f => ({ ...f, ampm: e.target.value }))} style={{ flex: 1 }} />
                  </div>
                  <input className="form-input" placeholder="Event name" value={addForm.event_name} onChange={e => setAddForm(f => ({ ...f, event_name: e.target.value }))} />
                  <input className="form-input" placeholder="Description" value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="tl-admin-actions">
                  <button className="admin-btn" onClick={addEvent} disabled={saving}>Save</button>
                  <button className="admin-btn-outline" onClick={() => setAdding(false)}>Cancel</button>
                </div>
              </div>
            )}

            {sorted.map((ev, idx) => (
              <div key={ev.id} className={`tl-admin-card${editId === ev.id ? ' tl-admin-editing' : ''}`}>
                {editId === ev.id ? (
                  <>
                    <div className="tl-admin-fields">
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input className="form-input" placeholder="Hour" value={editForm.time} onChange={e => setEditForm(f => ({ ...f, time: e.target.value }))} style={{ width: 80 }} />
                        <input className="form-input" placeholder="Suffix (e.g. :30 PM)" value={editForm.ampm} onChange={e => setEditForm(f => ({ ...f, ampm: e.target.value }))} style={{ flex: 1 }} />
                      </div>
                      <input className="form-input" placeholder="Event name" value={editForm.event_name} onChange={e => setEditForm(f => ({ ...f, event_name: e.target.value }))} />
                      <input className="form-input" placeholder="Description" value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
                    </div>
                    <div className="tl-admin-actions">
                      <button className="admin-btn" onClick={() => saveEdit(ev)} disabled={saving}>Save</button>
                      <button className="admin-btn-outline" onClick={() => setEditId(null)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="tl-admin-info">
                      <div className="tl-admin-time">{ev.time}{ev.ampm}</div>
                      <div className="tl-admin-name">{ev.event_name}</div>
                      <div className="tl-admin-desc">{ev.description}</div>
                    </div>
                    <div className="tl-admin-actions">
                      <button className="admin-btn-outline" onClick={() => move(ev, -1)} disabled={idx === 0}>↑</button>
                      <button className="admin-btn-outline" onClick={() => move(ev, 1)} disabled={idx === sorted.length - 1}>↓</button>
                      <button className="admin-btn-outline" onClick={() => startEdit(ev)}>Edit</button>
                      <button className="admin-btn-outline" style={{ borderColor: '#5a0f1f', color: '#5a0f1f' }} onClick={() => deleteEvent(ev.id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
