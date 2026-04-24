import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

function isAuthed(req: NextRequest) {
  const session = req.cookies.get('admin_session')?.value
  return session && session === process.env.ADMIN_SECRET
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('timeline_events')
    .select('*')
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { time, ampm, event_name, description } = await req.json()
  if (!time || !ampm || !event_name || !description) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  const { data: last } = await supabaseAdmin
    .from('timeline_events')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const sort_order = (last?.sort_order ?? 0) + 1

  const { data, error } = await supabaseAdmin
    .from('timeline_events')
    .insert({ time, ampm, event_name, description, sort_order })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
