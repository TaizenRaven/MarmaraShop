import { Router, Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../services/auth.service';
import { handleError, ValidationError, NotFoundError, AppError } from '../utils/errors';

const router = Router();
const authService = new AuthService();

const JWT_SECRET = process.env.MEDUSA_JWT_SECRET || 'your_jwt_secret_key_here_min_32_chars';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your_admin_jwt_secret_key_min_32_chars';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret_min_32_chars';

// Store authenticated admin sessions (in production, use Redis)
const activeSessions: Map<string, { userId: string; email: string; role: string; expiresAt: Date }> = new Map();

/**
 * POST /api/admin/auth/login
 * Admin login endpoint
 * Body: { email, password }
 */
router.post('/api/admin/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError('Missing required fields', {
        email: email ? [] : ['Email is required'],
        password: password ? [] : ['Password is required'],
      });
    }

    // For demo: accept credentials admin@marmara.shop / password123
    if (email === 'admin@marmara.shop' && password === 'password123') {
      const userId = `admin_${Date.now()}`;
      const accessToken = authService.generateAccessToken(userId, ADMIN_JWT_SECRET, '24h');
      const refreshToken = authService.generateRefreshToken(userId, REFRESH_TOKEN_SECRET, '7d');

      // Store session
      activeSessions.set(userId, {
        userId,
        email,
        role: 'admin',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      res.json({
        success: true,
        data: {
          accessToken,
          refreshToken,
          user: {
            id: userId,
            email,
            role: 'admin',
            name: 'Admin User',
          },
        },
      });
    } else {
      throw new AppError('Invalid email or password', 401);
    }
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * POST /api/admin/auth/refresh
 * Refresh access token using refresh token
 * Body: { refreshToken }
 */
router.post('/api/admin/auth/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError('Missing refresh token', {
        refreshToken: ['Refresh token is required'],
      });
    }

    const decoded = authService.verifyToken(refreshToken, REFRESH_TOKEN_SECRET);
    if (!decoded || decoded.type !== 'refresh') {
      throw new AppError('Invalid refresh token', 401);
    }

    const session = activeSessions.get(decoded.userId);
    if (!session) {
      throw new AppError('Session not found', 401);
    }

    const newAccessToken = authService.generateAccessToken(
      decoded.userId,
      ADMIN_JWT_SECRET,
      '24h'
    );

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * POST /api/admin/auth/logout
 * Logout admin user
 * Headers: { Authorization: Bearer <accessToken> }
 */
router.post('/api/admin/auth/logout', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
      authService.addToBlacklist(token);
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * GET /api/admin/auth/me
 * Get current authenticated admin user
 * Headers: { Authorization: Bearer <accessToken> }
 */
router.get('/api/admin/auth/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    if (authService.isTokenBlacklisted(token)) {
      throw new AppError('Token has been revoked', 401);
    }

    const decoded = authService.verifyToken(token, ADMIN_JWT_SECRET);
    if (!decoded || decoded.type !== 'access') {
      throw new AppError('Invalid or expired token', 401);
    }

    const session = activeSessions.get(decoded.userId);
    if (!session) {
      throw new AppError('Session not found', 401);
    }

    // Update last login
    await authService.updateAdminLastLogin(decoded.userId);

    res.json({
      success: true,
      data: {
        id: decoded.userId,
        email: session.email,
        role: session.role,
        name: 'Admin User',
      },
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * GET /api/admin/users
 * List all admin users (admin only)
 */
router.get('/api/admin/users', async (req: Request, res: Response) => {
  try {
    // Mock data for demo
    const users = [
      {
        id: 'admin_001',
        email: 'admin@marmara.shop',
        role: 'admin',
        name: 'Admin User',
        active: true,
        created_at: new Date('2024-10-01'),
        last_login: new Date(),
      },
      {
        id: 'manager_001',
        email: 'manager@marmara.shop',
        role: 'manager',
        name: 'Manager User',
        active: true,
        created_at: new Date('2024-10-15'),
        last_login: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'viewer_001',
        email: 'viewer@marmara.shop',
        role: 'viewer',
        name: 'Viewer User',
        active: true,
        created_at: new Date('2024-10-20'),
        last_login: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ];

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * POST /api/admin/users
 * Create new admin user (admin only)
 * Body: { email, role }
 */
router.post('/api/admin/users', async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      throw new ValidationError('Missing required fields', {
        email: email ? [] : ['Email is required'],
        role: role ? [] : ['Role is required'],
      });
    }

    const validRoles = ['admin', 'manager', 'viewer'];
    if (!validRoles.includes(role)) {
      throw new ValidationError('Invalid role', {
        role: ['Role must be admin, manager, or viewer'],
      });
    }

    const newUser = {
      id: `${role}_${Date.now()}`,
      email,
      role,
      name: email.split('@')[0],
      active: true,
      created_at: new Date(),
      last_login: null,
    };

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully',
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * PATCH /api/admin/users/:userId
 * Update admin user (admin only)
 * Body: { role, active }
 */
router.patch('/api/admin/users/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role, active } = req.body;

    if (!userId) {
      throw new ValidationError('Missing user ID', {
        userId: ['User ID is required'],
      });
    }

    const validRoles = ['admin', 'manager', 'viewer'];
    if (role && !validRoles.includes(role)) {
      throw new ValidationError('Invalid role', {
        role: ['Role must be admin, manager, or viewer'],
      });
    }

    const updatedUser = {
      id: userId,
      email: 'user@marmara.shop',
      role: role || 'viewer',
      name: 'Updated User',
      active: active !== undefined ? active : true,
      created_at: new Date('2024-10-20'),
      updated_at: new Date(),
    };

    res.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

/**
 * DELETE /api/admin/users/:userId
 * Delete admin user (admin only)
 */
router.delete('/api/admin/users/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new ValidationError('Missing user ID', {
        userId: ['User ID is required'],
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: {
        id: userId,
      },
    });
  } catch (error) {
    const { statusCode, body } = handleError(error);
    res.status(statusCode).json(body);
  }
});

export default router;
