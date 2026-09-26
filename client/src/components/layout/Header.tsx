import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { NotificationWebhooksModal } from './NotificationWebhooksModal';
import { InteractiveOnboardingTour } from './InteractiveOnboardingTour';
import { WafStressTestModal } from './WafStressTestModal';
import { Building2, LogOut, Bell, ShieldCheck, Globe, ArrowLeft, Menu, Zap, Plus, HelpCircle, Sun, Moon, Flame } from 'lucide-react';

interface HeaderProps {
  onGoLanding?: () => void;
  onToggleMobileSidebar?: () => void;
  onBack?: () => void;
  onAutoShield?: () => void;
  onOpenRegisterAsset?: () => void;
  onOpenAdminPanel?: () => void;
  onOpenLogin?: () => void;
  activeTab?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onGoLanding,
  onToggleMobileSidebar,
  onBack,
  onAutoShield,
  onOpenRegisterAsset,
  onOpenAdminPanel,
  onOpenLogin,
  activeTab,
}) => {
  const { user, logout, loginWithGoogle } = useAuth();
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = React.useState(false);
  const [showTourModal, setShowTourModal] = React.useState(false);
  const [showWafModal, setShowWafModal] = React.useState(false);

  const [theme, setTheme] = React.useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('sentinelx_theme') as 'dark' | 'light') || 'dark';
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sentinelx_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        '📱 SENTINELX PWA APP:\n\n' +
        'O SentinelX está 100% pronto como PWA!\n\n' +
        '• No Chrome / Edge (Desktop ou Android):\n  Clique no ícone de "Instalar aplicativo" na barra de navegação ou no menu (3 pontos ➔ "Instalar SENTINELX").\n\n' +
        '• No iOS (Safari):\n  Clique no botão Partilhar ➔ "Adicionar ao Ecrã Principal".'
      );
    }
  };

  const isHubPage = activeTab?.startsWith('hub-');
  const isDashboard = activeTab === 'dashboard' || activeTab === 'welcome';
  const showBackButton = onBack && !isDashboard;

  return (
    <header
      className="app-header"
      style={{
        height: '70px',
        marginLeft: '240px',
        padding: '0 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(6, 8, 19, 0.95)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Mobile Hamburger Menu Toggle Button */}
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            style={{
              background: 'rgba(0, 242, 254, 0.12)',
              border: '1px solid var(--border-color)',
              color: 'var(--accent-cyan)',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="mobile-only"
            title="Abrir Menu Lateral"
          >
            <Menu size={22} />
          </button>
        )}

        {/* Universal Back Button */}
        {showBackButton && (
          <button
            onClick={onBack}
            className="btn-secondary"
            style={{
              fontSize: '0.85rem',
              padding: '8px 14px',
              gap: '6px',
              background: 'rgba(0, 242, 254, 0.12)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              color: 'var(--accent-cyan)',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} />
            <span>{isHubPage ? t('header.back_to_dashboard') : t('header.back_to_hub')}</span>
          </button>
        )}

        <div
          className="badge badge-cyan"
          onClick={onGoLanding}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <Building2 size={12} />
          <span>{user?.organizationName || 'SENTINELX Security Corp'}</span>
        </div>

        <div
          className="badge badge-emerald desktop-only"
          onClick={onGoLanding}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <ShieldCheck size={12} />
          <span>{t('header.scores_optimal')}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Language Selector (PT | EN | ES | FR) */}
        <LanguageSelector />

        {/* WAF & Rate Limit Stress Test (Red Teaming) Button */}
        <button
          onClick={() => setShowWafModal(true)}
          title="Simulador de Stress WAF & Rate Limit (Red Teaming DDoS Test)"
          style={{
            background: 'rgba(255, 8, 68, 0.12)',
            border: '1px solid rgba(255, 8, 68, 0.4)',
            color: 'var(--accent-rose)',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Flame size={16} />
        </button>

        {/* Light / Dark Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Mudar para Tema Claro (Light Corporate)' : 'Mudar para Tema Escuro (Cyber Dark)'}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#00f2fe" />}
        </button>

        {/* Webhooks & Notifications Bell Button */}
        <button
          onClick={() => setShowNotificationsModal(true)}
          title="Notificações e Webhooks (Slack, Teams, WhatsApp, Email)"
          style={{
            background: 'rgba(0, 242, 254, 0.1)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            color: 'var(--accent-cyan)',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bell size={16} />
        </button>

        {/* Interactive Tour (30s) Button */}
        <button
          onClick={() => setShowTourModal(true)}
          title="Tour Interativo Guiado (30 Segundos)"
          className="btn-secondary"
          style={{
            fontSize: '0.81rem',
            padding: '6px 12px',
            gap: '6px',
            borderColor: 'rgba(0, 242, 254, 0.4)',
            color: 'var(--accent-cyan)',
            fontWeight: 700,
          }}
        >
          <HelpCircle size={14} /> <span className="desktop-only">Tour 30s</span>
        </button>

        {/* Direct Admin Panel Button (Prominent - SUPER_ADMIN Only) */}
        {onOpenAdminPanel && user?.role === 'SUPER_ADMIN' && (
          <button
            onClick={onOpenAdminPanel}
            title="Abrir Painel de Administração Global (Exclusivo Super Admin)"
            className="btn-primary"
            style={{
              fontSize: '0.81rem',
              padding: '6px 12px',
              gap: '6px',
              background: 'linear-gradient(135deg, #7c4dff 0%, #b444ff 100%)',
              color: '#ffffff',
              fontWeight: 800,
            }}
          >
            <Zap size={14} /> <span className="desktop-only">Painel Admin</span>
          </button>
        )}

        {/* Direct Google OAuth Login Button */}
        <button
          onClick={loginWithGoogle}
          title="Entrar com Conta do Google (Google OAuth SSO)"
          className="btn-secondary"
          style={{
            fontSize: '0.81rem',
            padding: '6px 12px',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderColor: 'rgba(255, 255, 255, 0.25)',
            color: '#ffffff',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span className="desktop-only">Google Login</span>
        </button>

        {/* Direct Login / Gateway Button */}
        {onOpenLogin && (
          <button
            onClick={onOpenLogin}
            title="Abrir Portal de Autenticação (Email + Google OAuth)"
            className="btn-secondary"
            style={{
              fontSize: '0.81rem',
              padding: '6px 12px',
              gap: '6px',
              borderColor: 'var(--accent-cyan)',
              color: 'var(--accent-cyan)',
              fontWeight: 800,
            }}
          >
            <Plus size={14} /> <span className="desktop-only">Acessar / Login</span>
          </button>
        )}

        <button
          onClick={onGoLanding}
          className="btn-secondary"
          style={{
            fontSize: '0.82rem',
            padding: '8px 14px',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <Globe size={14} /> <span className="desktop-only">{t('header.go_landing')}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px', borderLeft: '1px solid var(--border-color)' }}>
          <div style={{ textAlign: 'right' }} className="desktop-only">
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {user?.name || 'Chief Analyst'}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              {user?.role || 'SUPER_ADMIN'}
            </div>
          </div>
          <button
            onClick={logout}
            title={t('header.logout')}
            style={{
              background: 'rgba(255, 8, 68, 0.1)',
              border: '1px solid rgba(255, 8, 68, 0.3)',
              color: 'var(--accent-rose)',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
      <NotificationWebhooksModal isOpen={showNotificationsModal} onClose={() => setShowNotificationsModal(false)} />
      <InteractiveOnboardingTour isOpen={showTourModal} onClose={() => setShowTourModal(false)} />
      <WafStressTestModal isOpen={showWafModal} onClose={() => setShowWafModal(false)} />
    </header>
  );
};
