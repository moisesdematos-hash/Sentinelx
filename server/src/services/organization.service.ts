import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';

export class OrganizationService {
  static async getById(id: string) {
    const org = await prisma.organization.findUnique({
      where: { id },
      include: {
        partner: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { assets: true, users: true },
        },
      },
    });

    if (!org) {
      throw new AppError(404, 'Organization not found', 'NOT_FOUND');
    }

    return org;
  }

  static async listAll() {
    return prisma.organization.findMany({
      include: {
        partner: { select: { id: true, name: true } },
        _count: { select: { assets: true, users: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async create(data: { name: string; partnerId?: string; domain?: string }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);
    return prisma.organization.create({
      data: {
        name: data.name,
        slug,
        partnerId: data.partnerId,
        domain: data.domain,
      },
    });
  }
}
