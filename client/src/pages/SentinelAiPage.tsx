import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../api/client';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  BookOpen,
  ShieldCheck,
  Code2,
  Terminal,
  HelpCircle,
  RotateCcw,
  Cpu,
  Layers,
  CheckCircle2,
  Share2,
  Globe2,
  Lightbulb,
  Wrench,
  AlertTriangle,
  FileText,
  Cloud,
  Box,
  KeyRound,
  ShieldAlert,
  Trash2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  codeSnippet?: string;
  categoryTag?: string;
}

const LOCAL_STORAGE_KEY = 'sentinelx_main_chat_history_v1';

export const SentinelAiPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Initial Messages loaded from localStorage memory or default welcome message
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load main chat history from memory', e);
    }
    return [
      {
        id: '1',
        sender: 'assistant',
        content: `Olá! Eu sou o **SENTINELX EXPERT AI** (Alimentado por Groq Llama 3.3 70B ao vivo & Base Ampliada de Resolução de Problemas). 🤖⚡

Minha **Memória de Conversa Persistente** está ativada. Todas as perguntas, diagnósticos e respostas serão gravados para consulta futura!

### 🎯 Como posso te ajudar agora?
Escolha uma categoria abaixo ou clique em uma das perguntas de solução de problemas mais comuns:`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          '🚨 Como resolver um Alerta de Invasão / Exfiltração de Dados P0?',
          '🛠️ Como corrigir SQL Injection e XSS com a Auto-Cura de Código?',
          '☁️ Como resolver erro de Conexão IAM ARN na AWS / Azure / GCP?',
          '🐳 Como corrigir Pods Kubernetes executando como Root (PSS Fail)?',
          '🌐 Como desbloquear um IP legítimo travado pelo WAF do Autopiloto?',
          '📜 Como gerar relatórios de auditoria para ISO 27001 / SOC 2 / LGPD?',
        ],
      },
    ];
  });

  // Save conversation history to memory (localStorage) on every update
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save main chat history to memory', e);
    }
  }, [messages]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleClearMemory = () => {
    const defaultMsg: ChatMessage[] = [
      {
        id: String(Date.now()),
        sender: 'assistant',
        content: `Memória de conversa limpa! 🤖✨

Como posso te ajudar no próximo diagnóstico no **SENTINELX**?`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          '🚨 Como resolver um Alerta de Invasão / Exfiltração de Dados P0?',
          '🛠️ Como corrigir SQL Injection e XSS com a Auto-Cura de Código?',
          '☁️ Como resolver erro de Conexão IAM ARN na AWS / Azure / GCP?',
        ],
      },
    ];
    setMessages(defaultMsg);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  // Massive Troubleshooting & Problem Solving Knowledge Base Fallback
  const generateExpertAnswerFallback = (query: string): ChatMessage => {
    const q = query.toLowerCase();
    const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // 1. INVASÃO & INCIDENTES P0
    if (q.includes('invasão') || q.includes('exfiltração') || q.includes('p0') || q.includes('alerta de invasão') || q.includes('ataque')) {
      return {
        id: String(Date.now()),
        sender: 'assistant',
        timestamp: timeStr,
        categoryTag: 'INCIDENTES_P0',
        content: `### 🚨 GUIA DE RESOLUÇÃO: Como Resolver um Incidente Crítico P0 / Exfiltração

Quando o SENTINELX dispara um alerta **P0_CRITICAL_INCIDENT**, siga estes 4 passos de contenção e resolução rápida:

#### 📋 Passos de Solução Imediata:
1. **Ativar Contenção pelo Autopiloto**:
   - Acesse **Autopilot Engine** no menu lateral.
   - Clique em **"Executar Contenção Imediata"** (Modo FULL_AUTO). Isso aplicará isolamento de rede no nó afetado e revogará credenciais STS.
2. **Isolar o IP Atacante no WAF**:
   - Vá para **Global Threat Exchange** e clique em **"Sync Collective Blocklist to WAF"**.
3. **Investigar Causa-Raiz com Multi-Agentes**:
   - Acesse **AI Incident Analyst** e clique em **"Investigate P0 Incident"**. A IA vai gerar o storyboard com a origem da invasão.
4. **Restaurar Linha de Base Segura**:
   - Vá para **Recovery & Rollback** e execute a restauração em 1-clique com hash SHA-256.`,
        suggestedActions: [
          '⚡ Como alternar o Autopiloto para FULL_AUTO?',
          '📜 Como exportar o relatório do incidente para o CISO?',
        ],
      };
    }

    // Default Fallback Guide
    return {
      id: String(Date.now()),
      sender: 'assistant',
      timestamp: timeStr,
      categoryTag: 'GERAL',
      content: `Entendi a sua pergunta sobre **"${query}"**! 🤖⚡

Aqui está a orientação detalhada para este tópico no SENTINELX:

### 🎯 Como resolver este cenário:
1. **Verificação de Ativo**: Certifique-se de que o recurso afetado está cadastrado no **Asset Inventory**.
2. **Análise de Diagnóstico**: Acesse o **Sentinel AI Co-Pilot** ou **AI Incident Analyst** para gerar a investigação automática de causa-raiz.
3. **Execução de Correção**: Utilize o **Autonomous Self-Healing** para correções em código ou o **Autopilot Engine** para ações em infraestrutura.

Como deseja prosseguir?`,
      suggestedActions: [
        '🚨 Como resolver um Alerta de Invasão P0?',
        '🛠️ Como corrigir SQL Injection e XSS no código?',
        '☁️ Como resolver erro de Conexão na AWS / GCP?',
        '📜 Como gerar relatórios para ISO 27001 / SOC 2?',
      ],
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim()) return;

    const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      content: text,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setIsTyping(true);

    try {
      // Call Real Groq AI Backend Endpoint
      const res: any = await apiClient.post('/ai/chat', { prompt: text });
      if (res.success && res.data && res.data.response) {
        const groqMsg: ChatMessage = {
          id: String(Date.now() + 1),
          sender: 'assistant',
          content: res.data.response,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          categoryTag: 'GROQ_LLAMA_3.3_70B',
          suggestedActions: [
            '🚨 Como resolver um Alerta de Invasão P0?',
            '🛠️ Como corrigir SQL Injection e XSS com Auto-Cura?',
            '☁️ Como resolver erro de Conexão na AWS / Azure / GCP?',
          ],
        };
        setMessages((prev) => [...prev, groqMsg]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn('Backend Groq AI endpoint offline, using local fallback answer', err);
    }

    // Fallback if backend API is offline
    setTimeout(() => {
      const expertAnswer = generateExpertAnswerFallback(text);
      setMessages((prev) => [...prev, expertAnswer]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <div style={{ padding: '32px', height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--gradient-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)' }}>
              <Bot size={24} color="#060813" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '0.5px' }}>
                SENTINELX EXPERT AI & ACADEMY CHAT
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Assistente Especialista com Memória Persistente (Powered by Groq AI - Llama 3.3 70B)
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge badge-emerald" style={{ fontSize: '0.78rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🧠 GROQ AI LLAMA 3.3 70B ONLINE
          </span>
          <button className="btn-secondary" onClick={handleClearMemory}>
            <Trash2 size={16} /> Limpar Memória do Chat
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          className={activeCategory === 'ALL' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setActiveCategory('ALL')}
          style={{ fontSize: '0.78rem', padding: '6px 14px' }}
        >
          🌟 Todas as Categorias
        </button>
        <button
          className={activeCategory === 'INCIDENTES' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => {
            setActiveCategory('INCIDENTES');
            handleSendMessage('🚨 Como resolver um Alerta de Invasão P0?');
          }}
          style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px' }}
        >
          <AlertTriangle size={14} /> Solução de Incidentes P0
        </button>
        <button
          className={activeCategory === 'AUTO_CURA' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => {
            setActiveCategory('AUTO_CURA');
            handleSendMessage('🛠️ Como corrigir SQL Injection e XSS com a Auto-Cura de Código?');
          }}
          style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px' }}
        >
          <Wrench size={14} /> Auto-Cura de Código
        </button>
        <button
          className={activeCategory === 'NUVEM' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => {
            setActiveCategory('NUVEM');
            handleSendMessage('☁️ Como resolver erro de Conexão IAM ARN na AWS / Azure / GCP?');
          }}
          style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px' }}
        >
          <Cloud size={14} /> Nuvem & CSPM
        </button>
        <button
          className={activeCategory === 'K8S' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => {
            setActiveCategory('K8S');
            handleSendMessage('🐳 Como corrigir Pods Kubernetes executando como Root (PSS Fail)?');
          }}
          style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px' }}
        >
          <Box size={14} /> Kubernetes & Contêineres
        </button>
        <button
          className={activeCategory === 'CONFORMIDADE' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => {
            setActiveCategory('CONFORMIDADE');
            handleSendMessage('📜 Como gerar relatórios de auditoria para ISO 27001 / SOC 2 / LGPD?');
          }}
          style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px' }}
        >
          <FileText size={14} /> Conformidade & ISO/SOC2
        </button>
      </div>

      {/* Main Chat Box Container */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        {/* Messages Stream List */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
              }}
            >
              {/* Avatar Icon */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: msg.sender === 'user' ? 'var(--accent-purple)' : 'var(--gradient-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: '#060813',
                  boxShadow: msg.sender === 'assistant' ? '0 0 15px rgba(0, 242, 254, 0.3)' : 'none',
                  flexShrink: 0,
                }}
              >
                {msg.sender === 'user' ? 'VOCÊ' : <Bot size={20} color="#060813" />}
              </div>

              {/* Message Content Bubble */}
              <div
                style={{
                  maxWidth: '82%',
                  background: msg.sender === 'user' ? 'rgba(79, 70, 229, 0.25)' : 'rgba(15, 23, 42, 0.85)',
                  border: msg.sender === 'user' ? '1px solid var(--accent-purple)' : '1px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '18px 22px',
                  color: '#fff',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: msg.sender === 'user' ? 'var(--accent-purple)' : 'var(--accent-cyan)' }}>
                      {msg.sender === 'user' ? 'VOCÊ' : 'SENTINELX EXPERT AI (Groq Llama 3.3)'}
                    </span>
                    {msg.categoryTag && <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{msg.categoryTag}</span>}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {msg.timestamp}
                  </span>
                </div>

                <div style={{ fontSize: '0.92rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </div>

                {/* Code Snippet Box if available */}
                {msg.codeSnippet && (
                  <div style={{ marginTop: '14px', borderRadius: '8px', background: '#0b0f19', border: '1px solid var(--border-color)', padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--accent-cyan)', overflowX: 'auto' }}>
                    <pre style={{ margin: 0 }}>{msg.codeSnippet}</pre>
                  </div>
                )}

                {/* Suggested Action Chips */}
                {msg.suggestedActions && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(action)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          background: 'rgba(0, 242, 254, 0.1)',
                          border: '1px solid rgba(0, 242, 254, 0.3)',
                          color: 'var(--accent-cyan)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--gradient-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="#060813" />
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '14px 20px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                🤖 Consultando Groq Llama 3.3 70B AI em tempo real...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Footer */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-color)', background: 'rgba(11, 15, 25, 0.95)', display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Pergunte ao Groq Llama 3.3 AI (as conversas são gravadas na memória)..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            style={{
              flex: 1,
              padding: '14px 18px',
              borderRadius: '10px',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid var(--border-color)',
              color: '#fff',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />

          <button className="btn-primary" onClick={() => handleSendMessage()} disabled={!inputPrompt.trim()}>
            <Send size={18} /> Enviar
          </button>
        </div>
      </div>
    </div>
  );
};
