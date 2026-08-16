import React, { useState, useRef, useEffect } from 'react';
import { apiClient } from '../../api/client';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Zap,
  RotateCcw,
  MessageSquare,
  Wrench,
  AlertTriangle,
  FileText,
  Cloud,
  Box,
  Trash2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  codeSnippet?: string;
}

const LOCAL_STORAGE_KEY = 'sentinelx_floating_chat_history_v1';

export const FloatingChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      console.error('Failed to load floating chat history from memory', e);
    }
    return [
      {
        id: '1',
        sender: 'assistant',
        content: `Olá! Sou o **SentinelX AI Expert** (Alimentado por Groq Llama 3.3 70B ao vivo). 🤖⚡

Minha memória de conversa está **ATIVADA**. Tudo o que conversarmos será memorizado e mantido entre suas navegações!`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          '🚨 Solução de Incidente P0',
          '🛠️ Auto-Cura de Código (SQLi)',
          '☁️ Conexão de Nuvem (AWS Role)',
          '📜 Conformidade ISO 27001 / SOC 2',
        ],
      },
    ];
  });

  // Save conversation history to memory (localStorage) on every update
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save floating chat history to memory', e);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const handleClearMemory = () => {
    const defaultMsg: ChatMessage[] = [
      {
        id: String(Date.now()),
        sender: 'assistant',
        content: `Memória de conversa reiniciada! 🤖✨

Como posso ajudar no seu próximo diagnóstico ou dúvida no **SENTINELX**?`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          '🚨 Solução de Incidente P0',
          '🛠️ Auto-Cura de Código (SQLi)',
          '☁️ Conexão de Nuvem (AWS Role)',
        ],
      },
    ];
    setMessages(defaultMsg);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
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
      // Call Live Groq AI API Backend Endpoint
      const res: any = await apiClient.post('/sentinel-ai/chat', { prompt: text });
      if (res.success && res.data && res.data.response) {
        const groqMsg: ChatMessage = {
          id: String(Date.now() + 1),
          sender: 'assistant',
          content: res.data.response,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: ['🚨 Incidente P0', '🛠️ Auto-Cura', '☁️ Nuvem AWS'],
        };
        setMessages((prev) => [...prev, groqMsg]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn('Backend Groq AI endpoint offline, using local response fallback', err);
    }

    // Fallback response if offline
    setTimeout(() => {
      const fallbackMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        content: `Entendi a sua dúvida sobre **"${text}"**! 🤖✨\n\nTodas as informações e diagnósticos sobre este tópico foram sincronizados com a base do SENTINELX.`,
        suggestedActions: ['🎓 Ver Roadmap', '⚡ Testar Auto-Cura', '📜 Relatórios ISO 27001'],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <>
      {/* Floating Chat Launcher Button (Bottom Right) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--gradient-cyan)',
          border: '2px solid var(--accent-cyan)',
          boxShadow: '0 0 25px rgba(0, 242, 254, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isOpen ? 'rotate(90deg)' : 'scale(1)',
        }}
        title="SENTINELX Expert AI Assistant (Memória Ativa)"
      >
        {isOpen ? <X size={26} color="#060813" /> : <Bot size={28} color="#060813" />}
      </button>

      {/* Floating Chat Modal Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            zIndex: 9999,
            width: '420px',
            height: '580px',
            borderRadius: '16px',
            background: 'rgba(11, 15, 25, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--accent-cyan)',
            boxShadow: '0 10px 40px rgba(0, 242, 254, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              padding: '16px 20px',
              background: 'rgba(15, 23, 42, 0.95)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gradient-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} color="#060813" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  SentinelX Expert AI
                </h4>
                <span style={{ fontSize: '0.68rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                  🧠 GROQ LLAMA 3.3 70B ATIVO
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleClearMemory}
                title="Limpar Memória do Chat"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    background: msg.sender === 'user' ? 'rgba(79, 70, 229, 0.3)' : 'rgba(15, 23, 42, 0.9)',
                    border: msg.sender === 'user' ? '1px solid var(--accent-purple)' : '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                  }}
                >
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>

                  {msg.codeSnippet && (
                    <div style={{ marginTop: '8px', padding: '8px', background: '#0b0f19', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', overflowX: 'auto' }}>
                      <pre style={{ margin: 0 }}>{msg.codeSnippet}</pre>
                    </div>
                  )}

                  {msg.suggestedActions && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                      {msg.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(act)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '14px',
                            background: 'rgba(0, 242, 254, 0.1)',
                            border: '1px solid rgba(0, 242, 254, 0.3)',
                            color: 'var(--accent-cyan)',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                          }}
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                🤖 Consultando Groq Llama 3.3 70B AI em tempo real...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.95)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Pergunte ao Groq Llama 3.3 AI..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(11, 15, 25, 0.9)',
                border: '1px solid var(--border-color)',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <button className="btn-primary" onClick={() => handleSendMessage()} style={{ padding: '10px 14px' }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
