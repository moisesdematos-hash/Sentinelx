import React, { useState } from 'react';
import { Activity, ShieldAlert, Network, Gauge, AlertTriangle, Workflow, ArrowRight, LayoutGrid, List } from 'lucide-react';

interface SiemXdrHubPageProps {
  onNavigate: (tabId: string) => void;
}

export const SiemXdrHubPage: React.FC<SiemXdrHubPageProps> = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState<'MOSAIC' | 'LINE'>('MOSAIC');

  const siemFeatures = [
    {
      id: 'event-bus',
      title: 'Barramento de Eventos (Event Normalizer)',
      description: 'Stream de alta velocidade para ingestão, normalização CEF/JSON e triagem de logs brutos.',
      icon: Activity,
      badge: 'EVENT STREAM',
      color: 'var(--accent-cyan)',
    },
    {
      id: 'detection-engine',
      title: 'Motor de Detecção (Sigma & YARA Rules)',
      description: 'Regras de detecção em tempo real para capturar força bruta, exfiltração, escalada e anomalias.',
      icon: ShieldAlert,
      badge: 'SIGMA ENGINE',
      color: 'var(--accent-rose)',
    },
    {
      id: 'security-graph',
      title: 'Grafo de Conhecimento (Security Graph Mesh)',
      description: 'Mapeamento interativo das relações e múltiplos hops de ataque (Usuário → Endpoint → Nuvem).',
      icon: Network,
      badge: 'GRAPH MESH',
      color: 'var(--accent-purple)',
    },
    {
      id: 'risk-engine',
      title: 'Motor de Risco Contextual (Contextual Risk)',
      description: 'Cálculo automatizado da matriz de prioridade de ação (P0 a P3) com fatores ponderados.',
      icon: Gauge,
      badge: 'RISK SCORE',
      color: 'var(--accent-amber)',
    },
    {
      id: 'incidents',
      title: 'Central de Incidentes & Resolução',
      description: 'Gestão completa do ciclo de vida de incidentes com SLA, timeline forense e triagem.',
      icon: AlertTriangle,
      badge: 'XDR CENTER',
      color: 'var(--accent-rose)',
    },
    {
      id: 'soar',
      title: 'Orquestração SOAR & Response Engine',
      description: 'Execução de playbooks autônomos de contenção com auditoria imutável de ações executadas.',
      icon: Workflow,
      badge: 'SOAR ENGINE',
      color: 'var(--accent-cyan)',
    },
  ];

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

        {/* View Mode Toggle: Mosaico vs Linha */}
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

      {/* Modo Mosaico */}
      {viewMode === 'MOSAIC' && (
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
                    <span className="badge badge-purple" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
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

      {/* Modo Linha */}
      {viewMode === 'LINE' && (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(11, 15, 25, 0.9)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>FUNCIONALIDADE SIEM/XDR</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TAG</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DESCRIÇÃO TÉCNICA</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>AÇÃO</th>
              </tr>
            </thead>
            <tbody>
              {siemFeatures.map((item) => {
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
                      <span className="badge badge-purple">{item.badge}</span>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                      {item.description}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button className="btn-primary" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                        Abrir Módulo →
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
