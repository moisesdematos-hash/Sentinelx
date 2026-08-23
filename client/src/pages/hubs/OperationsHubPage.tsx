import React from 'react';
import {
  Building,
  CreditCard,
  Terminal,
  Key,
  Settings,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface OperationsHubPageProps {
  onNavigate: (tabId: string) => void;
}

export const OperationsHubPage: React.FC<OperationsHubPageProps> = ({ onNavigate }) => {
  const operationsFeatures = [
    {
      id: 'msp',
      title: 'Central MSSP Multi-Tenant (Parceiros)',
      description: 'Gestão centralizada de múltiplos clientes/organizações com personalização de marca e governança delegada.',
      icon: Building,
      badge: 'MSSP MULTI-TENANT',
      color: 'var(--accent-cyan)',
    },
    {
      id: 'finops',
      title: 'Otimização FinOps (Redução de Custos Cloud)',
      description: 'Identificação de volumes EBS orfãos, instâncias EC2 ociosas e oportunidades de redução de desperdício em nuvem.',
      icon: CreditCard,
      badge: 'FINOPS ENGINE',
      color: 'var(--accent-emerald)',
    },
    {
      id: 'siem',
      title: 'Integrações SIEM / Webhooks Externos (Splunk / Datadog)',
      description: 'Encaminhamento automático de alertas e logs em formato CEF/JSON para Splunk, Datadog ou AWS Security Lake.',
      icon: Terminal,
      badge: 'EXTERNAL FORWARD',
      color: 'var(--accent-purple)',
    },
    {
      id: 'subscriptions',
      title: 'Assinaturas, Entitlements & Cotas SaaS',
      description: 'Monitoramento de cotas de uso de ativos, varreduras mensais e integração com AWS / Azure Marketplace.',
      icon: CreditCard,
      badge: 'MARKETPLACE',
      color: 'var(--accent-amber)',
    },
    {
      id: 'api',
      title: 'Chaves de API & Webhooks de Notificação',
      description: 'Geração de tokens API com permissões com escopo (read/write/scans) e gerenciamento de webhooks.',
      icon: Key,
      badge: 'API GATEWAY',
      color: 'var(--accent-cyan)',
    },
    {
      id: 'admin-panel',
      title: 'Painel de Administração da Plataforma',
      description: 'Configurações de usuários, controle de permissões de RBAC e auditoria de sistema.',
      icon: Settings,
      badge: 'SUPER ADMIN',
      color: 'var(--accent-cyan)',
    },
  ];

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--gradient-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(0, 242, 254, 0.4)' }}>
          <Settings size={28} color="#060813" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.5px' }}>
              CENTRAL DE OPERAÇÕES, FINOPS & MSP/MSSP
            </h2>
            <span className="badge badge-cyan" style={{ fontSize: '0.8rem' }}>
              GESTAO DE PLATAFORMA
            </span>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Gerencie integrações, parceiros MSSP, chaves de API, webhooks e otimização financeira:
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
        {operationsFeatures.map((item) => {
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
