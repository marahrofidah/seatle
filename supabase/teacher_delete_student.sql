-- Jalankan setelah teacher_reports_setup.sql. Tidak menghapus murid saat setup.
BEGIN;
CREATE OR REPLACE FUNCTION public.seatle_identity_part(value text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
  SELECT lower(regexp_replace(trim(value), '\s+', ' ', 'g'));
$$;
CREATE TABLE IF NOT EXISTS public.seatle_deleted_students (
  student_name text NOT NULL,
  student_class text NOT NULL,
  deleted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (student_name, student_class)
);
ALTER TABLE public.seatle_deleted_students ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.seatle_deleted_students FROM anon, authenticated;
GRANT SELECT ON public.seatle_deleted_students TO authenticated;
DROP POLICY IF EXISTS "Teachers read deleted identities" ON public.seatle_deleted_students;
CREATE POLICY "Teachers read deleted identities" ON public.seatle_deleted_students
FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.seatle_teachers WHERE user_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.seatle_student_deleted(p_name text, p_class text)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (SELECT 1 FROM public.seatle_deleted_students
    WHERE student_name = public.seatle_identity_part(p_name)
      AND student_class = public.seatle_identity_part(p_class));
$$;
REVOKE ALL ON FUNCTION public.seatle_student_deleted(text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.seatle_student_deleted(text,text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.seatle_guard_deleted_student()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE n text; c text;
BEGIN
  IF TG_TABLE_NAME = 'students' THEN n := NEW.nama; c := NEW.kelas;
  ELSE n := NEW.student_name; c := NEW.student_class;
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(public.seatle_identity_part(n) || chr(31) || public.seatle_identity_part(c), 0));
  IF public.seatle_student_deleted(n,c) THEN
    RAISE EXCEPTION 'SEATLE_STUDENT_DELETED' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS seatle_guard_deleted ON public.students;
CREATE TRIGGER seatle_guard_deleted BEFORE INSERT OR UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.seatle_guard_deleted_student();
DROP TRIGGER IF EXISTS seatle_guard_deleted ON public.student_learning_reports;
CREATE TRIGGER seatle_guard_deleted BEFORE INSERT OR UPDATE ON public.student_learning_reports
FOR EACH ROW EXECUTE FUNCTION public.seatle_guard_deleted_student();

CREATE OR REPLACE FUNCTION public.teacher_delete_student(p_name text, p_class text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE n text := public.seatle_identity_part(p_name); c text := public.seatle_identity_part(p_class);
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (SELECT 1 FROM public.seatle_teachers WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Hanya guru yang boleh menghapus data murid' USING ERRCODE = '42501';
  END IF;
  IF n IS NULL OR c IS NULL OR n = '' OR c = '' THEN RAISE EXCEPTION 'Nama dan kelas wajib diisi'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(n || chr(31) || c, 0));
  INSERT INTO public.seatle_deleted_students(student_name, student_class) VALUES(n,c) ON CONFLICT DO NOTHING;
  DELETE FROM public.student_learning_reports WHERE public.seatle_identity_part(student_name) = n AND public.seatle_identity_part(student_class) = c;
  DELETE FROM public.students WHERE public.seatle_identity_part(nama) = n AND public.seatle_identity_part(kelas) = c;
END;
$$;
REVOKE ALL ON FUNCTION public.teacher_delete_student(text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.teacher_delete_student(text,text) TO authenticated;
NOTIFY pgrst, 'reload schema';
COMMIT;
