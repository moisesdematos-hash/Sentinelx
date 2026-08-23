import React from 'react';
import {
  Cpu,
  ShieldAlert,
  Share2,
  AlertTriangle,
  Globe,
  Terminal,
  ArrowRight,
  Activity,
} from 'lucide-react';

interface SiemXdrHubPageProps {
  onNavigate: (tabId: string) => void;
}

export const SiemXdrHubPage: React.FC<SiemXdrHubPageProps> = ({ onNavigate }) => {
  const siemFeatures = [
    {
      id: 'event-bus',
      title: 'Barramento de Eventos (Event Normalizer)',
      description: 'Stream de alta velocidade para ingestão, normalização CEF/JSON e triagem de logs brutos.',
      icon: Cpu,
      badge: 'EVENT STREAM',
      color: 'var(--accent-cyan)',
    },
    {
      id: 'detection-engine',
      title: 'Motor de Detecção (Sigma & YARA Rules)',
      description: 'Regras de detecção em tempo real para capturar força bruta, exfiltração, escalada e anomalias.',
      icon: ShieldAlert,
      badge: 'SIGMA ENGINE',
      color: '#ff4b4b',
    },
    {
      id: 'security-graph',
      title: 'Grafo de Conhecimento (Security Graph Mesh)',
      description: 'Mapeamento interativo das relações e múltiplos hops de ataque (Usuário -> Endpoint -> Nuvem).',
      icon: Share2,
      badge: 'GRAPH MESH',
      color: 'var(--accent-purple)',
    },
    {
      id: 'risk-engine',
      title: 'Motor de Risco Contextual (Contextual Risk)',
      description: 'Cálculo automatizado da matriz de prioridade de ação (P0 a P3) com fatores ponderados.',
      icon: AlertTriangle,
      badge: 'RISK SCORE',
      color: 'var(--accent-amber)',
    },
    {
      id: 'incidents',
      title: 'Central de Incidentes & Resolução',
      description: 'Gestão completa do ciclo de vida de incidentes com SLA, timeline forense e triagem.',
      icon: ShieldAlert,
      badge: 'XDR CENTER',
      color: '#ff4b4b',
    },
    {
      id: 'soar',
      title: 'Orquestração SOAR & Response Engine',
      description: 'Execução de playbooks autônomos de contenção com auditoria imutável de ações executadas.',
      icon: Terminal,
      badge: 'SOAR ENGINE',
      color: 'var(--accent-cyan)',
    },
    {
      id: 'threat-intel',
      title: 'Inteligência de Ameaças (MISP / CISA KEV)',
      description: 'Feeds de inteligência global sincronizados com a lista de ativos para cruzamento automático de IOCs.',
      icon: Globe,
      badge: 'MISP FEEDS',
      color: 'var(--accent-emerald)',
    },
    {
      id: 'threat-exchange',
      title: 'Troca Global de Ameaças (Global Threat Exchange)',
      description: 'Rede anônima peer-to-peer para compartilhamento imediato de hashes de malware e IPs nocivos.',
      icon: Share2,
      badge: 'SWARM NETWORK',
      color: 'var(--accent-cyan)',
    },
  ];

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--gradient-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(0, 242, 254, 0.4)' }}>
          <Activity size={28} color="#060813" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.5px' }}>
              CENTRAL DE SIEM, XDR & GRAFO DE RISCO
            </h2>
            <span className="badge badge-purple" style={{ fontSize: '0.8rem' }}>
              CORRELAÇÃO UNIFICADA
            </span>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Explore o barramento de eventos, grafo de ameaças, regras de detecção e correlação XDR:
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
        {siemFeatures.map((item) => {
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
                  <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
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
