import React from 'react';
import {
  LayoutDashboard,
  Server,
  Shield,
  Bot,
  Activity,
  Globe,
  Database,
  Cloud,
  Layers,
  Cpu,
  Share2,
  AlertTriangle,
  FileCheck,
  Building,
  Key,
  CreditCard,
  Lock,
  Smartphone,
  Sparkles,
  Terminal,
  ShieldAlert,
  ShieldCheck,
  Award,
  Settings,
  HelpCircle,
  Zap,
  RotateCcw,
  BookOpen,
  Home,
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onGoLanding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onGoLanding }) => {
  const menuGroups: MenuGroup[] = [
    {
      title: 'PLATAFORMA',
      items: [
        { id: 'welcome', label: 'Landing Page & Planos', icon: Home, badge: 'SAAS' },
        { id: 'dashboard', label: 'Painel Principal', icon: LayoutDashboard },
        { id: 'admin-panel', label: 'Painel de Administração', icon: Settings, badge: 'ADMIN' },
        { id: 'mastery-benchmark', label: 'Mastery & Certificação', icon: Award, badge: '100%' },
        { id: 'assets', label: 'Inventário de Ativos', icon: Server },
        { id: 'monitoring', label: 'Monitoramento Contínuo', icon: Activity },
      ],
    },
    {
      title: 'PROTEÇÃO DE ATIVOS',
      items: [
        { id: 'server-security', label: 'Segurança de Servidores', icon: Server },
        { id: 'api-security', label: 'Segurança de APIs REST', icon: Globe },
        { id: 'container-security', label: 'Segurança de Contêineres', icon: Layers },
        { id: 'mobile-security', label: 'Segurança Mobile (APK)', icon: Smartphone },
        { id: 'edge-security', label: 'Borda & WAF / DDoS', icon: Zap },
      ],
    },
    {
      title: 'NUVEM & INFRAESTRUTURA',
      items: [
        { id: 'cloud-connectors', label: 'Conectores de Nuvem', icon: Cloud },
        { id: 'cloud-posture', label: 'Postura de Nuvem (CSPM)', icon: ShieldCheck },
      ],
    },
    {
      title: 'DETECÇÃO & ANÁLISE',
      items: [
        { id: 'event-bus', label: 'Barramento de Eventos', icon: Cpu },
        { id: 'detection-engine', label: 'Motor de Detecção', icon: ShieldAlert },
        { id: 'security-graph', label: 'Grafo de Conhecimento', icon: Share2 },
        { id: 'risk-engine', label: 'Motor de Risco Contextual', icon: AlertTriangle },
        { id: 'incidents', label: 'Central de Incidentes', icon: ShieldAlert },
        { id: 'threat-intel', label: 'Inteligência de Ameaças', icon: Globe },
        { id: 'threat-exchange', label: 'Troca Global de Ameaças', icon: Share2 },
      ],
    },
    {
      title: 'AUTONOMIA & IA',
      items: [
        { id: 'sentinel-ai', label: 'Sentinel AI Co-Pilot', icon: Bot, badge: 'GROQ' },
        { id: 'ai-investigations', label: 'AI Incident Analyst', icon: Sparkles },
        { id: 'autopilot', label: 'Autopiloto de Contenção', icon: Zap },
        { id: 'soar', label: 'Orquestração SOAR', icon: Terminal },
        { id: 'self-healing', label: 'Auto-Cura (Self-Healing)', icon: Sparkles, badge: 'AUTO-PR' },
        { id: 'remediation', label: 'Engine de Remediação', icon: RotateCcw },
        { id: 'recovery', label: 'Recuperação & Rollback', icon: RotateCcw },
      ],
    },
    {
      title: 'GOVERNAÇA & OPERAÇÕES',
      items: [
        { id: 'compliance', label: 'Auditor de Conformidade', icon: FileCheck },
        { id: 'siem', label: 'Integrações SIEM / SOAR', icon: Terminal },
        { id: 'deception', label: 'Deception & Honeytokens', icon: Lock },
        { id: 'microsegmentation', label: 'Microsegmentação de Rede', icon: Layers },
        { id: 'identity', label: 'Identidade Zero Trust', icon: Key },
        { id: 'finops', label: 'Otimização FinOps', icon: CreditCard },
        { id: 'brand-protection', label: 'Proteção de Marca & Darkweb', icon: Globe },
        { id: 'executive-reporting', label: 'Relatórios Executivos', icon: BookOpen },
        { id: 'msp', label: 'Central MSSP Multi-Tenant', icon: Building },
        { id: 'subscriptions', label: 'Assinaturas & Cotas', icon: CreditCard },
        { id: 'api', label: 'API & Webhooks', icon: Key },
      ],
    },
  ];

  const handleLogoClick = () => {
    if (onGoLanding) {
      onGoLanding();
    } else {
      setActiveTab('welcome');
    }
  };

  return (
    <aside
      style={{
        width: '280px',
        height: '100vh',
        background: 'rgba(11, 15, 25, 0.95)',
        backdropFilter: 'blur(16px)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    >
      {/* Brand Header (Click to return to Public Landing Page) */}
      <div
        onClick={handleLogoClick}
        title="Voltar para a Página Inicial (Landing Page)"
        style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--gradient-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)',
          }}
        >
          <Shield size={20} color="#060813" />
        </div>
        <div>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 900,
              letterSpacing: '0.5px',
              background: 'var(--gradient-cyan)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SENTINELX
          </h1>
          <span
            style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '1px',
            }}
          >
            ENTERPRISE PLATFORM
          </span>
        </div>
      </div>

      {/* Navigation List (Scrollable) */}
      <nav
        style={{
          flex: 1,
          padding: '16px 12px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: 'var(--text-muted)',
                letterSpacing: '1px',
                padding: '0 12px 8px 12px',
              }}
            >
              {group.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'welcome' && onGoLanding) {
                        onGoLanding();
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: isActive ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                      color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={18} color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`badge ${
                          item.badge === 'ADMIN'
                            ? 'badge-purple'
                            : item.badge === 'GROQ' || item.badge === 'SAAS'
                            ? 'badge-cyan'
                            : 'badge-emerald'
                        }`}
                        style={{ fontSize: '0.65rem', padding: '2px 6px' }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* System Status Card Footer */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(6, 8, 19, 0.8)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status do Autopiloto</span>
          <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
            ONLINE
          </span>
        </div>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
          FULL_AUTO (100% Autônomo)
        </div>
      </div>
    </aside>
  );
};
