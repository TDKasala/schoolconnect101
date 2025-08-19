// Database types for SchoolConnect based on Supabase schema

export type UserRole = 'platform_admin' | 'school_admin' | 'teacher' | 'parent'
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'
export type EventType = 'meeting' | 'exam' | 'activity' | 'training' | 'holiday' | 'other'
export type EventStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
export type EventVisibility = 'public' | 'school' | 'class' | 'private'
export type EvaluationType = 'devoir' | 'interrogation' | 'composition' | 'examen'
export type MessageType = 'direct' | 'group' | 'announcement'
export type NotificationType = 'grade_update' | 'attendance' | 'payment' | 'message' | 'announcement'
export type PaymentType = 'school_fee' | 'registration' | 'other'
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled'
export type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money' | 'card' | 'other'
export type ContactMessageStatus = 'new' | 'read' | 'responded'
export type SubscriptionType = 'flex' | 'forfait'
export type Gender = 'M' | 'F'

// Core entities
export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  school_id?: string
  phone?: string
  avatar_url?: string
  is_active: boolean
  approved: boolean
  user_status_id?: number
  created_at: string
  updated_at: string
}

export interface School {
  id: string
  name: string
  address: string
  city: string
  province: string
  country: string
  phone: string
  email: string
  website?: string
  logo_url?: string
  subscription_type: SubscriptionType
  max_students: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  school_id: string
  name: string
  level: string
  section?: string
  capacity: number
  teacher_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  school_id: string
  class_id: string
  first_name: string
  last_name: string
  date_of_birth?: string
  gender?: Gender
  parent_email?: string
  parent_phone?: string
  address?: string
  enrollment_date: string
  student_id: string
  photo_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Teacher {
  id: string
  school_id: string
  employee_id: string
  specialization?: string
  hire_date: string
  salary?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  student_id: string
  class_id: string
  date: string
  status: AttendanceStatus
  teacher_id?: string
  notes?: string
  created_at: string
}

export interface Grade {
  id: string
  student_id: string
  class_id: string
  subject: string
  grade?: number
  evaluation_type?: EvaluationType
  teacher_id: string
  date: string
  comment?: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  school_id?: string
  class_id?: string
  created_by: string
  title: string
  description?: string
  start_date: string
  end_date: string
  location?: string
  event_type: EventType
  is_all_day: boolean
  is_recurring: boolean
  recurrence_rule?: string
  attendees?: string[]
  status: EventStatus
  visibility: EventVisibility
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id?: string
  class_id?: string
  school_id?: string
  content: string
  type: MessageType
  subject?: string
  is_read: boolean
  read: boolean
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  school_id: string
  student_id?: string
  type: PaymentType
  amount: number
  currency: string
  status: PaymentStatus
  due_date: string
  paid_date?: string
  payment_date?: string
  description?: string
  reference_number?: string
  payment_method: PaymentMethod
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  content: string
  is_read: boolean
  related_id?: string
  related_type?: string
  created_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  school_id?: string
  action: string
  target: string
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: ContactMessageStatus
  created_at: string
}

export interface PlatformSettings {
  id: string
  platform_name: string
  contact_email: string
  primary_color: string
  support_url?: string
  branding?: Record<string, any>
  security?: Record<string, any>
  data_privacy?: Record<string, any>
  access_control?: Record<string, any>
  ai?: Record<string, any>
  billing?: Record<string, any>
  communication?: Record<string, any>
  dashboards?: Record<string, any>
  updated_at: string
}

export interface Role {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface UserStatus {
  id: string
  status_name: string
  status_display_name: string
  status_description?: string
  created_at: string
  updated_at: string
}

// Database schema type for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id'>>
      }
      schools: {
        Row: School
        Insert: Omit<School, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<School, 'id'>>
      }
      classes: {
        Row: Class
        Insert: Omit<Class, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Class, 'id'>>
      }
      students: {
        Row: Student
        Insert: Omit<Student, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Student, 'id'>>
      }
      teachers: {
        Row: Teacher
        Insert: Omit<Teacher, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Teacher, 'id'>>
      }
      attendance: {
        Row: Attendance
        Insert: Omit<Attendance, 'id' | 'created_at'>
        Update: Partial<Omit<Attendance, 'id'>>
      }
      grades: {
        Row: Grade
        Insert: Omit<Grade, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Grade, 'id'>>
      }
      events: {
        Row: Event
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Event, 'id'>>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Message, 'id'>>
      }
      payments: {
        Row: Payment
        Insert: Omit<Payment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Payment, 'id'>>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'id' | 'created_at'>
        Update: Partial<Omit<Notification, 'id'>>
      }
      activity_logs: {
        Row: ActivityLog
        Insert: Omit<ActivityLog, 'id' | 'created_at'>
        Update: Partial<Omit<ActivityLog, 'id'>>
      }
      contact_messages: {
        Row: ContactMessage
        Insert: Omit<ContactMessage, 'id' | 'created_at'>
        Update: Partial<Omit<ContactMessage, 'id'>>
      }
      platform_settings: {
        Row: PlatformSettings
        Insert: Omit<PlatformSettings, 'updated_at'>
        Update: Partial<PlatformSettings>
      }
      roles: {
        Row: Role
        Insert: Omit<Role, 'id' | 'created_at'>
        Update: Partial<Omit<Role, 'id'>>
      }
      user_status: {
        Row: UserStatus
        Insert: Omit<UserStatus, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserStatus, 'id'>>
      }
    }
  }
}
