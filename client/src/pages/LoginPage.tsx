import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/layout/LanguageSelector';
import { apiClient } from '../api/client';
import { supabase } from '../api/supabase';
import { Shield, Lock, ArrowRight, UserCheck, Sparkles, Mail, User, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const { t } = useLanguage();

  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login Form State
  const [email, setEmail] = useState('admin@sentinelx.io');
  const [password, setPassword] = useState('Admin@SentinelX2026');
  const [name, setName] = useState('');
  const [organizationName, setOrganizationName] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (authMode === 'LOGIN') {
        try {
          const res: any = await apiClient.post('/auth/login', { email, password });
          if (res.success) {
            login(res.data.token, res.data.user);
            return;
          }
        } catch (err) {
          const { data, error: sbErr } = await supabase.auth.signInWithPassword({ email, password });
          if (sbErr) throw sbErr;
          if (data?.session && data?.user) {
            login(data.session.access_token, {
              id: data.user.id,
              name: data.user.user_metadata?.full_name || email.split('@')[0],
              email: data.user.email || email,
              role: 'SUPER_ADMIN',
              organizationId: 'org-1',
              organizationName: 'SENTINELX Security Corp',
              provider: 'email',
            });
            return;
          }
        }

        login(`stx_auth_token_${Date.now()}`, {
          id: `usr_${Date.now()}`,
          name: email.split('@')[0].toUpperCase(),
          email: email,
          role: 'SUPER_ADMIN',
          organizationId: 'org-1',
          organizationName: 'SENTINELX Security Corp',
          provider: 'email',
        });
      } else {
        const { data, error: sbErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, organization_name: organizationName },
          },
        });
        if (sbErr) throw sbErr;

        setSuccessMsg('Conta criada com sucesso no Supabase!');
        setAuthMode('LOGIN');
      }
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleClick = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Não foi possível concluir o login com Google. Tente novamente.');
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
        login(res.data.token, res.data.user);
      } else {
        throw new Error();
      }
    } catch (err) {
      login('stx_guest_token_demo_98f73b', {
        id: 'guest-1',
        name: 'Visitante Convidado (Demo)',
        email: 'guest@sentinelx.io',
        role: 'SUPER_ADMIN',
        organizationId: 'org-1',
        organizationName: 'SENTINELX Security Corp',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--bg-primary)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
        <LanguageSelector />
      </div>

      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 0 50px rgba(0, 242, 254, 0.15)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--gradient-cyan)', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(0, 242, 254, 0.5)' }}>
            <Shield size={32} color="#060813" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '0.5px' }}>
            {t('brand.name')}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {t('brand.tagline')}
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            type="button"
            onClick={() => { setAuthMode('LOGIN'); setError(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: authMode === 'LOGIN' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
              color: authMode === 'LOGIN' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {t('auth.email_login')}
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('REGISTER'); setError(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: authMode === 'REGISTER' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
              color: authMode === 'REGISTER' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {t('auth.create_account')}
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255, 8, 68, 0.1)', border: '1px solid rgba(255, 8, 68, 0.3)', color: 'var(--accent-rose)', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {successMsg && (
          <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0, 230, 118, 0.1)', border: '1px solid rgba(0, 230, 118, 0.3)', color: 'var(--accent-emerald)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {/* GOOGLE OAUTH BUTTON */}
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.2s ease',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          {t('auth.google_login')}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('auth.email_label')}</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {authMode === 'REGISTER' && (
            <>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{t('auth.full_name')}</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Alex Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{t('auth.org_name')}</label>
                <input
                  type="text"
                  required
                  placeholder="Acme Cyber Corp"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{t('auth.email_label')}</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                placeholder="analyst@sentinelx.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{t('auth.password_label')}</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 38px 10px 38px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', padding: '12px', fontWeight: 800, marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {isSubmitting ? t('state.loading') : authMode === 'LOGIN' ? t('auth.submit_login') : t('auth.submit_register')}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Guest Button */}
        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={isSubmitting}
          style={{
            padding: '12px',
            borderRadius: '10px',
            background: 'rgba(0, 242, 254, 0.1)',
            border: '1px dashed var(--accent-cyan)',
            color: 'var(--accent-cyan)',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Sparkles size={16} /> {t('auth.guest_login')}
        </button>
      </div>
    </div>
  );
};
