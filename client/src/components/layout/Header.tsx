import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { NotificationWebhooksModal } from './NotificationWebhooksModal';
import { InteractiveOnboardingTour } from './InteractiveOnboardingTour';
import { Building2, LogOut, Bell, ShieldCheck, Globe, ArrowLeft, Menu, Zap, Plus, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onGoLanding?: () => void;
  onToggleMobileSidebar?: () => void;
  onBack?: () => void;
  onAutoShield?: () => void;
  onOpenRegisterAsset?: () => void;
  activeTab?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onGoLanding,
  onToggleMobileSidebar,
  onBack,
  onAutoShield,
  onOpenRegisterAsset,
  activeTab,
}) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = React.useState(false);
  const [showTourModal, setShowTourModal] = React.useState(false);

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
        marginLeft: '280px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(6, 8, 19, 0.95)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Language Selector (PT | EN | ES | FR) */}
        <LanguageSelector />

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
    </header>
  );
};
