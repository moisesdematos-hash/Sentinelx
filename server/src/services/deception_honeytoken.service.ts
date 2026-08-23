import { prisma } from '../db/client.js';
import { AuditService } from './audit.service.js';

export interface GenerateHoneytokenRequest {
  tokenType: 'AWS_IAM_KEY' | 'API_ENDPOINT' | 'DB_CREDENTIAL' | 'JWT_SECRET';
  label: string;
}

export class DeceptionHoneytokenService {
  static async generateHoneytoken(organizationId: string, data: GenerateHoneytokenRequest, userId?: string) {
    let fakePayload = '';
    if (data.tokenType === 'AWS_IAM_KEY') {
      fakePayload = 'AKIAIOSFODNN7EXAMPLE_HONEYTOKEN_KEY';
    } else if (data.tokenType === 'API_ENDPOINT') {
      fakePayload = 'https://api.sentinelx-cyber.com/v1/admin/decoy-export';
    } else if (data.tokenType === 'DB_CREDENTIAL') {
      fakePayload = 'postgres://admin_decoy:honeytoken_pass_882@db.sentinelx.internal:5432/core';
    } else {
      fakePayload = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.decoy_payload_honeytoken';
    }

    const honeytokenRecord = {
      id: `ht_${Date.now()}`,
      organizationId,
      label: data.label,
      tokenType: data.tokenType,
      fakePayload,
      triggerCount: 0,
      status: 'ARMED_AND_MONITORED',
      createdAt: new Date().toISOString(),
    };

    await AuditService.record({
      organizationId,
      userId,
      action: 'HONEYTOKEN_DECEPTION_ARMED',
      resource: 'Honeytoken',
      resourceId: honeytokenRecord.id,
      details: { tokenType: data.tokenType, label: data.label },
    });

    return honeytokenRecord;
  }

  static async listActiveHoneytokens(organizationId: string) {
    return [
      {
        id: 'ht_101',
        label: 'Isca de Chave AWS em Repo Público',
        tokenType: 'AWS_IAM_KEY',
        fakePayload: 'AKIAIOSFODNN7EXAMPLE_HONEYTOKEN_KEY',
        triggerCount: 3,
        status: 'ARMED_AND_MONITORED',
        createdAt: 'Hoje às 00:30',
      },
      {
        id: 'ht_102',
        label: 'Rota Decoy /api/v1/admin/decoy-export',
        tokenType: 'API_ENDPOINT',
        fakePayload: 'https://api.sentinelx-cyber.com/v1/admin/decoy-export',
        triggerCount: 1,
        status: 'ARMED_AND_MONITORED',
        createdAt: 'Hoje às 01:00',
      },
    ];
  }
}
