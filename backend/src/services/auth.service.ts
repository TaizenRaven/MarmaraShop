import * as jwt from 'jsonwebtoken';
import { AdminUser } from '../models/admin-user.model';

export class AuthService {
  private adminUsers: Map<string, AdminUser> = new Map();
  private tokenBlacklist: Set<string> = new Set();

  async createAdminUser(email: string, passwordHash: string, role: string = 'admin'): Promise<AdminUser> {
    // TODO: Implement with MedusaJS
    const user = {
      id: `admin_${Date.now()}`,
      email,
      password_hash: passwordHash,
      role,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
    } as AdminUser;
    this.adminUsers.set(user.id, user);
    return user;
  }

  async authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
    // TODO: Implement with actual password verification
    const users = Array.from(this.adminUsers.values());
    const user = users.find((u) => u.email === email && u.active);
    return user || null;
  }

  generateAccessToken(userId: string, secret: string, expiresIn: string = '24h'): string {
    return jwt.sign({ userId, type: 'access' }, secret, { expiresIn });
  }

  generateRefreshToken(userId: string, secret: string, expiresIn: string = '7d'): string {
    return jwt.sign({ userId, type: 'refresh' }, secret, { expiresIn });
  }

  verifyToken(token: string, secret: string): any {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  }

  addToBlacklist(token: string): void {
    this.tokenBlacklist.add(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }

  async getAdminById(id: string): Promise<AdminUser | null> {
    return this.adminUsers.get(id) || null;
  }

  async updateAdminLastLogin(id: string): Promise<void> {
    const user = this.adminUsers.get(id);
    if (user) {
      user.last_login = new Date();
      this.adminUsers.set(id, user);
    }
  }
}
