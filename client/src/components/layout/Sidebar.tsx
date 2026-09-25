import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  Sparkles,
  Shield,
  Cloud,
  Activity,
  FileCheck,
  Settings,
  Home,
  X,
  ChevronRight,
} from 'lucide-react';

interface MenuItem {
  id: string;
  labelKey: string;
  icon: any;
  badge?: string;
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
  const { t } = useLanguage();

  const mainThemes: MenuItem[] = [
    { id: 'dashboard', labelKey: 'sidebar.dashboard', icon: LayoutDashboard, badge: 'SOC 24/7' },
    { id: 'hub-super-ai', labelKey: 'sidebar.super_ai', icon: Sparkles, badge: 'SUPER AI' },
    { id: 'hub-epp-edr', labelKey: 'sidebar.epp_edr', icon: Shield, badge: 'PROTECTION' },
    { id: 'hub-cloud-security', labelKey: 'sidebar.cloud_security', icon: Cloud, badge: 'CSPM' },
    { id: 'hub-siem-xdr', labelKey: 'sidebar.siem_xdr', icon: Activity, badge: 'XDR' },
    { id: 'hub-compliance', labelKey: 'sidebar.compliance', icon: FileCheck, badge: 'ISO/SOC2' },
    { id: 'hub-operations', labelKey: 'sidebar.operations', icon: Settings, badge: 'MSSP' },
    { id: 'welcome', labelKey: 'sidebar.landing', icon: Home, badge: 'SAAS' },
  ];

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
            padding: '24px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            onClick={handleLogoClick}
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
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--gradient-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)',
              }}
            >
              <Shield size={22} color="#060813" />
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

        {/* Streamlined Main Themes Navigation */}
        <div
          style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            color: 'var(--text-muted)',
            letterSpacing: '1px',
            padding: '20px 20px 8px 20px',
          }}
        >
          {t('sidebar.title')}
        </div>

        <nav
          style={{
            flex: 1,
            padding: '0 14px 20px 14px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {mainThemes.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === 'hub-super-ai' && ['sentinel-ai', 'super-ai-suite', 'red-teaming', 'ebpf-hotpatch', 'honeytokens', 'quantum-rollback', 'voice-command', 'global-swarm', 'finops-sentinel', 'ai-investigations', 'autopilot', 'self-healing'].includes(activeTab)) ||
              (item.id === 'hub-epp-edr' && ['assets', 'monitoring', 'server-security', 'api-security', 'container-security', 'mobile-security', 'edge-security'].includes(activeTab)) ||
              (item.id === 'hub-cloud-security' && ['cloud-connectors', 'cloud-posture'].includes(activeTab)) ||
              (item.id === 'hub-siem-xdr' && ['event-bus', 'detection-engine', 'security-graph', 'risk-engine', 'incidents', 'soar', 'threat-intel', 'threat-exchange'].includes(activeTab)) ||
              (item.id === 'hub-compliance' && ['compliance', 'executive-reporting', 'brand-protection', 'identity', 'microsegmentation'].includes(activeTab)) ||
              (item.id === 'hub-operations' && ['msp', 'finops', 'siem', 'subscriptions', 'api', 'admin-panel'].includes(activeTab));

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: isActive ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                  background: isActive ? 'rgba(0, 242, 254, 0.12)' : 'rgba(15, 23, 42, 0.4)',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={20} color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                  <span>{t(item.labelKey)}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {item.badge && (
                    <span
                      className={`badge ${
                        item.badge === 'SUPER AI'
                          ? 'badge-amber'
                          : item.badge === 'SAAS'
                          ? 'badge-cyan'
                          : 'badge-emerald'
                      }`}
                      style={{ fontSize: '0.64rem', padding: '2px 6px' }}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight size={14} color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                </div>
              </button>
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
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t('sidebar.autopilot_status')}</span>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
              {t('state.online')}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            {t('state.full_auto')}
          </div>
        </div>
      </aside>
    </>
  );
};
