import Link from 'next/link'
import { cookies } from 'next/headers'
import Countdown from '@/components/Countdown'
import { supabaseAdmin } from '@/lib/supabase-admin'

const DEFAULT_EVENTS = [
  { id: '1', time: '6', ampm: ':30 PM', event_name: 'Guest Arrival', description: 'Cocktails and canapés in the foyer', sort_order: 1 },
  { id: '2', time: '7', ampm: ':00 PM', event_name: 'Grand Entrance', description: 'Introducing the newlyweds', sort_order: 2 },
  { id: '3', time: '7', ampm: ':15 PM', event_name: 'Welcome Speech', description: 'A few words from the families', sort_order: 3 },
  { id: '4', time: '7', ampm: ':30 PM', event_name: 'Cake Cutting & Toast', description: 'Followed by the first yum seng', sort_order: 4 },
  { id: '5', time: '7', ampm: ':45 PM', event_name: 'Dinner Service', description: 'An eight-course plated dinner', sort_order: 5 },
  { id: '6', time: '8', ampm: ':30 PM', event_name: 'Live Music & Games', description: 'Celebrations on the floor', sort_order: 6 },
  { id: '7', time: '8', ampm: ':45 PM', event_name: 'Photo Session', description: 'With family, friends & the couple', sort_order: 7 },
  { id: '8', time: '9', ampm: ':00 PM', event_name: 'Farewell', description: 'A sending off with blessings', sort_order: 8 },
]

export default async function HomePage() {
  const cookieStore = cookies()
  const isAdmin = cookieStore.get('admin_session')?.value === process.env.ADMIN_SECRET

  const { data: events } = await supabaseAdmin
    .from('timeline_events')
    .select('*')
    .order('sort_order')

  const timeline = events?.length ? events : DEFAULT_EVENTS

  return (
    <div className="wrap">
      <div className="grain" />

      {isAdmin && (
        <Link href="/admin" className="admin-home-badge">
          Admin
        </Link>
      )}

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-img" />
        <div className="hero-inner">
          <div className="hero-top">
            <div className="monogram">
              S<span className="amp">&amp;</span>F
            </div>
            <div className="hairline" />
          </div>

          <div className="hero-center">
            <div className="eyebrow">Save the Date</div>
            <h1 className="hero-names">
              Sean
              <span className="and">&amp;</span>
              Faazieqa
            </h1>
            <div className="hero-sub">are getting married</div>
          </div>

          <div className="hero-meta">
            <span>26 &middot; 09 &middot; 26</span>
            <span>Brunei</span>
          </div>
        </div>

        <div className="hero-meta-center">
          <span
            style={{
              fontFamily: 'var(--f-sans)',
              fontSize: '9px',
              letterSpacing: '0.5em',
            }}
          >
            Scroll
          </span>
          <div className="scroll-dot" />
        </div>
      </section>

      {/* ─── INVITATION ─── */}
      <section className="invitation">
        <div className="orn-frame" />
        <div className="inv-eyebrow">Together with their families</div>
        <p className="inv-lead">
          We joyfully invite you to share in the celebration of our wedding as
          we exchange vows and begin our next chapter
        </p>

        <div className="inv-name">Sean</div>
        <div className="inv-full">Yong Shi Hui</div>
        <div className="inv-amp">&amp;</div>
        <div className="inv-name">Faazieqa</div>
        <div className="inv-full">Saang Anak Chabu</div>

        <div className="inv-divider" />

        <div className="inv-date-block">
          <div className="inv-date-num">26</div>
          <div className="inv-date-side">
            <div className="inv-date-label">Saturday</div>
            <div className="inv-date-year">September &middot; 2026</div>
            <div className="inv-date-label">Seven in the evening</div>
          </div>
        </div>
        <div className="inv-location">&mdash; Mawaddah Hall, Setia Point Mall &mdash;</div>
      </section>

      {/* ─── COUNTDOWN ─── */}
      <Countdown />

      {/* ─── DETAILS ─── */}
      <section className="details">
        <div className="sect-label">The Celebration</div>
        <h2 className="sect-title">When &amp; Where</h2>
        {/*<div className="sect-sub">Two occasions &middot; one shared joy</div>*/}
        <div className="sect-sub">one shared joy</div>
        <div className="det-grid">

          {/* Reception */}
          <div className="det-card">
            <div className="det-ic">
              <svg viewBox="0 0 48 48" width="48" height="48">
                <g fill="none" stroke="#a38449" strokeWidth="1" strokeLinecap="round">
                  <path d="M14 20c0 6 4 10 10 10s10-4 10-10" />
                  <path d="M14 20h20" />
                  <path d="M24 30v8M18 38h12" />
                  <path d="M20 14c0-2 1-4 4-4s4 2 4 4" />
                  <circle cx="24" cy="8" r="1.5" fill="#a38449" />
                </g>
              </svg>
            </div>
            <div className="det-kind">The Reception</div>
            <div className="det-name">Wedding Day</div>
            <div className="det-when">Saturday, 26 September 2026</div>
            <div className="det-time">7:00 PM</div>
            <div className="det-sep" />
            <div className="det-venue">
              <strong>Mawaddah Hall</strong>
              Level 7, Setia Point Mall<br />Bandar Seri Begawan, Brunei
            </div>
            {/* <div className="det-addr">Dinner &amp; reception to follow</div> */}
            <div className="det-link-group">
              <a href="https://maps.app.goo.gl/YGqFmipq1G9j2cMu6" className="det-link" target="_blank" rel="noopener noreferrer">View Map</a>
              <a href="https://waze.com/ul/hw8csp7p3w" className="det-link det-link-waze" target="_blank" rel="noopener noreferrer">Waze</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className="timeline-section">
        <div className="sect-label">The Evening</div>
        <h2 className="sect-title">Order of Events</h2>
        <div className="sect-sub">A programme for the reception</div>

        <div className="tl">
          {timeline.map(({ id, time, ampm, event_name, description }) => (
            <div className="tl-row" key={id}>
              <div className="tl-time">{time}<small>{ampm}</small></div>
              <div className="tl-dot-wrap"><div className="tl-dot" /></div>
              <div className="tl-content">
                <div className="tl-event">{event_name}</div>
                <div className="tl-desc">{description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── DRESS CODE ─── */}
      <section className="dresscode">
        <div className="sect-label dc-label">A Gentle Note</div>
        <h2 className="sect-title dc-title">Dress Code</h2>
        <div className="sect-sub dc-sub">Semi-formal &middot; Cocktail attire</div>

        <div className="palette">
          {[
            { name: 'Ivory', color: '#f3ecd8' },
            { name: 'Champagne', color: '#d9c199' },
            { name: 'Sage', color: '#8a9775' },
            { name: 'Burgundy', color: '#5a0f1f' },
            { name: 'Forest', color: '#223118' },
            { name: 'Ink', color: '#1a1410' },
          ].map(({ name, color }) => (
            <div
              key={name}
              className="swatch"
              data-name={name}
              style={{ background: color }}
            />
          ))}
        </div>

        <p className="dc-copy">
          We warmly invite you to dress in tones from our colour palette. Long
          gowns, tailored suits, traditional attire. Whatever feels most
          like you. Kindly avoid white and ivory; these are reserved for the bride.
        </p>
        <div className="dc-note">With love &middot; With elegance</div>
      </section>

      {/* ─── RSVP CTA ─── */}
      <section className="rsvp">
        <div className="sect-label rsvp-label">Kindly respond</div>
        <h2 className="rsvp-title">RSVP</h2>
        <p className="rsvp-lead">
          Your presence is the greatest gift. Please let us know if you&rsquo;ll
          be joining us by
        </p>
        <div className="rsvp-deadline">
          <span>Before</span>
          <strong>31 August 2026</strong>
        </div>
        <div>
          <Link href="/rsvp" className="rsvp-btn">
            Respond Here
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="foot">
        <Link href="/" className="foot-mono" style={{ textDecoration: 'none' }}>
          S<span className="amp">&amp;</span>F
        </Link>
        <div className="foot-tag">with love, forever yours</div>
        <div className="foot-line" />
        <div className="foot-meta">
          Sean &amp; Faazieqa<br />
          26 &middot; 09 &middot; 2026<br />
          Mawaddah Hall, Setia Point Mall
        </div>
      </footer>
    </div>
  )
}
