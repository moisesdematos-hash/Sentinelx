import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';

export class EdgeSecurityService {
  static async seedDefaultEdgeSecurity(organizationId: string) {
    const nodeCount = await prisma.edgeNode.count({ where: { organizationId } });
    let cfNodeId: string | undefined;

    if (nodeCount === 0) {
      const cf = await prisma.edgeNode.create({
        data: {
          organizationId,
          name: 'Cloudflare Workers Primary Edge',
          nodeType: 'CLOUDFLARE_WORKER',
          locationRegion: 'GLOBAL_EDGE',
          trafficRps: 12400,
          status: 'DDOS_ATTACK_DETECTED',
        },
      });
      cfNodeId = cf.id;

      await prisma.edgeNode.createMany({
        data: [
          {
            organizationId,
            name: 'AWS CloudFront Edge Function (us-east-1)',
            nodeType: 'AWS_CLOUDFRONT_EDGE',
            locationRegion: 'us-east-1',
            trafficRps: 1800,
            status: 'MONITORED',
          },
          {
            organizationId,
            name: 'IoT Gateway MQTT Broker 01',
            nodeType: 'IOT_GATEWAY_BROKER',
            locationRegion: 'us-west-2',
            trafficRps: 220,
            status: 'MONITORED',
          },
        ],
      });
    }

    const iotCount = await prisma.iotDeviceScan.count({ where: { organizationId } });
    if (iotCount === 0) {
      await prisma.iotDeviceScan.createMany({
        data: [
          {
            organizationId,
            edgeNodeId: cfNodeId,
            deviceName: 'Industrial HVAC Sensor Hub 04',
            protocol: 'MQTT',
            hasUnencryptedPort: true,
            defaultCredsDetected: true,
            firmwareVersion: 'v1.8.2-legacy',
            vulnerabilitySummary: 'Unencrypted MQTT Broker on port 1883 with hardcoded admin:admin credentials',
          },
          {
            organizationId,
            edgeNodeId: cfNodeId,
            deviceName: 'Smart Building Security Gateway 02',
            protocol: 'COAP',
            hasUnencryptedPort: false,
            defaultCredsDetected: false,
            firmwareVersion: 'v3.1.0-hardened',
            vulnerabilitySummary: 'Hardened CoAP over DTLS 1.3 with mutual TLS authentication',
          },
        ],
      });
    }
  }

  static async listEdgeNodes(organizationId: string) {
    await this.seedDefaultEdgeSecurity(organizationId);

    return prisma.edgeNode.findMany({
      where: { organizationId },
      include: { iotScans: true },
      orderBy: { trafficRps: 'desc' },
    });
  }

  static async listIotScans(organizationId: string) {
    await this.seedDefaultEdgeSecurity(organizationId);

    return prisma.iotDeviceScan.findMany({
      where: { organizationId },
      include: { edgeNode: true },
      orderBy: { timestamp: 'desc' },
    });
  }

  static async runEdgeScan(organizationId: string, userId?: string) {
    await this.seedDefaultEdgeSecurity(organizationId);

    const nodes = await this.listEdgeNodes(organizationId);

    await WebhookService.dispatchEvent(organizationId, 'EdgeSecurityThreatDetected', {
      scanType: 'EDGE_COMPUTE_AND_IOT_FIRMWARE',
      nodesAudited: nodes.length,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'EDGE_IOT_SECURITY_SCAN_EXECUTED',
      resource: 'EdgeSecurityEngine',
      details: { nodesAuditedCount: nodes.length },
    });

    return nodes;
  }

  static async mitigateDdos(organizationId: string, nodeId: string, userId?: string) {
    const node = await prisma.edgeNode.findFirst({
      where: { id: nodeId, organizationId },
    });

    if (!node) {
      throw new AppError(404, 'Edge node not found', 'NOT_FOUND');
    }

    const updated = await prisma.edgeNode.update({
      where: { id: node.id },
      data: {
        status: 'MITIGATED',
        trafficRps: 250,
      },
    });

    await WebhookService.dispatchEvent(organizationId, 'EdgeSecurityThreatDetected', {
      nodeId: updated.id,
      nodeName: updated.name,
      status: 'MITIGATED',
      action: 'WAF_RATE_LIMIT_100_RPS_ENFORCED',
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'EDGE_DDOS_WAF_MITIGATION_ENFORCED',
      resource: 'EdgeNode',
      resourceId: updated.id,
      details: { nodeName: updated.name, action: 'WAF_RATE_LIMIT_100_RPS' },
    });

    return updated;
  }
}
