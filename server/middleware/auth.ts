import { Request, Response, NextFunction } from 'express';
import { db } from '../db';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    authId: string;
    email: string;
    role: string;
    fullName: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.substring(7);

    const {
      data: { user },
      error,
    } = await db.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { data: dbUser, error: userError } = await db
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .maybeSingle();

    if (userError || !dbUser) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      id: dbUser.id,
      authId: user.id,
      email: user.email || '',
      role: dbUser.role,
      fullName: dbUser.full_name,
    };

    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    const {
      data: { user },
    } = await db.auth.getUser(token);

    if (!user) {
      return next();
    }

    const { data: dbUser } = await db
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .maybeSingle();

    if (dbUser) {
      req.user = {
        id: dbUser.id,
        authId: user.id,
        email: user.email || '',
        role: dbUser.role,
        fullName: dbUser.full_name,
      };
    }

    next();
  } catch {
    next();
  }
};
