import React, { useState, useMemo } from 'react';
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
  X,
  Flame,
  Mic,
  Search,
  ChevronDown,
  ChevronRight,
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
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onGoLanding,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const menuGroups: MenuGroup[] = [
    {
      title: '📌 VISÃO GERAL & DASHBOARDS',
      items: [
        { id: 'welcome', label: 'Landing Page & Planos', icon: Home, badge: 'SAAS' },
        { id: 'dashboard', label: 'Painel Principal (SOC)', icon: LayoutDashboard },
        { id: 'admin-panel', label: 'Painel de Administração', icon: Settings, badge: 'ADMIN' },
        { id: 'mastery-benchmark', label: 'Mastery & Certificação', icon: Award, badge: '100%' },
      ],
    },
    {
      title: '🤖 AUTONOMIA & SUPER IA',
      items: [
        { id: 'sentinel-ai', label: 'Sentinel AI Co-Pilot', icon: Bot, badge: 'GROQ' },
        { id: 'super-ai-suite', label: 'Super AI Suite & Kill Switch', icon: Sparkles, badge: 'GOLDEN' },
        { id: 'red-teaming', label: 'Red Teaming Autônomo', icon: Flame, badge: 'SUPER AI' },
        { id: 'ebpf-hotpatch', label: 'Campo de Força eBPF', icon: Cpu, badge: 'SUPER AI' },
        { id: 'honeytokens', label: 'Armadilhas Honeytokens', icon: Lock, badge: 'SUPER AI' },
        { id: 'quantum-rollback', label: 'Reversão Quântica (Rollback)', icon: RotateCcw, badge: 'SUPER AI' },
        { id: 'voice-command', label: 'Comando por Voz & WhatsApp', icon: Mic, badge: 'SUPER AI' },
        { id: 'global-swarm', label: 'Imunidade Coletiva Swarm', icon: Globe, badge: 'SUPER AI' },
        { id: 'finops-sentinel', label: 'Escudo Financeiro FinOps', icon: CreditCard, badge: 'SUPER AI' },
        { id: 'ai-investigations', label: 'AI Incident Analyst', icon: Sparkles },
        { id: 'autopilot', label: 'Autopiloto de Contenção', icon: Zap, badge: 'AUTO' },
        { id: 'self-healing', label: 'Auto-Cura (Self-Healing)', icon: Sparkles, badge: 'AUTO-PR' },
      ],
    },
    {
      title: '🛡️ EPP, EDR & INVENTÁRIO',
      items: [
        { id: 'assets', label: 'Inventário de Ativos', icon: Server },
        { id: 'monitoring', label: 'Monitoramento Contínuo', icon: Activity },
        { id: 'server-security', label: 'Segurança de Servidores', icon: Server },
        { id: 'api-security', label: 'Segurança de APIs REST', icon: Globe },
        { id: 'container-security', label: 'Segurança de Contêineres & K8s', icon: Layers },
        { id: 'mobile-security', label: 'Segurança Mobile (APK)', icon: Smartphone },
        { id: 'edge-security', label: 'Borda & WAF / DDoS', icon: Zap },
      ],
    },
    {
      title: '☁️ CLOUD SECURITY (CSPM)',
      items: [
        { id: 'cloud-connectors', label: 'Conectores de Nuvem (AWS/Azure/GCP)', icon: Cloud },
        { id: 'cloud-posture', label: 'Postura de Nuvem (CSPM)', icon: ShieldCheck },
      ],
    },
    {
      title: '🔍 SIEM, XDR & GRAFO DE RISCO',
      items: [
        { id: 'event-bus', label: 'Barramento de Eventos', icon: Cpu },
        { id: 'detection-engine', label: 'Motor de Detecção', icon: ShieldAlert },
        { id: 'security-graph', label: 'Grafo de Conhecimento', icon: Share2 },
        { id: 'risk-engine', label: 'Motor de Risco Contextual', icon: AlertTriangle },
        { id: 'incidents', label: 'Central de Incidentes', icon: ShieldAlert },
        { id: 'soar', label: 'Orquestração SOAR', icon: Terminal },
        { id: 'threat-intel', label: 'Inteligência de Ameaças', icon: Globe },
        { id: 'threat-exchange', label: 'Troca Global de Ameaças', icon: Share2 },
      ],
    },
    {
      title: '📜 CONFORMIDADE & AUDITORIA',
      items: [
        { id: 'compliance', label: 'Auditor de Conformidade (ISO/SOC2)', icon: FileCheck },
        { id: 'executive-reporting', label: 'Relatórios Executivos', icon: BookOpen },
        { id: 'brand-protection', label: 'Proteção de Marca & Darkweb', icon: Globe },
        { id: 'identity', label: 'Identidade Zero Trust & JIT', icon: Key },
        { id: 'microsegmentation', label: 'Microsegmentação de Rede', icon: Layers },
      ],
    },
    {
      title: '⚙️ OPERAÇÕES & MSP / MSSP',
      items: [
        { id: 'msp', label: 'Central MSSP Multi-Tenant', icon: Building },
        { id: 'finops', label: 'Otimização FinOps', icon: CreditCard },
        { id: 'siem', label: 'Integrações SIEM / External', icon: Terminal },
        { id: 'subscriptions', label: 'Assinaturas & Cotas', icon: CreditCard },
        { id: 'api', label: 'API Keys & Webhooks', icon: Key },
      ],
    },
  ];

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return menuGroups;
    const q = searchQuery.toLowerCase();
    return menuGroups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (item) => item.label.toLowerCase().includes(q) || (item.badge && item.badge.toLowerCase().includes(q))
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [menuGroups, searchQuery]);

  const toggleGroupCollapse = (title: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogoClick = () => {
    if (onGoLanding) {
      onGoLanding();
    } else {
      setActiveTab('welcome');
    }
    if (onCloseMobile) onCloseMobile();
  };

  const handleItemClick = (itemId: string) => {
    if (itemId === 'welcome' && onGoLanding) {
      onGoLanding();
    } else {
      setActiveTab(itemId);
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(6, 8, 19, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 99,
          }}
          className="mobile-only"
        />
      )}

      <aside
        style={{
          width: '280px',
          height: '100vh',
          background: 'rgba(11, 15, 25, 0.98)',
          backdropFilter: 'blur(16px)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 100,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className={`app-sidebar ${isOpenMobile ? 'mobile-open' : ''}`}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            onClick={handleLogoClick}
            title="Voltar para a Página Inicial (Landing Page)"
            style={{
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
                  fontSize: '1.2rem',
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
                  fontSize: '0.62rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '1px',
                }}
              >
                SECURITY CLOUD
              </span>
            </div>
          </div>

          {/* Close Mobile Drawer Button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
              className="mobile-only"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* UX Quick Search Filter Input */}
        <div style={{ padding: '12px 14px 4px 14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-color)',
            }}
          >
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Buscar no menu (ex: WAF, eBPF, ISO)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.78rem',
                outline: 'none',
                width: '100%',
              }}
            />
            {searchQuery && (
              <X size={12} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
            )}
          </div>
        </div>

        {/* Navigation List (Scrollable & Collapsible) */}
        <nav
          style={{
            flex: 1,
            padding: '12px 12px 20px 12px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {filteredGroups.map((group, groupIdx) => {
            const isCollapsed = Boolean(collapsedGroups[group.title]) && !searchQuery;
            return (
              <div key={groupIdx}>
                {/* Group Title Accordion Header */}
                <div
                  onClick={() => toggleGroupCollapse(group.title)}
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.8px',
                    padding: '6px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    userSelect: 'none',
                  }}
                >
                  <span>{group.title}</span>
                  {!searchQuery && (
                    <span>{isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}</span>
                  )}
                </div>

                {/* Items List */}
                {!isCollapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px' }}>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: isActive ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                            color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.18s ease',
                            fontWeight: isActive ? 700 : 500,
                            fontSize: '0.83rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Icon size={17} color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                            <span>{item.label}</span>
                          </div>

                          {item.badge && (
                            <span
                              className={`badge ${
                                item.badge === 'ADMIN'
                                  ? 'badge-purple'
                                  : item.badge === 'GROQ' || item.badge === 'SAAS'
                                  ? 'badge-cyan'
                                  : item.badge === 'GOLDEN'
                                  ? 'badge-amber'
                                  : 'badge-emerald'
                              }`}
                              style={{ fontSize: '0.62rem', padding: '2px 6px' }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* System Status Card Footer */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid var(--border-color)',
            background: 'rgba(6, 8, 19, 0.95)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}
          >
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Status do Autopiloto</span>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
              ONLINE
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            FULL_AUTO (100% Autônomo)
          </div>
        </div>
      </aside>
    </>
  );
};
