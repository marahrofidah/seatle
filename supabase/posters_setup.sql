-- Jalankan di SQL Editor proyek Supabase yang digunakan website.
-- Hanya menyiapkan galeri poster; tidak menghapus data yang sudah ada.
BEGIN;

CREATE TABLE IF NOT EXISTS public.posters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  canva_url TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.posters ENABLE ROW LEVEL SECURITY;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON public.posters TO anon, authenticated;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public'
    AND tablename = 'posters' AND policyname = 'Allow public insert posters') THEN
    CREATE POLICY "Allow public insert posters" ON public.posters
      FOR INSERT TO anon, authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public'
    AND tablename = 'posters' AND policyname = 'Allow public select posters') THEN
    CREATE POLICY "Allow public select posters" ON public.posters
      FOR SELECT TO anon, authenticated USING (true);
  END IF;
END
$$;

NOTIFY pgrst, 'reload schema';
COMMIT;
