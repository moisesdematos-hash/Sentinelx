import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';

export class BrandProtectionService {
  static async seedDefaultBrandFindings(organizationId: string) {
    const domainCount = await prisma.impersonationDomain.count({ where: { organizationId } });
    if (domainCount === 0) {
      await prisma.impersonationDomain.createMany({
        data: [
          {
            organizationId,
            domainName: 'sentinelx-login.com',
            similarityScore: 98,
            dnsResolvedIp: '185.220.101.99',
            hasMxRecord: true,
            phishingDetected: true,
            status: 'MONITORED',
          },
          {
            organizationId,
            domainName: 's3ntinelx.io',
            similarityScore: 95,
            dnsResolvedIp: '198.51.100.14',
            hasMxRecord: true,
            phishingDetected: true,
            status: 'MONITORED',
          },
          {
            organizationId,
            domainName: 'sentinelx-security.net',
            similarityScore: 91,
            dnsResolvedIp: '203.0.113.88',
            hasMxRecord: false,
            phishingDetected: false,
            status: 'TAKEDOWN_SUBMITTED',
          },
        ],
      });
    }

    const leakCount = await prisma.brandLeakedCredential.count({ where: { organizationId } });
    if (leakCount === 0) {
      await prisma.brandLeakedCredential.createMany({
        data: [
          {
            organizationId,
            email: 'executive-vp@sentinelx.io',
            leakSource: 'DARKWEB_FORUM',
            severity: 'CRITICAL',
            status: 'OPEN',
          },
          {
            organizationId,
            email: 'devops-lead@sentinelx.io',
            leakSource: 'STEALER_LOG',
            severity: 'HIGH',
            status: 'OPEN',
          },
        ],
      });
    }
  }

  static async listDomains(organizationId: string) {
    await this.seedDefaultBrandFindings(organizationId);

    return prisma.impersonationDomain.findMany({
      where: { organizationId },
      orderBy: { similarityScore: 'desc' },
    });
  }

  static async scanImpersonation(organizationId: string, targetDomain?: string, userId?: string) {
    await this.seedDefaultBrandFindings(organizationId);

    const base = targetDomain || 'sentinelx.io';
    const fakeDomain = `${base.replace('.io', '')}-auth-sso.com`;

    const existing = await prisma.impersonationDomain.findFirst({
      where: { domainName: fakeDomain, organizationId },
    });

    let domain = existing;
    if (!domain) {
      domain = await prisma.impersonationDomain.create({
        data: {
          organizationId,
          domainName: fakeDomain,
          similarityScore: 94,
          dnsResolvedIp: '185.220.101.44',
          hasMxRecord: true,
          phishingDetected: true,
          status: 'MONITORED',
        },
      });
    }

    await WebhookService.dispatchEvent(organizationId, 'BrandProtectionThreatDetected', {
      domainName: domain.domainName,
      similarityScore: domain.similarityScore,
      phishingDetected: domain.phishingDetected,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'BRAND_IMPERSONATION_SCAN_EXECUTED',
      resource: 'BrandProtectionEngine',
      details: { targetDomain: base, discoveredDomain: domain.domainName },
    });

    return this.listDomains(organizationId);
  }

  static async submitTakedown(organizationId: string, domainId: string, userId?: string) {
    const domain = await prisma.impersonationDomain.findFirst({
      where: { id: domainId, organizationId },
    });

    if (!domain) {
      throw new AppError(404, 'Impersonation domain record not found', 'NOT_FOUND');
    }

    const updated = await prisma.impersonationDomain.update({
      where: { id: domain.id },
      data: { status: 'TAKEDOWN_SUBMITTED' },
    });

    await WebhookService.dispatchEvent(organizationId, 'BrandProtectionThreatDetected', {
      domainId: updated.id,
      domainName: updated.domainName,
      status: 'TAKEDOWN_SUBMITTED',
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'REGISTRAR_TAKEDOWN_SUBMITTED',
      resource: 'ImpersonationDomain',
      resourceId: updated.id,
      details: { domainName: updated.domainName },
    });

    return updated;
  }

  static async listLeaks(organizationId: string) {
    await this.seedDefaultBrandFindings(organizationId);

    return prisma.brandLeakedCredential.findMany({
      where: { organizationId },
      orderBy: { timestamp: 'desc' },
    });
  }
}
