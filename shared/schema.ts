import { z } from 'zod';

export const UserRoles = z.enum(['citizen', 'staff', 'deputy', 'admin']);
export type UserRole = z.infer<typeof UserRoles>;

export const RequestStatuses = z.enum(['pending', 'in_progress', 'resolved', 'rejected', 'closed']);
export type RequestStatus = z.infer<typeof RequestStatuses>;

export const RequestPriorities = z.enum(['low', 'normal', 'high', 'urgent']);
export type RequestPriority = z.infer<typeof RequestPriorities>;

// Auth schemas
export const SignUpSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  full_name: z.string().min(3, 'الاسم الكامل مطلوب'),
  phone: z.string().optional(),
  role: UserRoles.default('citizen'),
  national_id: z.string().optional(),
});

export const SignInSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export const UpdateProfileSchema = z.object({
  full_name: z.string().min(3).optional(),
  phone: z.string().optional(),
  avatar_url: z.string().url().optional(),
  region: z.string().optional(),
});

// Request schemas
export const CreateRequestSchema = z.object({
  category_id: z.string().uuid('معرف الفئة غير صحيح'),
  title: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل'),
  description: z.string().min(20, 'الوصف يجب أن يكون 20 حرفاً على الأقل'),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  location_text: z.string().optional(),
  priority: RequestPriorities.optional(),
});

export const UpdateRequestSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(20).optional(),
  status: RequestStatuses.optional(),
  priority: RequestPriorities.optional(),
  resolution_notes: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  feedback: z.string().optional(),
});

export const CreateAssignmentSchema = z.object({
  request_id: z.string().uuid(),
  assigned_to: z.string().uuid('معرف المستخدم غير صحيح'),
  priority: RequestPriorities.optional(),
  notes: z.string().optional(),
  due_date: z.string().datetime().optional(),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

// Database schemas (for type generation)
export const UserSchema = z.object({
  id: z.string().uuid(),
  auth_id: z.string().uuid().optional(),
  email: z.string().email(),
  full_name: z.string(),
  phone: z.string().optional(),
  role: UserRoles,
  national_id: z.string().optional(),
  avatar_url: z.string().optional(),
  region: z.string().optional(),
  is_active: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

export const RequestSchema = z.object({
  id: z.string().uuid(),
  request_code: z.string(),
  user_id: z.string().uuid(),
  category_id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  status: RequestStatuses,
  priority: RequestPriorities,
  location: z.record(z.any()).optional(),
  location_text: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
  attachment_count: z.number(),
  resolution_notes: z.string().optional(),
  resolved_at: z.string().datetime().optional(),
  rating: z.number().optional(),
  feedback: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Request = z.infer<typeof RequestSchema>;

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  created_at: z.string().datetime(),
});

export type Category = z.infer<typeof CategorySchema>;

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  request_id: z.string().uuid().optional(),
  type: z.enum(['request_update', 'assignment', 'message', 'reminder']),
  title: z.string(),
  message: z.string(),
  is_read: z.boolean(),
  action_url: z.string().optional(),
  created_at: z.string().datetime(),
});

export type Notification = z.infer<typeof NotificationSchema>;

export const AssignmentSchema = z.object({
  id: z.string().uuid(),
  request_id: z.string().uuid(),
  assigned_to: z.string().uuid(),
  assigned_by: z.string().uuid(),
  priority: RequestPriorities,
  status: z.enum(['pending', 'in_progress', 'completed', 'rejected']),
  notes: z.string().optional(),
  due_date: z.string().datetime().optional(),
  completed_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Assignment = z.infer<typeof AssignmentSchema>;
