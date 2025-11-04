-- Run this in Vercel Postgres SQL console

CREATE TABLE IF NOT EXISTS tenant_config (
  id SERIAL PRIMARY KEY,
  portal_domain TEXT NOT NULL,
  member_id TEXT,
  user_id TEXT,
  mobile TEXT NOT NULL,
  config_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (portal_domain,user_id)
);