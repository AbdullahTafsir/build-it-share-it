
-- Settings (single row, id=1)
CREATE TABLE public.app_settings (
  id INTEGER PRIMARY KEY,
  shift_start TEXT NOT NULL DEFAULT '07:00',
  shift_end TEXT NOT NULL DEFAULT '18:00',
  num_cutters INTEGER NOT NULL DEFAULT 2,
  breaks JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  buyer TEXT,
  description TEXT,
  default_cut_dur INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.lays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_date DATE NOT NULL,
  priority INTEGER,
  session TEXT,
  lay_no TEXT,
  style TEXT,
  buyer TEXT,
  color TEXT,
  plies INTEGER,
  spreader INTEGER,
  spread_start TEXT,
  spread_dur INTEGER,
  cut_dur INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_lays_plan_date ON public.lays(plan_date);

CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  plan_date DATE NOT NULL,
  settings JSONB,
  input_lays JSONB,
  result JSONB,
  idle_windows JSONB,
  summary JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_plans_created_at ON public.plans(created_at DESC);

CREATE TABLE public.activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  detail TEXT,
  user_name TEXT,
  ts TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_activity_ts ON public.activity(ts DESC);

-- Grants: shared app, public access via anon
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_settings TO anon, authenticated;
GRANT ALL ON public.app_settings TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.styles TO anon, authenticated;
GRANT ALL ON public.styles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lays TO anon, authenticated;
GRANT ALL ON public.lays TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.plans TO anon, authenticated;
GRANT ALL ON public.plans TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity TO anon, authenticated;
GRANT ALL ON public.activity TO service_role;

-- RLS: enable with permissive public policies (shared planning tool)
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public all" ON public.app_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public all" ON public.styles       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public all" ON public.lays         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public all" ON public.plans        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public all" ON public.activity     FOR ALL USING (true) WITH CHECK (true);
