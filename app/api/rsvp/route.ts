import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, side, relationship, attending, guests_count, message } = body

    if (!name?.trim() || !phone?.trim() || !side || !relationship || !attending) {
      return NextResponse.json(
        { error: 'Name, phone, side, relationship and attendance are required.' },
        { status: 400 }
      )
    }

    const phoneDigits = phone.trim().replace(/\D/g, '')
    if (phoneDigits.length < 7) {
      return NextResponse.json(
        { error: 'Please enter a valid Brunei phone number.' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin.from('rsvps').insert({
      name: name.trim(),
      phone: `+673 ${phone.trim()}`,
      side,
      relationship,
      attending: attending === 'yes',
      guests_count: attending === 'yes' ? Math.max(1, parseInt(guests_count) || 1) : 0,
      message: message?.trim() || null,
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Could not save your RSVP. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('RSVP route error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
