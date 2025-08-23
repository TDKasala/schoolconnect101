-- Row Level Security Policies for School Tables
-- This migration creates RLS policies to ensure school admins only see their school's data

BEGIN;

-- Enable RLS on all school tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's school_id
CREATE OR REPLACE FUNCTION public.get_user_school_id()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT school_id 
    FROM public.users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is platform admin
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT role = 'platform_admin' 
    FROM public.users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STUDENTS TABLE POLICIES
CREATE POLICY "Platform admins can view all students" ON public.students
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "School admins can view their school students" ON public.students
  FOR SELECT USING (school_id = public.get_user_school_id());

CREATE POLICY "Teachers can view students in their school" ON public.students
  FOR SELECT USING (
    school_id = public.get_user_school_id() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('school_admin', 'teacher'))
  );

CREATE POLICY "School admins can manage their school students" ON public.students
  FOR ALL USING (
    school_id = public.get_user_school_id() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'school_admin')
  );

-- TEACHERS TABLE POLICIES
CREATE POLICY "Platform admins can view all teachers" ON public.teachers
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "School admins can view their school teachers" ON public.teachers
  FOR SELECT USING (school_id = public.get_user_school_id());

CREATE POLICY "School admins can manage their school teachers" ON public.teachers
  FOR ALL USING (
    school_id = public.get_user_school_id() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'school_admin')
  );

-- CLASSES TABLE POLICIES
CREATE POLICY "Platform admins can view all classes" ON public.classes
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "School users can view their school classes" ON public.classes
  FOR SELECT USING (
    school_id = public.get_user_school_id() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('school_admin', 'teacher'))
  );

CREATE POLICY "School admins can manage their school classes" ON public.classes
  FOR ALL USING (
    school_id = public.get_user_school_id() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'school_admin')
  );

-- ATTENDANCE TABLE POLICIES
CREATE POLICY "Platform admins can view all attendance" ON public.attendance
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "School users can view their school attendance" ON public.attendance
  FOR SELECT USING (
    school_id = public.get_user_school_id() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('school_admin', 'teacher'))
  );

CREATE POLICY "School users can manage their school attendance" ON public.attendance
  FOR ALL USING (
    school_id = public.get_user_school_id() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('school_admin', 'teacher'))
  );

-- SUBJECTS TABLE POLICIES
CREATE POLICY "Platform admins can view all subjects" ON public.subjects
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "School users can view their school subjects" ON public.subjects
  FOR SELECT USING (
    school_id = public.get_user_school_id() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('school_admin', 'teacher'))
  );

CREATE POLICY "School admins can manage their school subjects" ON public.subjects
  FOR ALL USING (
    school_id = public.get_user_school_id() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'school_admin')
  );

-- GRADES TABLE POLICIES
CREATE POLICY "Platform admins can view all grades" ON public.grades
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "School users can view their school grades" ON public.grades
  FOR SELECT USING (
    school_id = public.get_user_school_id() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('school_admin', 'teacher'))
  );

CREATE POLICY "School users can manage their school grades" ON public.grades
  FOR ALL USING (
    school_id = public.get_user_school_id() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('school_admin', 'teacher'))
  );

-- PAYMENTS TABLE POLICIES
CREATE POLICY "Platform admins can view all payments" ON public.payments
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "School users can view their school payments" ON public.payments
  FOR SELECT USING (
    school_id = public.get_user_school_id() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('school_admin', 'teacher'))
  );

CREATE POLICY "School admins can manage their school payments" ON public.payments
  FOR ALL USING (
    school_id = public.get_user_school_id() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'school_admin')
  );

-- EVENTS TABLE POLICIES
CREATE POLICY "Platform admins can view all events" ON public.events
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "School users can view their school events" ON public.events
  FOR SELECT USING (
    school_id = public.get_user_school_id() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('school_admin', 'teacher'))
  );

CREATE POLICY "School admins can manage their school events" ON public.events
  FOR ALL USING (
    school_id = public.get_user_school_id() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'school_admin')
  );

-- MESSAGES TABLE POLICIES
CREATE POLICY "Platform admins can view all messages" ON public.messages
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "School users can view their school messages" ON public.messages
  FOR SELECT USING (
    school_id = public.get_user_school_id() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('school_admin', 'teacher'))
  );

CREATE POLICY "School users can manage their school messages" ON public.messages
  FOR ALL USING (
    school_id = public.get_user_school_id() AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('school_admin', 'teacher'))
  );

COMMIT;
