import React, { useState } from 'react';
import {
  Bot,
  Key,
  ShieldAlert,
  Cpu,
  Lock,
  RotateCcw,
  Volume2,
  Globe,
  DollarSign,
  Search,
  Sparkles,
  Zap,
  ArrowRight,
  LayoutGrid,
  List,
} from 'lucide-react';

interface SuperAiHubPageProps {
  onNavigate: (tabId: string) => void;
}

export const SuperAiHubPage: React.FC<SuperAiHubPageProps> = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState<'MOSAIC' | 'LINE'>('MOSAIC');

  const superAiFeatures = [
    {
      id: 'sentinel-ai',
      title: 'Sentinel AI Co-Pilot (Engenheiro Instrutor)',
      description: 'Assistente e Engenheiro Instrutor de Cibersegurança em tempo real com explicações exaustivas de causa-raiz e código.',
      icon: Bot,
      badge: 'GROQ LLAMA 3.3',
      color: 'var(--accent-cyan)',
    },
    {
      id: 'super-ai-suite',
      title: 'Super AI Suite & Botão do Pânico Quântico',
      description: 'Orquestrador Multi-LLM (Groq, DeepSeek R1, Gemini 2.5), RAG Vetorial e Isolamento Imediato em Air-Gap.',
      icon: Key,
      badge: 'GOLDEN KEYS',
      color: 'var(--accent-amber)',
    },
    {
      id: 'red-teaming',
      title: 'Red Teaming Autônomo & Simulação de Ataques',
      description: 'Simulações éticas 24/7 de vetores Mitre ATT&CK para descobrir brechas antes de hackers reais.',
      icon: ShieldAlert,
      badge: 'SUPER AI 1',
      color: 'var(--accent-rose)',
    },
    {
      id: 'ebpf-hotpatch',
      title: 'Campo de Força eBPF (Kernel Hot-Patching)',
      description: 'Injeção de kprobes no Ring 0 do Kernel para neutralização de Zero-Days sem reiniciar o servidor.',
      icon: Cpu,
      badge: 'SUPER AI 2',
      color: 'var(--accent-cyan)',
    },
    {
      id: 'honeytokens',
      title: 'Armadilhas Honeytokens & Deception',
      description: 'Geração de chaves AWS e cookies decoy sintéticos para detectar e banir atacantes instantaneamente.',
      icon: Lock,
      badge: 'SUPER AI 3',
      color: 'var(--accent-purple)',
    },
    {
      id: 'quantum-rollback',
      title: 'Reversão Quântica Anti-Ransomware (18ms)',
      description: 'Restauração de sistema e banco de dados infectados com validação criptográfica SHA-256 em 18ms.',
      icon: RotateCcw,
      badge: 'SUPER AI 4',
      color: 'var(--accent-emerald)',
    },
    {
      id: 'voice-command',
      title: 'Comando por Voz Cyber-Assistente',
      description: 'Controle mãos-livres da plataforma por comandos de voz processados nativamente via Groq AI.',
      icon: Volume2,
      badge: 'SUPER AI 5',
      color: 'var(--accent-cyan)',
    },
    {
      id: 'global-swarm',
      title: 'Inteligência Enxame Global (Swarm Immunity)',
      description: 'Imunidade distribuída em rede: se 1 cliente detecta uma nova ameaça, todos os outros 1,000+ ficam imunes.',
      icon: Globe,
      badge: 'SUPER AI 6',
      color: 'var(--accent-purple)',
    },
    {
      id: 'finops-sentinel',
      title: 'Sentinel FinOps Anti-Cryptojacking',
      description: 'Detecção de mineração maliciosa de criptomoedas no Ring 0 e contenção autônoma de custos de nuvem.',
      icon: DollarSign,
      badge: 'SUPER AI 7',
      color: 'var(--accent-emerald)',
    },
    {
      id: 'ai-investigations',
      title: 'Investigador Forense com IA (Grafos)',
      description: 'Reconstrução de linha do tempo de incidentes com correlação em grafo e exportação de relatórios.',
      icon: Search,
      badge: 'FORENSICS',
      color: 'var(--accent-amber)',
    },
  ];

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--gradient-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(0, 242, 254, 0.4)' }}>
            <Sparkles size={28} color="#060813" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.5px' }}>
                CENTRAL DE AUTONOMIA & SUPER IA
              </h2>
              <span className="badge badge-cyan" style={{ fontSize: '0.8rem' }}>
                10 MOTORES ATIVOS
              </span>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Selecione qualquer motor de IA abaixo ou use o seletor para alternar a visualização:
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn-secondary" onClick={() => onNavigate('dashboard')} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            ← Voltar ao Painel
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(11, 15, 25, 0.9)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('MOSAIC')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'MOSAIC' ? 'var(--accent-cyan)' : 'transparent',
                color: viewMode === 'MOSAIC' ? '#060813' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Modo Mosaico (Cards Grid)"
            >
              <LayoutGrid size={16} /> Mosaico
            </button>
            <button
              onClick={() => setViewMode('LINE')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'LINE' ? 'var(--accent-cyan)' : 'transparent',
                color: viewMode === 'LINE' ? '#060813' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Modo Linha (Tabela)"
            >
              <List size={16} /> Linha
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Sub-Features (Mosaico) */}
      {viewMode === 'MOSAIC' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
          {superAiFeatures.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.22s ease',
                  borderLeft: `4px solid ${item.color}`,
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={22} color={item.color} />
                    </div>
                    <span className="badge badge-amber" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: item.color, marginTop: '8px' }}>
                  <span>Abrir Funcionalidade</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modo Linha (Table List View) */}
      {viewMode === 'LINE' && (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SUPER PODER DE IA</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PROVEDOR / MOTOR</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DESCRIÇÃO TÉCNICA</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>AÇÃO</th>
              </tr>
            </thead>
            <tbody>
              {superAiFeatures.map((item) => {
                const Icon = item.icon;
                return (
                  <tr
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)', cursor: 'pointer' }}
                  >
                    <td style={{ padding: '16px 24px', fontWeight: 700, color: '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={18} color={item.color} />
                        <span>{item.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className="badge badge-amber">{item.badge}</span>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                      {item.description}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button className="btn-primary" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                        Executar →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
