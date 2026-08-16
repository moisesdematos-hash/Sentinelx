import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';
import { z } from 'zod';

export const runMobileScanSchema = z.object({
  packageName: z.string().min(3),
  platform: z.enum(['ANDROID_APK', 'IOS_IPA']).default('ANDROID_APK'),
});

export class MobileSecurityService {
  static async seedDefaultMobileScans(organizationId: string) {
    let asset = await prisma.asset.findFirst({
      where: { organizationId, target: 'com.sentinelx.mobile' },
    });

    if (!asset) {
      asset = await prisma.asset.create({
        data: {
          organizationId,
          name: 'SENTINELX Mobile Companion App',
          type: 'API',
          target: 'com.sentinelx.mobile',
          environment: 'PRODUCTION',
          criticality: 'HIGH',
          status: 'MONITORED',
        },
      });
    }

    const count = await prisma.mobileSecurityScan.count({ where: { organizationId } });
    if (count === 0) {
      await prisma.mobileSecurityScan.create({
        data: {
          assetId: asset.id,
          organizationId,
          platform: 'ANDROID_APK',
          packageName: 'com.sentinelx.mobile',
          version: '1.4.0',
          score: 88,
          masvsStatus: JSON.stringify([
            { control: 'MASVS-STORAGE', name: 'Secure Local Storage', status: 'PASS' },
            { control: 'MASVS-CRYPTO', name: 'Hardcoded Cryptographic Keys', status: 'FAIL', detail: 'Hardcoded AWS secret key discovered in BuildConfig' },
            { control: 'MASVS-AUTH', name: 'Biometric Authentication Guardrails', status: 'PASS' },
            { control: 'MASVS-NETWORK', name: 'TLS Certificate Pinning', status: 'PASS' },
          ]),
          hardcodedSecrets: JSON.stringify([
            { type: 'AWS_ACCESS_KEY_ID', value: 'AKIAIOSFODNN7EXAMPLE', location: 'classes.dex -> Com/Sentinelx/Config' },
            { type: 'HARDCODED_JWT_SECRET', value: 'secret_live_901824aa8921', location: 'assets/app_config.json' },
          ]),
          permissionsAudit: JSON.stringify([
            { permission: 'android.permission.READ_EXTERNAL_STORAGE', risk: 'HIGH', justification: 'Unnecessary broad storage access' },
            { permission: 'android.permission.INTERNET', risk: 'LOW', justification: 'Required for API telemetry' },
            { permission: 'android.permission.ACCESS_FINE_LOCATION', risk: 'MEDIUM', justification: 'Required for geofencing alerts' },
          ]),
          issuesCount: 3,
          status: 'COMPLETED',
        },
      });
    }
  }

  static async listScans(organizationId: string) {
    await this.seedDefaultMobileScans(organizationId);

    return prisma.mobileSecurityScan.findMany({
      where: { organizationId },
      include: { asset: true },
      orderBy: { timestamp: 'desc' },
    });
  }

  static async runMobileScan(
    organizationId: string,
    data: z.infer<typeof runMobileScanSchema>,
    userId?: string
  ) {
    await this.seedDefaultMobileScans(organizationId);

    let asset = await prisma.asset.findFirst({
      where: { organizationId, target: data.packageName },
    });

    if (!asset) {
      asset = await prisma.asset.create({
        data: {
          organizationId,
          name: `${data.packageName} Mobile Binary`,
          type: 'API',
          target: data.packageName,
          environment: 'PRODUCTION',
          criticality: 'HIGH',
          status: 'MONITORED',
        },
      });
    }

    const scan = await prisma.mobileSecurityScan.create({
      data: {
        assetId: asset.id,
        organizationId,
        platform: data.platform,
        packageName: data.packageName,
        version: '1.5.0-beta',
        score: 92,
        masvsStatus: JSON.stringify([
          { control: 'MASVS-STORAGE', name: 'Secure Local Storage', status: 'PASS' },
          { control: 'MASVS-CRYPTO', name: 'Hardcoded Cryptographic Keys', status: 'PASS' },
          { control: 'MASVS-AUTH', name: 'Biometric Authentication Guardrails', status: 'PASS' },
          { control: 'MASVS-NETWORK', name: 'TLS Certificate Pinning', status: 'PASS' },
        ]),
        hardcodedSecrets: JSON.stringify([
          { type: 'STAGING_API_KEY', value: 'stg_key_0918241', location: 'assets/env.staging.json' },
        ]),
        permissionsAudit: JSON.stringify([
          { permission: 'android.permission.INTERNET', risk: 'LOW', justification: 'Required for API connection' },
        ]),
        issuesCount: 1,
        status: 'COMPLETED',
      },
    });

    await WebhookService.dispatchEvent(organizationId, 'MobileAppScanCompleted', {
      scanId: scan.id,
      packageName: scan.packageName,
      platform: scan.platform,
      score: scan.score,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'MOBILE_SECURITY_SCAN_EXECUTED',
      resource: 'MobileSecurityScan',
      resourceId: scan.id,
      details: { packageName: scan.packageName, platform: scan.platform },
    });

    return scan;
  }

  static async getScanDetails(organizationId: string, scanId: string) {
    const scan = await prisma.mobileSecurityScan.findFirst({
      where: { id: scanId, organizationId },
      include: { asset: true },
    });

    if (!scan) {
      throw new AppError(404, 'Mobile security scan report not found', 'NOT_FOUND');
    }

    return scan;
  }
}
