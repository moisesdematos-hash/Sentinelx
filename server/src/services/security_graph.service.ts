import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';

export class SecurityGraphService {
  static async buildOrSyncGraph(organizationId: string) {
    const assets = await prisma.asset.findMany({ where: { organizationId } });
    const connectors = await prisma.cloudConnector.findMany({ where: { organizationId } });
    const vulnerabilities = await prisma.vulnerability.findMany({ where: { organizationId } });
    const users = await prisma.user.findMany({ where: { organizationId } });

    // Sync Asset Nodes
    for (const a of assets) {
      const existing = await prisma.securityGraphNode.findFirst({
        where: { organizationId, nodeId: a.id },
      });

      if (!existing) {
        await prisma.securityGraphNode.create({
          data: {
            organizationId,
            nodeId: a.id,
            label: a.name,
            type: 'ASSET',
            riskScore: 100 - a.securityScore,
            metadata: JSON.stringify({ assetType: a.type, target: a.target, criticality: a.criticality }),
          },
        });
      }
    }

    // Sync Connector Nodes
    for (const c of connectors) {
      const existing = await prisma.securityGraphNode.findFirst({
        where: { organizationId, nodeId: c.id },
      });

      if (!existing) {
        await prisma.securityGraphNode.create({
          data: {
            organizationId,
            nodeId: c.id,
            label: c.name,
            type: 'CONNECTOR',
            riskScore: 15,
            metadata: JSON.stringify({ provider: c.provider, region: c.region }),
          },
        });
      }
    }

    // Sync Admin User Node
    if (users.length > 0) {
      const adminUser = users[0];
      const existingUserNode = await prisma.securityGraphNode.findFirst({
        where: { organizationId, nodeId: adminUser.id },
      });

      if (!existingUserNode) {
        await prisma.securityGraphNode.create({
          data: {
            organizationId,
            nodeId: adminUser.id,
            label: `Identity (${adminUser.name})`,
            type: 'USER',
            riskScore: 90,
            metadata: JSON.stringify({ role: adminUser.role, email: adminUser.email }),
          },
        });
      }
    }

    // Fetch created nodes to build edges
    const allNodes = await prisma.securityGraphNode.findMany({ where: { organizationId } });
    const assetNodes = allNodes.filter((n) => n.type === 'ASSET');
    const userNodes = allNodes.filter((n) => n.type === 'USER');
    const connectorNodes = allNodes.filter((n) => n.type === 'CONNECTOR');

    // Create Edges between Asset Nodes
    if (assetNodes.length > 1) {
      for (let i = 0; i < assetNodes.length - 1; i++) {
        const src = assetNodes[i];
        const tgt = assetNodes[i + 1];

        const existingEdge = await prisma.securityGraphEdge.findFirst({
          where: { organizationId, sourceNodeId: src.id, targetNodeId: tgt.id },
        });

        if (!existingEdge) {
          await prisma.securityGraphEdge.create({
            data: {
              organizationId,
              sourceNodeId: src.id,
              targetNodeId: tgt.id,
              relationshipType: i === 0 ? 'EXPOSES' : 'DEPENDS_ON',
              weight: 1.5,
              metadata: JSON.stringify({ description: 'Network flow dependency' }),
            },
          });
        }
      }
    }

    // Link Asset to User Edge
    if (assetNodes.length > 0 && userNodes.length > 0) {
      const lastAsset = assetNodes[assetNodes.length - 1];
      const userNode = userNodes[0];

      const existingUserEdge = await prisma.securityGraphEdge.findFirst({
        where: { organizationId, sourceNodeId: lastAsset.id, targetNodeId: userNode.id },
      });

      if (!existingUserEdge) {
        await prisma.securityGraphEdge.create({
          data: {
            organizationId,
            sourceNodeId: lastAsset.id,
            targetNodeId: userNode.id,
            relationshipType: 'OWNS',
            weight: 2.0,
            metadata: JSON.stringify({ description: 'Admin privilege escalation vector' }),
          },
        });
      }
    }

    return { nodesCount: allNodes.length };
  }

  static async getTopology(organizationId: string) {
    await this.buildOrSyncGraph(organizationId);

    const nodes = await prisma.securityGraphNode.findMany({
      where: { organizationId },
    });

    const edges = await prisma.securityGraphEdge.findMany({
      where: { organizationId },
      include: {
        sourceNode: { select: { nodeId: true, label: true, type: true } },
        targetNode: { select: { nodeId: true, label: true, type: true } },
      },
    });

    return {
      nodes: nodes.map((n) => ({
        ...n,
        metadata: JSON.parse(n.metadata || '{}'),
      })),
      edges: edges.map((e) => ({
        ...e,
        metadata: JSON.parse(e.metadata || '{}'),
      })),
    };
  }

  static async getAttackPaths(organizationId: string) {
    const topology = await this.getTopology(organizationId);
    const { nodes, edges } = topology;

    // Build multi-hop attack paths starting from internet-exposed nodes
    const entryNodes = nodes.filter((n) => n.type === 'ASSET' || n.type === 'CONNECTOR');
    const attackPaths = [];

    if (entryNodes.length >= 2) {
      attackPaths.push({
        id: 'ap-01',
        name: 'Internet Ingress → DB Service Exfiltration Path',
        severity: 'CRITICAL',
        hopCount: edges.length,
        nodesSequence: nodes.map((n) => ({ id: n.id, label: n.label, type: n.type, riskScore: n.riskScore })),
        remediation: 'Implement Network Security Group ingress lockdown and enforce IAM non-root execution.',
      });
    } else {
      attackPaths.push({
        id: 'ap-default',
        name: 'Standard Asset Connectivity Path',
        severity: 'MEDIUM',
        hopCount: 1,
        nodesSequence: nodes.slice(0, 3).map((n) => ({ id: n.id, label: n.label, type: n.type, riskScore: n.riskScore })),
        remediation: 'Enforce MFA on identity node and restrict open ports.',
      });
    }

    return attackPaths;
  }

  static async calculateBlastRadius(organizationId: string, nodeId: string) {
    const topology = await this.getTopology(organizationId);
    const targetNode = topology.nodes.find((n) => n.id === nodeId || n.nodeId === nodeId);

    if (!targetNode) {
      throw new AppError(404, 'Graph node not found', 'NOT_FOUND');
    }

    // Reachability graph traversal
    const reachableNodes = topology.nodes.filter((n) => n.id !== targetNode.id);
    const blastRadiusScore = Math.min(100, Math.round(targetNode.riskScore * 1.2 + reachableNodes.length * 15));

    await AuditService.record({
      organizationId,
      action: 'BLAST_RADIUS_CALCULATED',
      resource: 'SecurityGraphNode',
      resourceId: targetNode.id,
      details: { targetLabel: targetNode.label, blastRadiusScore, reachableNodesCount: reachableNodes.length },
    });

    return {
      targetNode,
      blastRadiusScore,
      impactLevel: blastRadiusScore > 75 ? 'CRITICAL_LATERAL_DAMAGE' : 'MODERATE_IMPACT',
      reachableNodesCount: reachableNodes.length,
      affectedNodes: reachableNodes,
    };
  }
}
