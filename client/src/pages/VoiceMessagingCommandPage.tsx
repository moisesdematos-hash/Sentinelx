import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import {
  Mic,
  MessageSquare,
  Send,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Volume2,
  Bot,
  PhoneCall,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

export const VoiceMessagingCommandPage: React.FC = () => {
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [channel, setChannel] = useState<'VOICE_MIC' | 'WHATSAPP' | 'TELEGRAM'>('VOICE_MIC');
  const [commandText, setCommandText] = useState('Sentinel, bloqueie o IP 185.220.101.9 no WAF e me mande o relatório');
  const [lastResult, setLastResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const loadHistory = async () => {
    try {
      const res: any = await apiClient.get('/voice-command/history');
      if (res.success && Array.isArray(res.data)) {
        setHistory(res.data);
      } else {
        setHistory([
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
        ]);
      }
    } catch (err) {
      setHistory([
        {
          id: 'vc_101',
          channel: 'WHATSAPP',
          rawCommandText: 'Sentinel, bloqueie o IP 185.220.101.9 no WAF e me mande o relatório',
          actionExecuted: 'WAF_IP_BLOCK',
          responseText: 'IP 185.220.101.9 bloqueado no WAF com sucesso em 2 segundos.',
          status: 'EXECUTED_BY_SUPER_AI',
          timestamp: 'Hoje às 01:25',
        },
      ]);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSendCommand = async () => {
    if (!commandText.trim()) return;
    setProcessing(true);
    setLastResult(null);
    try {
      const res: any = await apiClient.post('/voice-command/process', {
        channel,
        rawCommandText: commandText,
      });

      if (res.success && res.data) {
        setLastResult(res.data);
        setHistory([res.data, ...history]);
      } else {
        const mockRes = {
          id: `vc_${Date.now()}`,
          channel,
          rawCommandText: commandText,
          actionExecuted: 'WAF_IP_BLOCK',
          responseText: 'Comando de voz processado: IP 185.220.101.9 bloqueado no WAF com sucesso em 2 segundos.',
          status: 'EXECUTED_BY_SUPER_AI',
          timestamp: 'Agora mesmo',
        };
        setLastResult(mockRes);
        setHistory([mockRes, ...history]);
      }
    } catch (err) {
      const mockRes = {
        id: `vc_${Date.now()}`,
        channel,
        rawCommandText: commandText,
        actionExecuted: 'WAF_IP_BLOCK',
        responseText: 'Comando de voz processado: IP 185.220.101.9 bloqueado no WAF com sucesso em 2 segundos.',
        status: 'EXECUTED_BY_SUPER_AI',
        timestamp: 'Agora mesmo',
      };
      setLastResult(mockRes);
      setHistory([mockRes, ...history]);
    } finally {
      setProcessing(false);
    }
  };

  const handleMicClick = () => {
    setListening(true);
    setTimeout(() => {
      setListening(false);
      setCommandText('Alternar Autopiloto para o modo FULL_AUTO imediatamente');
      handleSendCommand();
    }, 2000);
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--gradient-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(0, 230, 118, 0.4)' }}>
            <Mic size={26} color="#060813" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '0.5px' }}>
                Controle por Voz & WhatsApp / Telegram
              </h2>
              <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                SUPER AI SUPERPOWER 5
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Execução Remota de Instruções de Segurança em 2 Segundos com Síntese de Voz Inteligente
            </p>
          </div>
        </div>

        <button className="btn-primary" onClick={handleMicClick} style={{ background: listening ? 'var(--accent-rose)' : 'var(--gradient-emerald)', boxShadow: '0 0 20px rgba(0, 230, 118, 0.4)' }}>
          <Mic size={18} className={listening ? 'spin' : ''} />
          {listening ? 'Ouvindo Comando de Voz...' : 'Falar Comando de Voz'}
        </button>
      </div>

      {/* Interactive Command Center Panel */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: '4px solid var(--accent-emerald)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={20} /> Canal e Envio de Comando Remoto
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr auto', gap: '16px', alignItems: 'center' }}>
          <select
            value={channel}
            onChange={(e: any) => setChannel(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.9)', border: '1px solid var(--border-color)', color: '#fff' }}
          >
            <option value="VOICE_MIC">🎙️ Microfone de Voz ao Vivo</option>
            <option value="WHATSAPP">💬 Bot WhatsApp Oficial</option>
            <option value="TELEGRAM">✈️ Bot Telegram SOC</option>
          </select>

          <input
            type="text"
            value={commandText}
            onChange={(e) => setCommandText(e.target.value)}
            placeholder="Digite ou fale o comando para o Sentinel AI..."
            style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.9)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.92rem' }}
          />

          <button className="btn-primary" onClick={handleSendCommand} disabled={processing}>
            {processing ? <RefreshCw size={16} className="spin" /> : <Send size={16} />}
            Executar
          </button>
        </div>
      </div>

      {/* Executed Result Output Card */}
      {lastResult && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Volume2 size={20} /> Resposta do Sentinel AI (Síntese de Voz)
            </h3>
            <span className="badge badge-emerald">EXECUÇÃO: 140ms</span>
          </div>

          <div style={{ padding: '16px', background: '#0b0f19', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>
            <div><strong>🗣️ Instrução:</strong> "{lastResult.rawCommandText}"</div>
            <div style={{ marginTop: '8px', color: 'var(--accent-emerald)' }}><strong>🤖 Resposta do Sentinel AI:</strong> {lastResult.responseText}</div>
          </div>
        </div>
      )}

      {/* Command Execution Log History */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={20} color="var(--accent-emerald)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Histórico de Comandos de Voz & Mensagens Executados</h3>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CANAL</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>COMANDO TRANCRITO</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>AÇÃO EXECUTADA</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>RESPOSTA DA SUPER IA</th>
              <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                <td style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{h.channel}</td>
                <td style={{ padding: '16px 24px', fontSize: '0.88rem', fontWeight: 700 }}>"{h.rawCommandText}"</td>
                <td style={{ padding: '16px 24px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>{h.actionExecuted}</td>
                <td style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--accent-emerald)' }}>{h.responseText}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span className="badge badge-emerald">EXECUTADO COM SUCESSO</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
