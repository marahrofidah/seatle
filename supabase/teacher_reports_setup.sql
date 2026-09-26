-- Jalankan sekali di SQL Editor proyek Supabase website ini.
-- Gunakan email akun guru yang sama dengan VITE_TEACHER_EMAIL.
BEGIN;

CREATE TABLE IF NOT EXISTS public.seatle_teachers (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);
ALTER TABLE public.seatle_teachers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.seatle_teachers FROM anon, authenticated;
GRANT SELECT ON public.seatle_teachers TO authenticated;
DROP POLICY IF EXISTS "Teacher can check own access" ON public.seatle_teachers;
CREATE POLICY "Teacher can check own access" ON public.seatle_teachers
  FOR SELECT TO authenticated USING (user_id = auth.uid());

INSERT INTO public.seatle_teachers (user_id)
  SELECT id FROM auth.users WHERE lower(email) = lower('guru@seatle.local')
  ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.student_learning_reports (
  id UUID PRIMARY KEY,
  student_name TEXT NOT NULL CHECK (length(student_name) BETWEEN 1 AND 100),
  student_class TEXT NOT NULL CHECK (length(student_class) BETWEEN 1 AND 30),
  module TEXT NOT NULL CHECK (module IN ('mengenal-penyu', 'ancaman-penyu', 'peduli-lingkungan', 'aksi-peduli', 'refleksi', 'progress')),
  payload JSONB NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  updated_at TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.student_learning_reports ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.student_learning_reports FROM anon, authenticated;
GRANT INSERT ON public.student_learning_reports TO anon, authenticated;
GRANT SELECT ON public.student_learning_reports TO authenticated;
DROP POLICY IF EXISTS "Students submit learning reports" ON public.student_learning_reports;
CREATE POLICY "Students submit learning reports" ON public.student_learning_reports
  FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Teachers read learning reports" ON public.student_learning_reports;
CREATE POLICY "Teachers read learning reports" ON public.student_learning_reports
  FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.seatle_teachers WHERE user_id = auth.uid()));

-- Rekap hanya menampilkan versi terakhir per nama, kelas, dan modul.
-- security_invoker memastikan kebijakan akses guru tetap berlaku pada view.
CREATE OR REPLACE VIEW public.latest_student_learning_reports
WITH (security_invoker = true) AS
SELECT DISTINCT ON (
  lower(regexp_replace(trim(student_name), '\s+', ' ', 'g')),
  lower(regexp_replace(trim(student_class), '\s+', ' ', 'g')), module
) id, student_name, student_class, module, payload, updated_at
FROM public.student_learning_reports
ORDER BY lower(regexp_replace(trim(student_name), '\s+', ' ', 'g')),
  lower(regexp_replace(trim(student_class), '\s+', ' ', 'g')), module,
  updated_at DESC, received_at DESC, id;
REVOKE ALL ON public.latest_student_learning_reports FROM anon;
GRANT SELECT ON public.latest_student_learning_reports TO authenticated;
NOTIFY pgrst, 'reload schema';
COMMIT;

-- Harus berisi akun guru. Jika kosong, ganti email di INSERT di atas lalu jalankan ulang.
SELECT user_id FROM public.seatle_teachers;
