import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/client.js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthService {
  static async register(data: z.infer<typeof registerSchema>, reqMeta?: { ip?: string; userAgent?: string }) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new AppError(409, 'User with this email already exists', 'USER_EXISTS');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const slug = data.organizationName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);

    // Transaction to create Org + Initial User as ORG_ADMIN
    const result = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: data.organizationName,
          slug,
        },
      });

      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
          organizationId: org.id,
          role: 'ORG_ADMIN',
        },
      });

      return { org, user };
    });

    await AuditService.record({
      organizationId: result.org.id,
      userId: result.user.id,
      action: 'USER_REGISTERED',
      resource: 'User',
      resourceId: result.user.id,
      ipAddress: reqMeta?.ip,
      userAgent: reqMeta?.userAgent,
      details: { organizationName: result.org.name },
    });

    const token = jwt.sign(
      {
        userId: result.user.id,
        organizationId: result.org.id,
        email: result.user.email,
        role: result.user.role,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return {
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        organizationId: result.org.id,
        organizationName: result.org.name,
      },
    };
  }

  static async login(data: z.infer<typeof loginSchema>, reqMeta?: { ip?: string; userAgent?: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { organization: true },
    });

    if (!user) {
      throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValidPassword) {
      await AuditService.record({
        organizationId: user.organizationId,
        userId: user.id,
        action: 'LOGIN_FAILED',
        resource: 'User',
        resourceId: user.id,
        status: 'FAILURE',
        ipAddress: reqMeta?.ip,
        userAgent: reqMeta?.userAgent,
      });
      throw new AppError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await AuditService.record({
      organizationId: user.organizationId,
      userId: user.id,
      action: 'USER_LOGIN',
      resource: 'User',
      resourceId: user.id,
      ipAddress: reqMeta?.ip,
      userAgent: reqMeta?.userAgent,
    });

    const token = jwt.sign(
      {
        userId: user.id,
        organizationId: user.organizationId,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        organizationName: user.organization.name,
      },
    };
  }
}
