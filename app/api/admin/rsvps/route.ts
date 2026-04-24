import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  // Middleware already validates the session cookie, but double-check here
  const session = request.cookies.get('admin_session')?.value
  const secret = process.env.ADMIN_SECRET

  if (!session || !secret || session !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('rsvps')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch RSVPs.' }, { status: 500 })
  }

  return NextResponse.json({ data })
}
