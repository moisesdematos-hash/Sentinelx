import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';

export class RiskEngineService {
  static async calculateRiskProfile(organizationId: string, userId?: string) {
    const assets = await prisma.asset.findMany({ where: { organizationId } });
    const vulnerabilities = await prisma.vulnerability.findMany({ where: { organizationId, status: 'OPEN' } });
    const alerts = await prisma.detectionAlert.findMany({ where: { organizationId, status: 'OPEN' } });

    const calculatedProfiles = [];
    let totalRiskSum = 0;

    for (const asset of assets) {
      // 1. Asset Criticality Weight
      let critWeight = 20;
      if (asset.criticality === 'CRITICAL') critWeight = 40;
      else if (asset.criticality === 'HIGH') critWeight = 30;
      else if (asset.criticality === 'MEDIUM') critWeight = 20;
      else if (asset.criticality === 'LOW') critWeight = 10;

      // 2. Open Vulnerabilities CVSS Weight
      const assetVulns = vulnerabilities.filter((v) => v.assetId === asset.id);
      const maxCvss = assetVulns.reduce((max, v) => (v.cvssScore > max ? v.cvssScore : max), 0);
      const cvssWeight = Math.round(maxCvss * 4); // Max 40

      // 3. Active Detection Alerts Weight
      const assetAlerts = alerts.filter((a) => a.assetId === asset.id);
      const alertWeight = assetAlerts.length > 0 ? 20 : 0;

      const riskScore = Math.min(100, Math.round(critWeight + cvssWeight + alertWeight));
      totalRiskSum += riskScore;

      // Determine Priority Tier
      let priorityTier = 'P3_LOW_PRIORITY';
      if (riskScore >= 80) priorityTier = 'P0_IMMEDIATE_ACTION';
      else if (riskScore >= 60) priorityTier = 'P1_HIGH_PRIORITY';
      else if (riskScore >= 40) priorityTier = 'P2_MODERATE';

      const factors = {
        assetCriticality: asset.criticality,
        criticalityWeight: critWeight,
        openVulnerabilitiesCount: assetVulns.length,
        maxCvssScore: maxCvss,
        cvssWeight,
        activeAlertsCount: assetAlerts.length,
        alertWeight,
        formula: `Risk = Criticality(${critWeight}) + CVSS(${cvssWeight}) + ThreatAlerts(${alertWeight})`,
      };

      const profile = await prisma.riskProfile.create({
        data: {
          organizationId,
          assetId: asset.id,
          overallRiskScore: riskScore,
          priorityTier,
          factorsBreakdown: JSON.stringify(factors),
        },
      });

      calculatedProfiles.push({
        ...profile,
        assetName: asset.name,
        target: asset.target,
        factorsBreakdown: factors,
      });
    }

    const avgRisk = assets.length > 0 ? Math.round(totalRiskSum / assets.length) : 0;
    const orgSecurityScore = Math.max(0, 100 - avgRisk);

    await prisma.organization.update({
      where: { id: organizationId },
      data: { securityScore: orgSecurityScore },
    });

    await WebhookService.dispatchEvent(organizationId, 'SecurityScoreChanged', {
      organizationId,
      newSecurityScore: orgSecurityScore,
      averageRiskScore: avgRisk,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'RISK_PROFILE_RECALCULATED',
      resource: 'RiskProfile',
      details: { averageRiskScore: avgRisk, orgSecurityScore, assetsCount: assets.length },
    });

    return {
      organizationSecurityScore: orgSecurityScore,
      averageRiskScore: avgRisk,
      profiles: calculatedProfiles,
    };
  }

  static async getPriorityMatrix(organizationId: string) {
    let latestProfiles = await prisma.riskProfile.findMany({
      where: { organizationId },
      include: {
        asset: { select: { id: true, name: true, type: true, target: true, criticality: true } },
      },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    // If no risk profiles calculated yet, calculate now
    if (latestProfiles.length === 0) {
      await this.calculateRiskProfile(organizationId);
      latestProfiles = await prisma.riskProfile.findMany({
        where: { organizationId },
        include: {
          asset: { select: { id: true, name: true, type: true, target: true, criticality: true } },
        },
        orderBy: { timestamp: 'desc' },
        take: 50,
      });
    }

    const matrix = {
      p0Immediate: latestProfiles.filter((p) => p.priorityTier === 'P0_IMMEDIATE_ACTION'),
      p1High: latestProfiles.filter((p) => p.priorityTier === 'P1_HIGH_PRIORITY'),
      p2Moderate: latestProfiles.filter((p) => p.priorityTier === 'P2_MODERATE'),
      p3Low: latestProfiles.filter((p) => p.priorityTier === 'P3_LOW_PRIORITY'),
    };

    return {
      totalAssetsAudited: latestProfiles.length,
      matrix: {
        p0Immediate: matrix.p0Immediate.map((p) => ({ ...p, factorsBreakdown: JSON.parse(p.factorsBreakdown || '{}') })),
        p1High: matrix.p1High.map((p) => ({ ...p, factorsBreakdown: JSON.parse(p.factorsBreakdown || '{}') })),
        p2Moderate: matrix.p2Moderate.map((p) => ({ ...p, factorsBreakdown: JSON.parse(p.factorsBreakdown || '{}') })),
        p3Low: matrix.p3Low.map((p) => ({ ...p, factorsBreakdown: JSON.parse(p.factorsBreakdown || '{}') })),
      },
    };
  }
}
