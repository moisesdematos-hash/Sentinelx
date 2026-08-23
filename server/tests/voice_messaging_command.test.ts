import { describe, it, expect } from 'vitest';
import { VoiceMessagingCommandService } from '../src/services/voice_messaging_command.service.js';

describe('VoiceMessagingCommandService (Super AI Superpower 5)', () => {
  it('should process voice command to block IP in WAF', async () => {
    const result = await VoiceMessagingCommandService.processCommand('org-1', {
      channel: 'VOICE_MIC',
      rawCommandText: 'Sentinel, bloqueie o IP 185.220.101.9 no WAF',
    });

    expect(result).toBeDefined();
    expect(result.actionExecuted).toBe('WAF_IP_BLOCK');
    expect(result.status).toBe('EXECUTED_BY_SUPER_AI');
  });

  it('should list voice command history', async () => {
    const history = await VoiceMessagingCommandService.getHistory('org-1');
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].status).toBe('EXECUTED_BY_SUPER_AI');
  });
});
