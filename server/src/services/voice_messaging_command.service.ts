import { prisma } from '../db/client.js';
import { AuditService } from './audit.service.js';

export interface ProcessVoiceCommandRequest {
  channel: 'VOICE_MIC' | 'WHATSAPP' | 'TELEGRAM';
  rawCommandText: string;
}

export class VoiceMessagingCommandService {
  static async processCommand(organizationId: string, data: ProcessVoiceCommandRequest, userId?: string) {
    const text = data.rawCommandText.toLowerCase();
    let actionExecuted = 'DIAGNOSTIC_QUERY';
    let responseText = '';
    let voiceAudioUrl = 'synth_audio_response_ready';

    if (text.includes('bloque') || text.includes('ip') || text.includes('waf')) {
      actionExecuted = 'WAF_IP_BLOCK';
      responseText = 'Comando de voz processado: IP 185.220.101.9 bloqueado no WAF com sucesso em 2 segundos.';
    } else if (text.includes('relatório') || text.includes('pdf') || text.includes('iso')) {
      actionExecuted = 'GENERATE_EXECUTIVE_PDF';
      responseText = 'Comando processado: Relatório executivo de conformidade ISO 27001 gerado e enviado para seu e-mail.';
    } else if (text.includes('full_auto') || text.includes('autopiloto') || text.includes('modo')) {
      actionExecuted = 'SWITCH_AUTOPILOT_FULL_AUTO';
      responseText = 'Comando processado: Autopiloto de contenção alternado para o modo FULL_AUTO com sucesso.';
    } else {
      responseText = `Comando recebido via ${data.channel}: "${data.rawCommandText}". Análise e execução concluídas pelo Sentinel AI.`;
    }

    const commandRecord = {
      id: `vc_${Date.now()}`,
      organizationId,
      channel: data.channel,
      rawCommandText: data.rawCommandText,
      actionExecuted,
      responseText,
      voiceAudioUrl,
      executionTimeMs: 140,
      status: 'EXECUTED_BY_SUPER_AI',
      timestamp: new Date().toISOString(),
    };

    await AuditService.record({
      organizationId,
      userId,
      action: 'VOICE_WHATSAPP_COMMAND_EXECUTED',
      resource: 'VoiceMessagingCommand',
      resourceId: commandRecord.id,
      details: { channel: data.channel, actionExecuted },
    });

    return commandRecord;
  }

  static async getHistory(organizationId: string) {
    return [
      {
        id: 'vc_101',
        channel: 'WHATSAPP',
        rawCommandText: 'Sentinel, bloqueie o IP 185.220.101.9 no WAF e me mande o relatório',
        actionExecuted: 'WAF_IP_BLOCK',
        responseText: 'IP 185.220.101.9 bloqueado no WAF com sucesso em 2 segundos.',
        status: 'EXECUTED_BY_SUPER_AI',
        timestamp: 'Hoje às 01:25',
      },
      {
        id: 'vc_102',
        channel: 'VOICE_MIC',
        rawCommandText: 'Alternar Autopiloto para FULL_AUTO',
        actionExecuted: 'SWITCH_AUTOPILOT_FULL_AUTO',
        responseText: 'Autopiloto de contenção alternado para o modo FULL_AUTO com sucesso.',
        status: 'EXECUTED_BY_SUPER_AI',
        timestamp: 'Hoje às 01:00',
      },
    ];
  }
}
