import { Router } from 'express';
import { db, dbQueries } from '../db';
import { SignUpSchema, SignInSchema, UpdateProfileSchema } from '../../shared/schema';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/signup', async (req, res) => {
  try {
    const validatedData = SignUpSchema.parse(req.body);

    const { data, error } = await db.auth.signUpWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data.user) {
      return res.status(400).json({ error: 'Failed to create user' });
    }

    const { data: dbUser, error: createError } = await dbQueries.users.create({
      auth_id: data.user.id,
      email: validatedData.email,
      full_name: validatedData.full_name,
      phone: validatedData.phone,
      role: validatedData.role,
      national_id: validatedData.national_id,
    });

    if (createError || !dbUser) {
      await db.auth.admin.deleteUser(data.user.id);
      return res.status(400).json({ error: 'Failed to create user profile' });
    }

    const { data: sessionData } = await db.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    res.status(201).json({
      success: true,
      data: {
        user: dbUser,
        session: sessionData.session,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Signup failed' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const validatedData = SignInSchema.parse(req.body);

    const { data, error } = await db.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!data.user || !data.session) {
      return res.status(401).json({ error: 'Failed to sign in' });
    }

    const { data: dbUser } = await dbQueries.users.findByAuthId(data.user.id);

    res.json({
      success: true,
      data: {
        user: dbUser,
        session: data.session,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Sign in failed' });
  }
});

router.post('/signout', authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.substring(7);

    if (token) {
      await db.auth.signOut();
    }

    res.json({ success: true, message: 'Signed out successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Sign out failed' });
  }
});

router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { data: user } = await dbQueries.users.findById(req.user.id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to fetch user' });
  }
});

router.put('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const validatedData = UpdateProfileSchema.parse(req.body);

    const { data: user, error } = await dbQueries.users.update(
      req.user.id,
      validatedData
    );

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to update profile' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const { data, error } = await db.auth.refreshSession({
      refresh_token,
    });

    if (error || !data.session) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    res.json({
      success: true,
      data: {
        session: data.session,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Refresh failed' });
  }
});

export default router;
