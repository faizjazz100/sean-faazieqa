-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS rsvps (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name                 TEXT NOT NULL,
  email                TEXT NOT NULL,
  phone                TEXT,
  attending            BOOLEAN NOT NULL,
  guests_count         INTEGER NOT NULL DEFAULT 1,
  dietary_restrictions TEXT,
  message              TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent duplicate RSVPs from the same email
CREATE UNIQUE INDEX IF NOT EXISTS rsvps_email_idx ON rsvps (email);

-- Row-level security (all reads/writes go through the service-role key in API routes)
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- No public access — the Next.js API routes use the service-role key
