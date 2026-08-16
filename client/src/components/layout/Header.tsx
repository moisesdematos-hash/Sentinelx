import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, LogOut, Bell, ShieldCheck, Globe, Home } from 'lucide-react';

interface HeaderProps {
  onGoLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGoLanding }) => {
  const { user, logout } = useAuth();

  return (
    <header
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="badge badge-cyan">
          <Building2 size={12} />
          <span>{user?.organizationName || 'SENTINELX Security Corp'}</span>
        </div>
        <div className="badge badge-emerald">
          <ShieldCheck size={12} />
          <span>SCORES: 96/100 (OPTIMAL)</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {onGoLanding && (
          <button
            onClick={onGoLanding}
            title="Voltar para a Landing Page Pública Externa"
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px', gap: '6px' }}
          >
            <Globe size={14} /> Página Inicial
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} className="badge badge-purple">
          <Bell size={12} />
          <span>3 ALERTS</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '16px', borderLeft: '1px solid var(--border-color)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {user?.name || 'Chief Analyst'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {user?.role || 'ORG_ADMIN'}
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
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
