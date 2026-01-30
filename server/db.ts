import { createClient } from '@supabase/supabase-js';
import type {
  User,
  Request,
  Category,
  Notification,
  Assignment,
} from '../shared/schema';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration');
}

export const db = createClient(supabaseUrl, supabaseServiceKey);

// Type-safe database helpers
export const dbQueries = {
  users: {
    findByEmail: async (email: string) => {
      const { data, error } = await db
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      return { data, error };
    },

    findById: async (id: string) => {
      const { data, error } = await db
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      return { data, error };
    },

    findByAuthId: async (authId: string) => {
      const { data, error } = await db
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .maybeSingle();
      return { data, error };
    },

    create: async (userData: Partial<User>) => {
      const { data, error } = await db
        .from('users')
        .insert([userData])
        .select()
        .single();
      return { data, error };
    },

    update: async (id: string, userData: Partial<User>) => {
      const { data, error } = await db
        .from('users')
        .update(userData)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },

    list: async (role?: string) => {
      let query = db.from('users').select('*');
      if (role) {
        query = query.eq('role', role);
      }
      const { data, error } = await query;
      return { data, error };
    },
  },

  requests: {
    findById: async (id: string) => {
      const { data, error } = await db
        .from('requests')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      return { data, error };
    },

    findByCode: async (code: string) => {
      const { data, error } = await db
        .from('requests')
        .select('*')
        .eq('request_code', code)
        .maybeSingle();
      return { data, error };
    },

    list: async (userId: string, limit = 20, offset = 0) => {
      const { data, error, count } = await db
        .from('requests')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      return { data, error, count };
    },

    listAll: async (limit = 50, offset = 0, filters?: Record<string, any>) => {
      let query = db.from('requests').select('*', { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      return { data, error, count };
    },

    create: async (requestData: Partial<Request>) => {
      const { data, error } = await db
        .from('requests')
        .insert([requestData])
        .select()
        .single();
      return { data, error };
    },

    update: async (id: string, requestData: Partial<Request>) => {
      const { data, error } = await db
        .from('requests')
        .update(requestData)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },

    delete: async (id: string) => {
      const { error } = await db.from('requests').delete().eq('id', id);
      return { error };
    },
  },

  categories: {
    list: async () => {
      const { data, error } = await db
        .from('categories')
        .select('*')
        .order('name');
      return { data, error };
    },

    findById: async (id: string) => {
      const { data, error } = await db
        .from('categories')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      return { data, error };
    },

    create: async (categoryData: Partial<Category>) => {
      const { data, error } = await db
        .from('categories')
        .insert([categoryData])
        .select()
        .single();
      return { data, error };
    },
  },

  assignments: {
    list: async (userId?: string) => {
      let query = db.from('assignments').select('*');
      if (userId) {
        query = query.eq('assigned_to', userId);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      return { data, error };
    },

    create: async (assignmentData: Partial<Assignment>) => {
      const { data, error } = await db
        .from('assignments')
        .insert([assignmentData])
        .select()
        .single();
      return { data, error };
    },

    update: async (id: string, assignmentData: Partial<Assignment>) => {
      const { data, error } = await db
        .from('assignments')
        .update(assignmentData)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
  },

  notifications: {
    create: async (notificationData: Partial<Notification>) => {
      const { data, error } = await db
        .from('notifications')
        .insert([notificationData])
        .select()
        .single();
      return { data, error };
    },

    list: async (userId: string) => {
      const { data, error } = await db
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      return { data, error };
    },

    markAsRead: async (id: string) => {
      const { data, error } = await db
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
  },

  history: {
    create: async (historyData: any) => {
      const { data, error } = await db
        .from('request_history')
        .insert([historyData])
        .select()
        .single();
      return { data, error };
    },

    list: async (requestId: string) => {
      const { data, error } = await db
        .from('request_history')
        .select('*')
        .eq('request_id', requestId)
        .order('created_at', { ascending: false });
      return { data, error };
    },
  },
};
