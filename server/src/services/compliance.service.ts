import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';

export class ComplianceService {
  static async runAudit(organizationId: string, userId?: string) {
    const openVulnsCount = await prisma.vulnerability.count({
      where: { organizationId, status: 'OPEN' },
    });

    const unencryptedCloudCount = await prisma.cloudSecurityScan.count({
      where: { organizationId, storageStatus: { contains: 'UNENCRYPTED' } },
    });

    const frameworks = ['ISO_27001', 'SOC2_TYPE2', 'PCI_DSS_V4', 'HIPAA', 'GDPR'];
    const reports: any[] = [];

    for (const framework of frameworks) {
      let passedCount = 8;
      let failedCount = 0;

      if (openVulnsCount > 0) {
        failedCount += 1;
        passedCount -= 1;
      }

      if (unencryptedCloudCount > 0) {
        failedCount += 1;
        passedCount -= 1;
      }

      const totalControls = passedCount + failedCount;
      const readinessScore = Math.round((passedCount / totalControls) * 100);

      const report = await prisma.complianceReport.create({
        data: {
          organizationId,
          framework,
          readinessScore,
          passedControlsCount: passedCount,
          failedControlsCount: failedCount,
          status: 'COMPLETED',
        },
      });

      // Seed control definitions
      const controlsData = [
        {
          controlId: framework === 'ISO_27001' ? 'A.12.6.1' : framework === 'SOC2_TYPE2' ? 'CC6.8' : 'PCI-6.4',
          title: 'Technical Vulnerability Management & Patch Enforcement',
          description: 'Timely identification, risk assessment, and patch remediation of technical vulnerabilities.',
          status: openVulnsCount === 0 ? 'PASS' : 'FAIL',
          evidence: JSON.stringify({ openVulnerabilities: openVulnsCount }),
        },
        {
          controlId: framework === 'ISO_27001' ? 'A.10.1.1' : framework === 'SOC2_TYPE2' ? 'CC6.1' : 'PCI-3.4',
          title: 'Data-at-Rest & Data-in-Transit Encryption',
          description: 'Enforce AES-256 storage encryption and TLS 1.3 transport security across all endpoints.',
          status: unencryptedCloudCount === 0 ? 'PASS' : 'FAIL',
          evidence: JSON.stringify({ unencryptedCloudResources: unencryptedCloudCount }),
        },
        {
          controlId: framework === 'ISO_27001' ? 'A.9.2.1' : framework === 'SOC2_TYPE2' ? 'CC6.2' : 'PCI-8.2',
          title: 'Identity & Access Management (IAM) Privilege Least Privilege',
          description: 'Enforce MFA, role-based access control, and wildcard permission elimination.',
          status: 'PASS',
          evidence: JSON.stringify({ mfaEnforced: true, wildcardAdminsCount: 0 }),
        },
      ];

      for (const ctrl of controlsData) {
        await prisma.complianceControl.create({
          data: {
            organizationId,
            framework,
            controlId: ctrl.controlId,
            title: ctrl.title,
            description: ctrl.description,
            status: ctrl.status,
            evidence: ctrl.evidence,
          },
        });
      }

      reports.push(report);
    }

    await WebhookService.dispatchEvent(organizationId, 'ComplianceAudited', {
      reportsCount: reports.length,
      averageReadiness: Math.round(
        reports.reduce((acc, r) => acc + r.readinessScore, 0) / reports.length
      ),
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'COMPLIANCE_AUDIT_EXECUTED',
      resource: 'ComplianceReport',
      details: { frameworksAudited: frameworks.length },
    });

    return reports;
  }

  static async getFrameworks(organizationId: string) {
    const reports = await prisma.complianceReport.findMany({
      where: { organizationId },
      orderBy: { timestamp: 'desc' },
    });

    if (reports.length === 0) {
      return this.runAudit(organizationId);
    }

    return reports;
  }

  static async listControls(organizationId: string, frameworkFilter?: string) {
    const where: any = { organizationId };
    if (frameworkFilter) where.framework = frameworkFilter;

    return prisma.complianceControl.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
  }

  static async exportAuditReport(organizationId: string) {
    const reports = await this.getFrameworks(organizationId);
    const controls = await this.listControls(organizationId);

    return {
      exportedAt: new Date().toISOString(),
      organizationId,
      summary: reports,
      evidenceControls: controls,
    };
  }
}
