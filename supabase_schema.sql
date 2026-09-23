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

-- 2. Включване на защита Row Level Security (RLS)
ALTER TABLE public.date_responses ENABLE ROW LEVEL SECURITY;

-- 3. Политика: Позволи на всеки посетител (anon) да изпраща отговор през формата
CREATE POLICY "Allow public insert to date_responses"
ON public.date_responses
FOR INSERT
TO anon
WITH CHECK (true);

-- 4. Политика: Четене на отговорите през Supabase Dashboard
CREATE POLICY "Allow authenticated read"
ON public.date_responses
FOR SELECT
TO authenticated
USING (true);
