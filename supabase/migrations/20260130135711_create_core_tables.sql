/*
  # Create Core Tables for Civil Rights Platform
  
  1. New Tables
    - `users` - تخزين بيانات المستخدمين (مواطنين، موظفين، نواب)
    - `requests` - الطلبات والشكاوى المقدمة
    - `request_attachments` - المرفقات مع الطلبات
    - `request_history` - سجل تطورات الطلب
    - `categories` - تصنيفات الخدمات
    - `assignments` - تكليف الطلبات للموظفين
    - `notifications` - تخزين الإشعارات
    
  2. Security
    - Enable RLS على جميع الجداول
    - إنشاء سياسات أمان شاملة
    - حماية بيانات المستخدمين
    
  3. Relationships
    - Users → Requests (One to Many)
    - Requests → Attachments (One to Many)
    - Requests → History (One to Many)
    - Requests → Assignments (One to Many)
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('citizen', 'staff', 'deputy', 'admin')),
  national_id TEXT UNIQUE,
  avatar_url TEXT,
  region TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Request Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Requests table
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_code TEXT UNIQUE NOT NULL DEFAULT concat('REQ-', to_char(now(), 'YYYYMMDDHH24MISS'), '-', substr(gen_random_uuid()::text, 1, 6)),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected', 'closed')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  location JSONB,
  location_text TEXT,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  attachment_count INT DEFAULT 0,
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Request Attachments
CREATE TABLE IF NOT EXISTS request_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INT,
  file_type TEXT,
  file_url TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Request History/Timeline
CREATE TABLE IF NOT EXISTS request_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_by UUID NOT NULL REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Task Assignments
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES users(id),
  priority TEXT DEFAULT 'normal',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
  notes TEXT,
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('request_update', 'assignment', 'message', 'reminder')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_id);

CREATE POLICY "Public can view user names for requests"
  ON users FOR SELECT
  TO anon
  USING (role != 'admin');

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_id)
  WITH CHECK (auth.uid() = auth_id);

-- RLS Policies for Requests
CREATE POLICY "Users can view own requests"
  ON requests FOR SELECT
  TO authenticated
  USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Staff can view assigned requests"
  ON requests FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM users WHERE auth_id = auth.uid()) IN ('staff', 'deputy', 'admin') OR
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can create requests"
  ON requests FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Staff can update requests"
  ON requests FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM users WHERE auth_id = auth.uid()) IN ('staff', 'deputy', 'admin')
  )
  WITH CHECK (
    (SELECT role FROM users WHERE auth_id = auth.uid()) IN ('staff', 'deputy', 'admin')
  );

-- RLS Policies for Attachments
CREATE POLICY "Users can view own attachments"
  ON request_attachments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM requests
      WHERE requests.id = request_attachments.request_id
      AND (requests.user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
           OR EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('staff', 'deputy', 'admin')))
    )
  );

CREATE POLICY "Users can upload attachments"
  ON request_attachments FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- RLS Policies for Categories
CREATE POLICY "Categories are public"
  ON categories FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for Notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO service_role
  WITH CHECK (true);

-- RLS Policies for History
CREATE POLICY "Users can view request history"
  ON request_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM requests
      WHERE requests.id = request_history.request_id
      AND (requests.user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
           OR EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('staff', 'deputy', 'admin')))
    )
  );

-- RLS Policies for Assignments
CREATE POLICY "Assigned users can view assignments"
  ON assignments FOR SELECT
  TO authenticated
  USING (
    assigned_to = (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    (SELECT role FROM users WHERE auth_id = auth.uid()) IN ('deputy', 'admin')
  );

-- Create indexes for performance
CREATE INDEX idx_requests_user_id ON requests(user_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);
CREATE INDEX idx_requests_assigned_to ON requests(assigned_to);
CREATE INDEX idx_assignments_assigned_to ON assignments(assigned_to);
CREATE INDEX idx_assignments_status ON assignments(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_request_history_request_id ON request_history(request_id);
