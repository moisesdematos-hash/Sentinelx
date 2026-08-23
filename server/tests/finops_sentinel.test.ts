import { describe, it, expect } from 'vitest';
import { FinOpsSentinelService } from '../src/services/finops_sentinel.service.js';

describe('FinOpsSentinelService (Super AI Superpower 7)', () => {
  it('should purge parasitic cryptomining containers and restore cloud efficiency', async () => {
    const result = await FinOpsSentinelService.purgeCryptomining('org-1', {
      provider: 'AWS',
      targetClusterOrAccount: 'prod-us-east-1-k8s',
    });

    expect(result).toBeDefined();
    expect(result.rogueContainersTerminated).toBe(4);
    expect(result.monthlySavingsUsd).toBeGreaterThan(10000);
    expect(result.status).toBe('PARASITIC_MINERS_PURGED');
  });

  it('should retrieve cloud savings summary', async () => {
    const summary = await FinOpsSentinelService.getSavingsSummary('org-1');
    expect(summary.totalMonthlySavingsUsd).toBeGreaterThan(10000);
    expect(summary.cloudEfficiencyScore).toBeGreaterThan(90);
  });
});
