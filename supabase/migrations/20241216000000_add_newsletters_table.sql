-- Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  html_content TEXT NOT NULL,
  sources TEXT[] NOT NULL,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'sent', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Add index for faster queries
CREATE INDEX idx_newsletters_status ON newsletters(status);
CREATE INDEX idx_newsletters_created_at ON newsletters(created_at DESC);

-- Add RLS policies
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

-- Allow all operations (since this is admin-only, we'll control access via API)
CREATE POLICY "Enable all access for newsletters" ON newsletters
  FOR ALL USING (true);
