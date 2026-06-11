-- ============================================================
-- EXIT EXAM APP — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  university TEXT,
  department TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  is_verified BOOLEAN DEFAULT FALSE,
  streak INTEGER DEFAULT 0,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SUBJECTS
-- ============================================================
CREATE TABLE public.subjects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  gradient TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- QUESTIONS
-- ============================================================
CREATE TABLE public.questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  topic TEXT NOT NULL,
  chapter TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- ["option A", "option B", "option C", "option D"]
  correct_answer INTEGER NOT NULL CHECK (correct_answer BETWEEN 0 AND 3),
  explanation TEXT,
  year INTEGER, -- exam year if from past paper
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_subject ON public.questions(subject_id);
CREATE INDEX idx_questions_difficulty ON public.questions(difficulty);

-- ============================================================
-- EXAMS
-- ============================================================
CREATE TABLE public.exams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  exam_type TEXT NOT NULL CHECK (exam_type IN ('university-exit', 'departmental-exit', 'national-exit', 'practice')),
  subject_id UUID REFERENCES public.subjects(id),
  total_questions INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  pass_mark INTEGER DEFAULT 50,
  negative_marking BOOLEAN DEFAULT FALSE,
  negative_mark_value NUMERIC(3,2) DEFAULT 0.25,
  instructions TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction: which questions belong to which exam
CREATE TABLE public.exam_questions (
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  order_num INTEGER,
  PRIMARY KEY (exam_id, question_id)
);

-- ============================================================
-- EXAM SESSIONS (user attempts)
-- ============================================================
CREATE TABLE public.exam_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  exam_id UUID REFERENCES public.exams(id),
  subject_id UUID REFERENCES public.subjects(id),
  exam_type TEXT NOT NULL,
  status TEXT DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'paused', 'completed')),
  answers JSONB DEFAULT '{}', -- { "question_id": answer_index }
  marked_for_review JSONB DEFAULT '[]',
  current_question INTEGER DEFAULT 0,
  time_remaining INTEGER, -- seconds
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON public.exam_sessions(user_id);

-- ============================================================
-- RESULTS
-- ============================================================
CREATE TABLE public.results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.exam_sessions(id),
  exam_id UUID REFERENCES public.exams(id),
  subject_id UUID REFERENCES public.subjects(id),
  exam_type TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  incorrect_answers INTEGER NOT NULL DEFAULT 0,
  skipped_questions INTEGER NOT NULL DEFAULT 0,
  score NUMERIC(5,2) NOT NULL DEFAULT 0,
  percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  grade TEXT,
  passed BOOLEAN DEFAULT FALSE,
  time_taken INTEGER, -- seconds
  question_results JSONB, -- detailed per-question results
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_results_user ON public.results(user_id);
CREATE INDEX idx_results_subject ON public.results(subject_id);

-- ============================================================
-- USER PROGRESS (aggregated)
-- ============================================================
CREATE TABLE public.user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  overall_score NUMERIC(5,2) DEFAULT 0,
  total_exams_taken INTEGER DEFAULT 0,
  total_questions_answered INTEGER DEFAULT 0,
  average_score NUMERIC(5,2) DEFAULT 0,
  streak INTEGER DEFAULT 0,
  rank INTEGER,
  subject_progress JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BOOKMARKS
-- ============================================================
CREATE TABLE public.bookmarks (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, question_id)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('exam', 'result', 'update', 'system', 'assignment')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(user_id, is_read);

-- Broadcast notifications (no user_id = for everyone)
-- Fetched by joining WHERE user_id = auth.uid() OR user_id IS NULL

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
CREATE TABLE public.announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'update' CHECK (type IN ('exam', 'update', 'system')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- UNIVERSITIES
-- ============================================================
CREATE TABLE public.universities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  short_name TEXT,
  city TEXT,
  region TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Questions (public read)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active questions" ON public.questions FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage questions" ON public.questions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Subjects (public read)
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active subjects" ON public.subjects FOR SELECT USING (is_active = TRUE);

-- Exam sessions (own only)
ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own sessions" ON public.exam_sessions FOR ALL USING (auth.uid() = user_id);

-- Results (own only)
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own results" ON public.results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own results" ON public.results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Progress (own only)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

-- Bookmarks (own only)
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);

-- Notifications (own + broadcast)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (
  auth.uid() = user_id OR user_id IS NULL
);
CREATE POLICY "Users can mark own notifications read" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Announcements (public read)
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active announcements" ON public.announcements FOR SELECT USING (is_active = TRUE);

-- Universities (public read)
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read universities" ON public.universities FOR SELECT USING (is_active = TRUE);

-- Exams (public read)
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active exams" ON public.exams FOR SELECT USING (is_active = TRUE);

-- ============================================================
-- SEED: Ethiopian Universities
-- ============================================================
INSERT INTO public.universities (name, city, region) VALUES
  ('Addis Ababa University', 'Addis Ababa', 'Addis Ababa'),
  ('Adama Science and Technology University', 'Adama', 'Oromia'),
  ('Jimma University', 'Jimma', 'Oromia'),
  ('Bahir Dar University', 'Bahir Dar', 'Amhara'),
  ('Haramaya University', 'Haramaya', 'Oromia'),
  ('Hawassa University', 'Hawassa', 'Sidama'),
  ('Mekelle University', 'Mekelle', 'Tigray'),
  ('Gondar University', 'Gondar', 'Amhara'),
  ('Rift Valley University', 'Addis Ababa', 'Addis Ababa'),
  ('Ambo University', 'Ambo', 'Oromia'),
  ('Wollega University', 'Nekemte', 'Oromia'),
  ('Arsi University', 'Asella', 'Oromia'),
  ('Dilla University', 'Dilla', 'SNNPR'),
  ('Debre Berhan University', 'Debre Berhan', 'Amhara'),
  ('Wollo University', 'Dessie', 'Amhara'),
  ('Dire Dawa University', 'Dire Dawa', 'Dire Dawa'),
  ('Aksum University', 'Aksum', 'Tigray'),
  ('Madda Walabu University', 'Bale Robe', 'Oromia'),
  ('Wolaita Sodo University', 'Wolaita Sodo', 'SNNPR'),
  ('Samara University', 'Samara', 'Afar'),
  ('Debre Markos University', 'Debre Markos', 'Amhara'),
  ('Assosa University', 'Assosa', 'Benishangul-Gumuz'),
  ('Jijiga University', 'Jijiga', 'Somali'),
  ('Bule Hora University', 'Bule Hora', 'Oromia'),
  ('Mizan-Tepi University', 'Mizan-Teferi', 'SNNPR'),
  ('Wachemo University', 'Hossana', 'SNNPR'),
  ('Mettu University', 'Mettu', 'Oromia'),
  ('Gambella University', 'Gambella', 'Gambella'),
  ('Wolkite University', 'Wolkite', 'SNNPR'),
  ('St. Mary''s University', 'Addis Ababa', 'Addis Ababa'),
  ('Unity University', 'Addis Ababa', 'Addis Ababa'),
  ('Kotebe Metropolitan University', 'Addis Ababa', 'Addis Ababa'),
  ('Ethiopian Civil Service University', 'Addis Ababa', 'Addis Ababa');

-- ============================================================
-- SEED: Subjects
-- ============================================================
INSERT INTO public.subjects (slug, name, icon, gradient) VALUES
  ('general-knowledge', 'General Knowledge', 'BookOpen', 'from-blue-500 to-blue-700'),
  ('english', 'English', 'Languages', 'from-purple-500 to-purple-700'),
  ('mathematics', 'Mathematics', 'Calculator', 'from-green-500 to-green-700'),
  ('computer-science', 'Computer Science', 'Monitor', 'from-cyan-500 to-cyan-700'),
  ('economics', 'Economics', 'TrendingUp', 'from-yellow-500 to-yellow-700'),
  ('nursing', 'Nursing', 'Heart', 'from-pink-500 to-pink-700'),
  ('medicine', 'Medicine', 'Stethoscope', 'from-red-500 to-red-700'),
  ('engineering', 'Engineering', 'Wrench', 'from-orange-500 to-orange-700'),
  ('law', 'Law', 'Scale', 'from-slate-500 to-slate-700'),
  ('accounting', 'Accounting', 'DollarSign', 'from-emerald-500 to-emerald-700'),
  ('management', 'Management', 'Users', 'from-indigo-500 to-indigo-700'),
  ('agriculture', 'Agriculture', 'Leaf', 'from-lime-500 to-lime-700'),
  ('health-sciences', 'Health Sciences', 'Activity', 'from-teal-500 to-teal-700'),
  ('information-technology', 'Information Technology', 'Cpu', 'from-violet-500 to-violet-700'),
  ('teacher-education', 'Teacher Education', 'GraduationCap', 'from-amber-500 to-amber-700'),
  ('physics', 'Physics', 'Zap', 'from-sky-500 to-sky-700'),
  ('chemistry', 'Chemistry', 'FlaskConical', 'from-fuchsia-500 to-fuchsia-700'),
  ('biology', 'Biology', 'Dna', 'from-green-600 to-green-800');
