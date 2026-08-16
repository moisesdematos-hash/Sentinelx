import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { z } from 'zod';

export const updateBrandingSchema = z.object({
  brandName: z.string().min(2, 'Brand name required'),
  logoUrl: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  primaryColor: z.string().default('#00f2fe'),
  customDomain: z.string().optional(),
  reportHeader: z.string().optional(),
  supportEmail: z.string().email().optional().or(z.literal('')),
  partnerId: z.string().optional(),
});

export const createClientOrgSchema = z.object({
  name: z.string().min(2, 'Organization name required'),
  domain: z.string().optional(),
  partnerId: z.string().optional(),
});

export class MspService {
  static async getPortfolioSummary(partnerId?: string) {
    const wherePartner = partnerId ? { partnerId } : {};

    const [clients, totalAssets, firstPartner] = await Promise.all([
      prisma.organization.findMany({
        where: wherePartner,
        include: {
          _count: { select: { assets: true, users: true } },
        },
        orderBy: { securityScore: 'asc' }, // Lowest scores first for risk ranking
      }),
      prisma.asset.count({
        where: partnerId ? { organization: { partnerId } } : {},
      }),
      prisma.partner.findFirst({
        include: { branding: true },
      }),
    ]);

    const totalClients = clients.length;
    const avgScore = totalClients > 0
      ? Math.round(clients.reduce((acc, c) => acc + c.securityScore, 0) / totalClients)
      : 100;

    const highRiskClientsCount = clients.filter((c) => c.securityScore < 80).length;

    return {
      portfolioMetrics: {
        totalClients,
        totalAssets,
        averageSecurityScore: avgScore,
        highRiskClientsCount,
        criticalIncidents: 0,
        pendingRemediations: 0,
      },
      clientRiskRanking: clients.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        domain: c.domain,
        securityScore: c.securityScore,
        assetCount: c._count.assets,
        userCount: c._count.users,
        riskLevel: c.securityScore >= 90 ? 'LOW' : c.securityScore >= 75 ? 'MEDIUM' : 'HIGH',
        status: c.status,
      })),
      branding: firstPartner?.branding || null,
    };
  }

  static async createClientOrganization(
    data: z.infer<typeof createClientOrgSchema>,
    partnerId?: string
  ) {
    let partner = await prisma.partner.findFirst();
    if (!partner) {
      partner = await prisma.partner.create({
        data: {
          name: 'CyberDefense MSP Global',
          slug: 'cyberdefense-msp',
        },
      });
    }

    const slug = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);
    return prisma.organization.create({
      data: {
        name: data.name,
        slug,
        domain: data.domain,
        partnerId: partnerId || data.partnerId || partner.id,
        status: 'ACTIVE',
        securityScore: 100,
      },
    });
  }

  static async updateBranding(
    data: z.infer<typeof updateBrandingSchema>,
    partnerId?: string
  ) {
    const targetPartnerId = partnerId || data.partnerId;
    let partner = targetPartnerId
      ? await prisma.partner.findFirst({
          where: { OR: [{ id: targetPartnerId }, { slug: targetPartnerId }] },
        })
      : await prisma.partner.findFirst();

    if (!partner) {
      partner = await prisma.partner.create({
        data: {
          name: 'CyberDefense MSP Global',
          slug: 'cyberdefense-msp',
        },
      });
    }

    const existingBranding = await prisma.branding.findUnique({
      where: { partnerId: partner.id },
    });

    if (existingBranding) {
      return prisma.branding.update({
        where: { id: existingBranding.id },
        data: {
          brandName: data.brandName,
          logoUrl: data.logoUrl,
          primaryColor: data.primaryColor,
          customDomain: data.customDomain,
          reportHeader: data.reportHeader,
          supportEmail: data.supportEmail,
        },
      });
    }

    return prisma.branding.create({
      data: {
        partnerId: partner.id,
        brandName: data.brandName,
        logoUrl: data.logoUrl,
        primaryColor: data.primaryColor,
        customDomain: data.customDomain,
        reportHeader: data.reportHeader,
        supportEmail: data.supportEmail,
      },
    });
  }
}
