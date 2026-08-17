import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, LogOut, Bell, ShieldCheck, Globe, Home, Menu } from 'lucide-react';

interface HeaderProps {
  onGoLanding?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGoLanding, onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header
      className="app-header"
      style={{
        height: '70px',
        marginLeft: '280px',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(6, 8, 19, 0.7)',
        backdropFilter: 'blur(12px)',
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
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="mobile-only"
            title="Abrir Menu Lateral"
          >
            <Menu size={22} />
          </button>
        )}

        <div
          className="badge badge-cyan"
          onClick={onGoLanding}
          title="Clique para ir para a Página Inicial"
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <Building2 size={12} />
          <span>{user?.organizationName || 'SENTINELX Security Corp'}</span>
        </div>

        <div
          className="badge badge-emerald desktop-only"
          onClick={onGoLanding}
          title="Clique para ir para a Página Inicial"
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <ShieldCheck size={12} />
          <span>SCORES: 96/100 (OPTIMAL)</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onGoLanding}
          title="Voltar para a Página Inicial (Landing Page)"
          className="btn-primary"
          style={{
            fontSize: '0.85rem',
            padding: '8px 16px',
            gap: '8px',
            background: 'var(--gradient-cyan)',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.3)',
            cursor: 'pointer',
          }}
        >
          <Globe size={16} /> <span className="desktop-only">Página Inicial</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} className="badge badge-purple desktop-only">
          <Bell size={12} />
          <span>3 ALERTS</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '16px', borderLeft: '1px solid var(--border-color)' }}>
          <div style={{ textAlign: 'right' }} className="desktop-only">
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {user?.name || 'Chief Analyst'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {user?.role || 'ORG_ADMIN'}
            </div>
          </div>
          <button
            onClick={logout}
            title="Sair / Fazer Logout"
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
    </header>
  );
};
