'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { RSVP } from '@/lib/supabase-admin'

type AttendFilter = 'all' | 'yes' | 'no'
type SideFilter   = 'all' | 'groom' | 'bride'

type Stats = {
  total: number
  attending: number
  notAttending: number
  totalGuests: number
  groomGuests: number
  brideGuests: number
}

function exportPDF(rows: RSVP[], stats: Stats, filters: { attend: AttendFilter; side: SideFilter }) {
  const generatedAt = new Date().toLocaleString('en-MY', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const filterLabel = [
    filters.attend === 'all' ? 'All Responses' : filters.attend === 'yes' ? 'Attending Only' : 'Not Attending Only',
    filters.side === 'all' ? '' : filters.side === 'groom' ? '· Groom\'s Side' : '· Bride\'s Side',
  ].join(' ').trim()

  const tableRows = rows.map((r, i) => `
    <tr class="${i % 2 === 0 ? 'even' : 'odd'}">
      <td class="num">${i + 1}</td>
      <td>
        <div class="guest-name">${r.name}</div>
        <div class="guest-phone">${r.phone}</div>
      </td>
      <td>
        <div class="${r.side === 'groom' ? 'side-groom' : 'side-bride'}">${r.side === 'groom' ? "Groom's" : "Bride's"}</div>
        <div class="rel">${r.relationship.charAt(0).toUpperCase() + r.relationship.slice(1)}</div>
      </td>
      <td><span class="${r.attending ? 'badge-yes' : 'badge-no'}">${r.attending ? 'Yes' : 'No'}</span></td>
      <td class="guests-num">${r.attending ? r.guests_count : '—'}</td>
      <td class="msg-cell">${r.message ? `<span class="msg-text">${r.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>` : '<span class="no-msg">—</span>'}</td>
    </tr>
  `).join('')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>RSVP Guest List — Sean &amp; Faazieqa</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Jost', sans-serif;
      font-weight: 300;
      color: #1a1410;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── HEADER ── */
    .pdf-header {
      background: #5a0f1f;
      color: #fff;
      padding: 36px 48px 28px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 24px;
    }
    .pdf-monogram {
      font-family: 'Cormorant Garamond', serif;
      font-size: 44px;
      font-weight: 400;
      letter-spacing: 0.12em;
      color: #d9c199;
      line-height: 1;
    }
    .pdf-monogram .amp { color: #fff; font-style: italic; }
    .pdf-header-right { text-align: right; }
    .pdf-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 26px;
      font-weight: 600;
      letter-spacing: 0.08em;
      line-height: 1.1;
    }
    .pdf-subtitle {
      font-size: 11px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #d9c199;
      margin-top: 6px;
    }
    .pdf-date {
      font-size: 10px;
      color: rgba(255,255,255,0.55);
      margin-top: 10px;
      letter-spacing: 0.05em;
    }

    /* ── FILTER BADGE ── */
    .pdf-filter-bar {
      background: #f7f3ec;
      border-bottom: 1px solid #e5ddd0;
      padding: 10px 48px;
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #7a6a55;
    }

    /* ── STATS ── */
    .pdf-stats {
      display: flex;
      gap: 0;
      border-bottom: 2px solid #5a0f1f;
      background: #fff;
    }
    .pdf-stat {
      flex: 1;
      padding: 20px 16px;
      text-align: center;
      border-right: 1px solid #e5ddd0;
    }
    .pdf-stat:last-child { border-right: none; }
    .pdf-stat-num {
      font-family: 'Cormorant Garamond', serif;
      font-size: 34px;
      font-weight: 600;
      color: #5a0f1f;
      line-height: 1;
    }
    .pdf-stat-lbl {
      font-size: 9px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #7a6a55;
      margin-top: 5px;
    }

    /* ── TABLE ── */
    .pdf-table-wrap { padding: 32px 48px 48px; }

    .pdf-section-label {
      font-size: 9px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #a38449;
      margin-bottom: 14px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11.5px;
    }
    thead tr {
      background: #5a0f1f;
      color: #fff;
    }
    thead th {
      padding: 10px 12px;
      text-align: left;
      font-weight: 500;
      font-size: 9px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
    }
    thead th.num { width: 36px; text-align: center; }
    thead th.guests-num { width: 56px; text-align: center; }

    tbody tr.even { background: #fff; }
    tbody tr.odd  { background: #faf7f2; }

    tbody td {
      padding: 10px 12px;
      vertical-align: top;
      border-bottom: 1px solid #ece6db;
    }
    td.num { text-align: center; color: #a38449; font-size: 10px; font-weight: 500; }
    td.guests-num { text-align: center; font-weight: 500; }

    .guest-name { font-weight: 500; color: #1a1410; }
    .guest-phone { font-size: 10px; color: #7a6a55; margin-top: 2px; }

    .side-groom { font-size: 10px; font-weight: 500; color: #223118; }
    .side-bride { font-size: 10px; font-weight: 500; color: #5a0f1f; }
    .rel { font-size: 10px; color: #7a6a55; margin-top: 2px; }

    .badge-yes {
      display: inline-block;
      background: #223118;
      color: #fff;
      font-size: 9px;
      letter-spacing: 0.1em;
      padding: 2px 8px;
      border-radius: 20px;
    }
    .badge-no {
      display: inline-block;
      background: #e5ddd0;
      color: #7a6a55;
      font-size: 9px;
      letter-spacing: 0.1em;
      padding: 2px 8px;
      border-radius: 20px;
    }

    .msg-cell { max-width: 180px; }
    .msg-text { font-size: 10px; color: #7a6a55; font-style: italic; }
    .no-msg { color: #ccc; }

    /* ── FOOTER ── */
    .pdf-footer {
      border-top: 1px solid #e5ddd0;
      padding: 16px 48px;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #b0a090;
      letter-spacing: 0.08em;
    }

    /* ── PRINT ── */
    @media print {
      @page { margin: 0; size: A4 portrait; }
      .pdf-header { padding: 28px 36px 22px; }
      .pdf-table-wrap { padding: 24px 36px 36px; }
      .pdf-footer { padding: 12px 36px; }
      .pdf-filter-bar { padding: 8px 36px; }
    }
  </style>
</head>
<body>

  <div class="pdf-header">
    <div class="pdf-monogram">S<span class="amp">&amp;</span>F</div>
    <div class="pdf-header-right">
      <div class="pdf-title">RSVP Guest List</div>
      <div class="pdf-subtitle">Sean &amp; Faazieqa · 26 September 2026</div>
      <div class="pdf-date">Generated ${generatedAt}</div>
    </div>
  </div>

  <div class="pdf-filter-bar">Showing: ${filterLabel} · ${rows.length} record${rows.length !== 1 ? 's' : ''}</div>

  <div class="pdf-stats">
    <div class="pdf-stat">
      <div class="pdf-stat-num">${stats.total}</div>
      <div class="pdf-stat-lbl">Total Responses</div>
    </div>
    <div class="pdf-stat">
      <div class="pdf-stat-num">${stats.attending}</div>
      <div class="pdf-stat-lbl">Attending</div>
    </div>
    <div class="pdf-stat">
      <div class="pdf-stat-num">${stats.notAttending}</div>
      <div class="pdf-stat-lbl">Not Attending</div>
    </div>
    <div class="pdf-stat">
      <div class="pdf-stat-num">${stats.totalGuests}</div>
      <div class="pdf-stat-lbl">Total Guests</div>
    </div>
    <div class="pdf-stat">
      <div class="pdf-stat-num">${stats.groomGuests}</div>
      <div class="pdf-stat-lbl">Groom's Guests</div>
    </div>
    <div class="pdf-stat">
      <div class="pdf-stat-num">${stats.brideGuests}</div>
      <div class="pdf-stat-lbl">Bride's Guests</div>
    </div>
  </div>

  <div class="pdf-table-wrap">
    <div class="pdf-section-label">Guest Responses</div>
    <table>
      <thead>
        <tr>
          <th class="num">#</th>
          <th>Name &amp; Phone</th>
          <th>Side · Relationship</th>
          <th>Attending</th>
          <th class="guests-num">Guests</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  </div>

  <div class="pdf-footer">
    <span>Sean &amp; Faazieqa · 26 September 2026 · Mawaddah Hall, Brunei</span>
    <span>Generated ${generatedAt}</span>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 800);
    };
  </script>
</body>
</html>`

  const win = window.open('', '_blank')
  if (!win) { alert('Please allow pop-ups to export the PDF.'); return }
  win.document.write(html)
  win.document.close()
}

function exportCSV(rows: RSVP[]) {
  const headers = ['Name', 'Phone', 'Side', 'Relationship', 'Attending', 'Guests', 'Message', 'Submitted']
  const lines = rows.map((r) =>
    [
      r.name,
      r.phone,
      r.side,
      r.relationship,
      r.attending ? 'Yes' : 'No',
      r.guests_count,
      r.message ?? '',
      new Date(r.created_at).toLocaleString('en-MY'),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  )
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `rsvps-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminDashboard() {
  const router = useRouter()
  const [rsvps, setRsvps]             = useState<RSVP[]>([])
  const [loading, setLoading]         = useState(true)
  const [attendFilter, setAttendFilter] = useState<AttendFilter>('all')
  const [sideFilter, setSideFilter]   = useState<SideFilter>('all')

  useEffect(() => {
    fetch('/api/admin/rsvps')
      .then((r) => {
        if (r.status === 401) { router.push('/admin/login'); return null }
        return r.json()
      })
      .then((d) => { if (d) setRsvps(d.data ?? []) })
      .finally(() => setLoading(false))
  }, [router])

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const attending    = rsvps.filter((r) => r.attending)
  const notAttending = rsvps.filter((r) => !r.attending)
  const totalGuests  = attending.reduce((sum, r) => sum + r.guests_count, 0)
  const groomGuests  = attending.filter((r) => r.side === 'groom').reduce((sum, r) => sum + r.guests_count, 0)
  const brideGuests  = attending.filter((r) => r.side === 'bride').reduce((sum, r) => sum + r.guests_count, 0)

  const filtered = useMemo(() => {
    return rsvps.filter((r) => {
      const attendOk = attendFilter === 'all' || (attendFilter === 'yes') === r.attending
      const sideOk   = sideFilter === 'all'   || r.side === sideFilter
      return attendOk && sideOk
    })
  }, [rsvps, attendFilter, sideFilter])

  return (
    <div className="admin-body">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <a href="/" className="admin-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
            S<span>&amp;</span>F
          </a>
          <button className="admin-header-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </header>

      <div className="admin-wrap">

        {/* Page title + nav */}
        <div className="admin-page-title">RSVP Responses</div>
        <div className="admin-nav-row">
          <a href="/admin/timeline" className="admin-btn-outline">Edit Order of Events</a>
          <button
            className="admin-btn-outline"
            onClick={() => exportCSV(filtered)}
            disabled={filtered.length === 0}
          >Export CSV</button>
          <button
            className="admin-btn"
            onClick={() => exportPDF(filtered, { total: rsvps.length, attending: attending.length, notAttending: notAttending.length, totalGuests, groomGuests, brideGuests }, { attend: attendFilter, side: sideFilter })}
            disabled={filtered.length === 0}
          >Export PDF</button>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat">
            <div className="admin-stat-num">{rsvps.length}</div>
            <div className="admin-stat-lbl">Total Responses</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-num">{attending.length}</div>
            <div className="admin-stat-lbl">Attending</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-num">{notAttending.length}</div>
            <div className="admin-stat-lbl">Not Attending</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-num">{totalGuests}</div>
            <div className="admin-stat-lbl">Total Guests</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-num">{groomGuests}</div>
            <div className="admin-stat-lbl">Groom&rsquo;s Guests</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-num">{brideGuests}</div>
            <div className="admin-stat-lbl">Bride&rsquo;s Guests</div>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-toolbar">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="admin-filter">
              {(['all', 'yes', 'no'] as AttendFilter[]).map((f) => (
                <button key={f} className={`filter-btn${attendFilter === f ? ' active' : ''}`} onClick={() => setAttendFilter(f)}>
                  {f === 'all' ? 'All' : f === 'yes' ? 'Attending' : 'Not Attending'}
                </button>
              ))}
            </div>
            <div className="admin-filter">
              {(['all', 'groom', 'bride'] as SideFilter[]).map((f) => (
                <button key={f} className={`filter-btn${sideFilter === f ? ' active' : ''}`} onClick={() => setSideFilter(f)}>
                  {f === 'all' ? 'All Sides' : f === 'groom' ? "Groom's Side" : "Bride's Side"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="admin-loading">Loading responses…</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">No responses yet.</div>
        ) : (
          <div className="rsvp-cards">
            {filtered.map((r) => (
              <div key={r.id} className="rsvp-card">
                <div className="rsvp-card-top">
                  <div>
                    <div className="rsvp-card-name">{r.name}</div>
                    <div className="rsvp-card-meta">{r.phone}</div>
                  </div>
                  <span className={`badge badge-${r.attending ? 'yes' : 'no'}`}>
                    {r.attending ? 'Attending' : 'Not Attending'}
                  </span>
                </div>

                <div className="rsvp-card-pills">
                  <span className="rsvp-pill">{r.side === 'groom' ? "Groom's Side" : "Bride's Side"}</span>
                  <span className="rsvp-pill" style={{ textTransform: 'capitalize' }}>{r.relationship}</span>
                  {r.attending && (
                    <span className="rsvp-pill">{r.guests_count} {r.guests_count === 1 ? 'guest' : 'guests'}</span>
                  )}
                </div>

                {r.message && (
                  <div className="rsvp-card-message">&ldquo;{r.message}&rdquo;</div>
                )}

                <div className="rsvp-card-date">
                  {new Date(r.created_at).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
