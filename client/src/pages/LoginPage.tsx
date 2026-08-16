import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Shield, Lock, ArrowRight, UserCheck, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@sentinelx.io');
  const [password, setPassword] = useState('Admin@SentinelX2026');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res: any = await apiClient.post('/auth/login', { email, password });
      if (res.success) {
        login(res.data.token, res.data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const res: any = await apiClient.post('/auth/login', {
        email: 'admin@sentinelx.io',
        password: 'Admin@SentinelX2026',
      });
      if (res.success) {
        const guestUser = {
          ...res.data.user,
          name: 'Visitante Convidado (Demo)',
          email: 'guest@sentinelx.io',
          organizationName: res.data.user.organizationName || 'SENTINELX Security Corp',
        };
        login(res.data.token, guestUser);
      }
    } catch (err: any) {
      // Fallback guest login token
      const mockGuestToken = 'stx_guest_token_demo_98f73b';
      const mockGuestUser = {
        id: 'guest-1',
        name: 'Visitante Convidado (Demo)',
        email: 'guest@sentinelx.io',
        role: 'SUPER_ADMIN',
        organizationId: 'org-1',
        organizationName: 'SENTINELX Security Corp',
      };
      login(mockGuestToken, mockGuestUser);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '440px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--gradient-cyan)', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(0, 242, 254, 0.5)' }}>
            <Shield size={32} color="#060813" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, background: 'var(--gradient-cyan)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SENTINELX
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Autonomous Continuous Cyber Defense Control Plane
          </p>
        </div>

        {error && (
          <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255, 8, 68, 0.1)', border: '1px solid rgba(255, 8, 68, 0.3)', color: 'var(--accent-rose)', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {/* 1-CLICK GUEST LOGIN BUTTON (PROMINENT) */}
        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={isSubmitting}
          style={{
            padding: '14px',
            borderRadius: '10px',
            background: 'rgba(0, 242, 254, 0.15)',
            border: '2px solid var(--accent-cyan)',
            color: 'var(--accent-cyan)',
            fontSize: '0.95rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.25)',
          }}
        >
          <Sparkles size={18} /> Entrar Instantaneamente como Convidado (1-Clique)
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span>OU ENTRAR COM CREDENCIAIS</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Address</label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Password</label>
            <input
              type="password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ justifyContent: 'center', marginTop: '8px' }}>
            {isSubmitting ? 'Authenticating...' : 'Access Security Control Plane'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.8)', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '4px' }}>Demo Platform Credentials:</div>
          <div>Email: <code style={{ color: 'var(--text-primary)' }}>admin@sentinelx.io</code></div>
          <div>Password: <code style={{ color: 'var(--text-primary)' }}>Admin@SentinelX2026</code></div>
        </div>
      </div>
    </div>
  );
};
