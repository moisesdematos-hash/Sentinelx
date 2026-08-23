import React from 'react';
import {
  FileCheck,
  BookOpen,
  Globe,
  Key,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ComplianceHubPageProps {
  onNavigate: (tabId: string) => void;
}

export const ComplianceHubPage: React.FC<ComplianceHubPageProps> = ({ onNavigate }) => {
  const complianceFeatures = [
    {
      id: 'compliance',
      title: 'Auditor de Conformidade Contínua (ISO 27001 / SOC 2 / LGPD)',
      description: 'Mapeamento automatizado de evidências técnicas para controles ISO 27001 (A.12.6.1), SOC 2 Type II e LGPD Artigo 46.',
      icon: FileCheck,
      badge: '100% COMPLIANT',
      color: 'var(--accent-emerald)',
    },
    {
      id: 'executive-reporting',
      title: 'Relatórios Executivos para o Conselho (Board PDF)',
      description: 'Geração em 1-clique de relatórios visuais focados em ROI, prevenção de perdas e atestado de segurança.',
      icon: BookOpen,
      badge: 'BOARD PDF',
      color: 'var(--accent-purple)',
    },
    {
      id: 'brand-protection',
      title: 'Proteção de Marca & Monitoramento de Darkweb',
      description: 'Detecção de domínios clonados (typosquatting), vazamentos de credenciais na darkweb e remoção de phishing.',
      icon: Globe,
      badge: 'DARKWEB MONITOR',
      color: 'var(--accent-cyan)',
    },
    {
      id: 'identity',
      title: 'Identidade Zero Trust & Acesso JIT (Just-In-Time)',
      description: 'Avaliação contínua de risco de identidades, MFA obrigatório e concessão temporária de privilégios elevados (JIT).',
      icon: Key,
      badge: 'ZERO TRUST IAM',
      color: 'var(--accent-amber)',
    },
    {
      id: 'microsegmentation',
      title: 'Microsegmentação de Rede Zero Trust',
      description: 'Políticas de isolamento de rede por tags de ambiente (DMZ, PCI Vault, Produção) com bloqueio preventivo.',
      icon: Layers,
      badge: 'NETWORK SEGMENT',
      color: 'var(--accent-cyan)',
    },
  ];

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--gradient-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(0, 242, 254, 0.4)' }}>
          <FileCheck size={28} color="#060813" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.5px' }}>
              CENTRAL DE CONFORMIDADE, GOVERNANÇA & AUDITORIA
            </h2>
            <span className="badge badge-emerald" style={{ fontSize: '0.8rem' }}>
              ISO 27001 / SOC 2 / LGPD
            </span>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Gerencie passaportes de conformidade, relatórios executivos para o conselho e auditoria Zero Trust:
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
        {complianceFeatures.map((item) => {
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
