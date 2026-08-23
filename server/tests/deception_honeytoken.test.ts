import { describe, it, expect } from 'vitest';
import { DeceptionHoneytokenService } from '../src/services/deception_honeytoken.service.js';

describe('DeceptionHoneytokenService (Super AI Superpower 3)', () => {
  it('should generate a fake AWS IAM honeytoken key', async () => {
    const result = await DeceptionHoneytokenService.generateHoneytoken('org-1', {
      tokenType: 'AWS_IAM_KEY',
      label: 'Test Honeytoken Key',
    });

    expect(result).toBeDefined();
    expect(result.tokenType).toBe('AWS_IAM_KEY');
    expect(result.status).toBe('ARMED_AND_MONITORED');
  });

  it('should list active honeytokens', async () => {
    const tokens = await DeceptionHoneytokenService.listActiveHoneytokens('org-1');
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens[0].status).toBe('ARMED_AND_MONITORED');
  });
});
