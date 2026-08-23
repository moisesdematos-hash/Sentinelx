import React from 'react';
import { Cloud, ShieldCheck, ArrowRight, Server, Layers } from 'lucide-react';

interface CloudSecurityHubPageProps {
  onNavigate: (tabId: string) => void;
}

export const CloudSecurityHubPage: React.FC<CloudSecurityHubPageProps> = ({ onNavigate }) => {
  const cloudFeatures = [
    {
      id: 'cloud-connectors',
      title: 'Conectores de Nuvem (AWS / Azure / GCP)',
      description: 'Gerenciamento de conexões seguras via Role ARN e credenciais criptografadas para desbravar recursos de nuvem.',
      icon: Cloud,
      badge: 'MULTI-CLOUD',
      color: 'var(--accent-cyan)',
    },
    {
      id: 'cloud-posture',
      title: 'Postura de Nuvem (CSPM & IAM Audit)',
      description: 'Varredura automática de buckets S3 públicos, grupos de segurança abertos, MFA e políticas IAM com wildcards.',
      icon: ShieldCheck,
      badge: 'CSPM ENGINE',
      color: 'var(--accent-emerald)',
    },
    {
      id: 'container-security',
      title: 'Segurança de Contêineres & Cluster Kubernetes',
      description: 'Auditoria de Workloads Pod Security Standards (PSS), imagens Docker e isolamento de runtime em K8s.',
      icon: Layers,
      badge: 'K8S CLUSTER',
      color: 'var(--accent-amber)',
    },
  ];

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--gradient-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(0, 242, 254, 0.4)' }}>
          <Cloud size={28} color="#060813" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.5px' }}>
              CENTRAL DE SEGURANÇA DE NUVEM (CSPM)
            </h2>
            <span className="badge badge-cyan" style={{ fontSize: '0.8rem' }}>
              AWS / AZURE / GCP / K8S
            </span>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Monitore, audite e proteja sua infraestrutura multicloud e clusters Kubernetes:
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
        {cloudFeatures.map((item) => {
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
