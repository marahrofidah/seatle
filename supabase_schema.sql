-- =========================================================================
-- SQL SCHEMA FOR SEATLE (LEARN WITH SEA TURTLE, CARE FOR THE OCEAN)
-- =========================================================================

-- 1. Tabel Komitmen Diri (Verbal Commitment)
CREATE TABLE IF NOT EXISTS public.commitments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  statement TEXT NOT NULL,
  action TEXT,
  goal TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Refleksi & Empati Lingkungan (Environmental Sensitivity & Reflection)
CREATE TABLE IF NOT EXISTS public.reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  emoji TEXT,
  reason TEXT,
  answers JSONB,
  type TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Log Tantangan 7 Hari Sahabat Penyu (Challenge Tracker)
CREATE TABLE IF NOT EXISTS public.challenge_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day INT NOT NULL,
  action TEXT NOT NULL,
  caption TEXT NOT NULL,
  photo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Poster Digital Canva (Gallery Kampanye)
CREATE TABLE IF NOT EXISTS public.posters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  canva_url TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Active RLS Policy (Izinkan Public Read & Insert)
ALTER TABLE public.commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert commitments" ON public.commitments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select commitments" ON public.commitments FOR SELECT USING (true);

CREATE POLICY "Allow public insert reflections" ON public.reflections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select reflections" ON public.reflections FOR SELECT USING (true);

CREATE POLICY "Allow public insert challenge_logs" ON public.challenge_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select challenge_logs" ON public.challenge_logs FOR SELECT USING (true);

CREATE POLICY "Allow public insert posters" ON public.posters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select posters" ON public.posters FOR SELECT USING (true);
