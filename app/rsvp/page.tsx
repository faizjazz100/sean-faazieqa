import Link from 'next/link'
import RSVPForm from '@/components/RSVPForm'

export const metadata = {
  title: 'RSVP · Sean & Faazieqa',
}

export default function RSVPPage() {
  return (
    <div className="rsvp-page">
      <div className="rsvp-page-wrap">
        {/* Header */}
        <div className="rsvp-page-header">
          <Link href="/" className="monogram" style={{ textDecoration: 'none' }}>
            S<span className="amp">&amp;</span>F
          </Link>
          <div className="rsvp-page-title">RSVP</div>
          <div className="rsvp-page-sub">
            26 September 2026 &middot;
          </div>
          <div className="rsvp-page-sub">
            Mawaddah Hall, Setia Point Mall
          </div>
        </div>

        {/* Form */}
        <RSVPForm />

        {/* Footer link */}
        <div style={{ textAlign: 'center', paddingBottom: '48px' }}>
          <Link href="/" className="back-link">
            &larr; Back to invitation
          </Link>
        </div>
      </div>
    </div>
  )
}
