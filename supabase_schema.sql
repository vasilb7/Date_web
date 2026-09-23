-- ========================================================
-- Date_web: Supabase Table & Security Setup
-- Изпълнете този скрипт в Supabase SQL Editor
-- ========================================================

-- 1. Създаване на таблица за съхранение на отговорите
CREATE TABLE IF NOT EXISTS public.date_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    selected_plan TEXT NOT NULL,
    selected_time TEXT NOT NULL,
    custom_note TEXT,
    status TEXT DEFAULT 'accepted'
);

-- 2. Предоставяне на права на ролите за достъп до таблицата
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.date_responses TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 3. Включване на защита Row Level Security (RLS)
ALTER TABLE public.date_responses ENABLE ROW LEVEL SECURITY;

-- 4. Политика: Позволи на всеки посетител (anon) да изпраща отговор през формата
DROP POLICY IF EXISTS "Allow public insert to date_responses" ON public.date_responses;
CREATE POLICY "Allow public insert to date_responses"
ON public.date_responses
FOR INSERT
TO anon
WITH CHECK (true);

-- 5. Политика: Четене на отговорите през Supabase Dashboard
DROP POLICY IF EXISTS "Allow authenticated read" ON public.date_responses;
CREATE POLICY "Allow authenticated read"
ON public.date_responses
FOR SELECT
TO authenticated
USING (true);
