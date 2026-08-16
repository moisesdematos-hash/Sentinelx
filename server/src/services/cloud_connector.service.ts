import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';
import { z } from 'zod';

export const createCloudConnectorSchema = z.object({
  name: z.string().min(2),
  provider: z.enum(['AWS', 'AZURE', 'GCP']),
  credentials: z.record(z.any()), // e.g. roleArn for AWS, servicePrincipal for Azure
  region: z.string().default('us-east-1'),
});

export class CloudConnectorService {
  static async createConnector(
    organizationId: string,
    data: z.infer<typeof createCloudConnectorSchema>,
    userId?: string
  ) {
    const connector = await prisma.cloudConnector.create({
      data: {
        organizationId,
        name: data.name,
        provider: data.provider,
        credentials: JSON.stringify(data.credentials),
        region: data.region,
        status: 'ACTIVE',
      },
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'CLOUD_CONNECTOR_CREATED',
      resource: 'CloudConnector',
      resourceId: connector.id,
      details: { name: connector.name, provider: connector.provider, region: connector.region },
    });

    return {
      ...connector,
      credentials: JSON.parse(connector.credentials),
    };
  }

  static async listConnectors(organizationId: string) {
    const connectors = await prisma.cloudConnector.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });

    return connectors.map((c) => ({
      ...c,
      credentials: JSON.parse(c.credentials || '{}'),
    }));
  }

  static async syncConnectorAssets(organizationId: string, connectorId: string, userId?: string) {
    const connector = await prisma.cloudConnector.findFirst({
      where: { id: connectorId, organizationId },
    });

    if (!connector) {
      throw new AppError(404, 'Cloud connector not found or access denied', 'NOT_FOUND');
    }

    // Set status to SYNCING
    await prisma.cloudConnector.update({
      where: { id: connector.id },
      data: { status: 'SYNCING' },
    });

    // Multi-Cloud Discovered Asset Pool with connector-scoped targets
    const connectorShortId = connector.id.substring(0, 8);
    const mockDiscoveredResources = [
      {
        name: `${connector.provider.toLowerCase()}-prod-cluster-worker-${connectorShortId}`,
        target: `arn:${connector.provider.toLowerCase()}:compute:${connector.region}:123456789012:instance/i-${connectorShortId}`,
        criticality: 'CRITICAL',
      },
      {
        name: `${connector.provider.toLowerCase()}-secure-telemetry-${connectorShortId}`,
        target: `s3://${connector.provider.toLowerCase()}-sentinelx-telemetry-${connectorShortId}`,
        criticality: 'HIGH',
      },
    ];

    const createdAssets = [];

    for (const res of mockDiscoveredResources) {
      const existing = await prisma.asset.findFirst({
        where: { organizationId, target: res.target },
      });

      if (!existing) {
        const asset = await prisma.asset.create({
          data: {
            organizationId,
            name: res.name,
            type: 'CLOUD',
            target: res.target,
            environment: 'PRODUCTION',
            criticality: res.criticality,
            status: 'MONITORED',
            owner: 'Cloud DevOps Team',
            metadata: JSON.stringify({ connectorId: connector.id, provider: connector.provider, region: connector.region }),
          },
        });
        createdAssets.push(asset);
      } else {
        createdAssets.push(existing);
      }
    }

    // Update connector telemetry
    const updatedConnector = await prisma.cloudConnector.update({
      where: { id: connector.id },
      data: {
        status: 'ACTIVE',
        lastSyncAt: new Date(),
        discoveredAssetsCount: createdAssets.length,
      },
    });

    await WebhookService.dispatchEvent(organizationId, 'CloudConnectorSyncCompleted', {
      connectorId: connector.id,
      provider: connector.provider,
      discoveredAssetsCount: createdAssets.length,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'CLOUD_CONNECTOR_SYNCED',
      resource: 'CloudConnector',
      resourceId: connector.id,
      details: { provider: connector.provider, newAssetsCount: createdAssets.length },
    });

    return {
      connector: {
        ...updatedConnector,
        credentials: JSON.parse(updatedConnector.credentials),
      },
      discoveredAssets: createdAssets,
    };
  }
}
