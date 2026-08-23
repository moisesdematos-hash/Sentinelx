import React from 'react';
import {
  Sparkles,
  Bot,
  Flame,
  Cpu,
  Lock,
  RotateCcw,
  Mic,
  Globe,
  CreditCard,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface SuperAiHubPageProps {
  onNavigate: (tabId: string) => void;
}

export const SuperAiHubPage: React.FC<SuperAiHubPageProps> = ({ onNavigate }) => {
  const aiFeatures = [
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
      description: 'Orquestrador Multi-LLM (Groq, DeepSeek R1, Gemini 2.5), RAG Vetorial e isolamento imediato em Air-Gap.',
      icon: Sparkles,
      badge: 'GOLDEN KEYS',
      color: 'var(--accent-amber)',
    },
    {
      id: 'red-teaming',
      title: 'Red Teaming Autônomo & Simulação de Ataques',
      description: 'Simulações éticas 24/7 de vetores Mitre ATT&CK para descobrir brechas antes de hackers reais.',
      icon: Flame,
      badge: 'SUPER AI 1',
      color: '#ff4b4b',
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
      title: 'Comando por Voz & WhatsApp / Telegram',
      description: 'Execução de ordens de SOC por microfone ao vivo ou mensagens no WhatsApp com voz sintetizada.',
      icon: Mic,
      badge: 'SUPER AI 5',
      color: 'var(--accent-cyan)',
    },
    {
      id: 'global-swarm',
      title: 'Imunidade Coletiva Swarm (24ms)',
      description: 'Propagação global de vacinas cibernéticas sintéticas para mais de 14.250 nós no mundo em 24ms.',
      icon: Globe,
      badge: 'SUPER AI 6',
      color: 'var(--accent-emerald)',
    },
    {
      id: 'finops-sentinel',
      title: 'Escudo Financeiro FinOps (Anti-Cryptojacking)',
      description: 'Purga de mineradores de criptomoeda parasitas e redução de até 70% em custos de nuvem.',
      icon: CreditCard,
      badge: 'SUPER AI 7',
      color: 'var(--accent-amber)',
    },
    {
      id: 'ai-investigations',
      title: 'AI Incident Analyst (RCA Autônomo)',
      description: 'Investigação profunda de causa-raiz com geração de storyboard de ataque e briefing para CISO.',
      icon: Sparkles,
      badge: 'AUTÔNOMO',
      color: 'var(--accent-purple)',
    },
    {
      id: 'autopilot',
      title: 'Autopiloto de Contenção (FULL_AUTO)',
      description: 'Motor de contenção e isolamento automático de ameaças com tempo de resposta em milissegundos.',
      icon: Zap,
      badge: 'FULL_AUTO',
      color: 'var(--accent-emerald)',
    },
    {
      id: 'self-healing',
      title: 'Auto-Cura de Código (Self-Healing AST)',
      description: 'Síntese de patches de código com análise AST e suíte de testes (0% de Risco de Regressão).',
      icon: Sparkles,
      badge: 'AUTO-PR',
      color: 'var(--accent-cyan)',
    },
  ];

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
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
              12 MOTORES ATIVOS
            </span>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Selecione qualquer uma das funcionalidades avançadas de inteligência artificial e proteção autônoma abaixo:
          </p>
        </div>
      </div>

      {/* Grid of Sub-Features */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
        {aiFeatures.map((item) => {
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
                  <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
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
    </div>
  );
};
