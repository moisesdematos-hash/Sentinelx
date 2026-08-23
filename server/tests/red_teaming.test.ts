import { describe, it, expect } from 'vitest';
import { RedTeamingService } from '../src/services/red_teaming.service.js';

describe('RedTeamingService (Super AI Superpower 1)', () => {
  it('should run Red Team simulation for SQL Injection and return Mitre technique T1190', async () => {
    const result = await RedTeamingService.runSimulation('org-1', {
      targetType: 'API',
      attackVector: 'SQL_INJECTION',
    });

    expect(result).toBeDefined();
    expect(result.mitreTechnique).toContain('T1190');
    expect(result.status).toBe('PREVENTED_BY_SUPER_AI');
  });

  it('should retrieve org stats with active Mitre coverage', async () => {
    const stats = await RedTeamingService.getStats('org-1');
    expect(stats.resilienceScore).toBeGreaterThan(90);
    expect(stats.activeMitreCoverage).toContain('T1190');
  });
});
