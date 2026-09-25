import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Register PWA Service Worker for Mobile & App Installation
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught SENTINELX React Error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('sentinelx_token');
      localStorage.removeItem('sentinelx_user');
    } catch (e) {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#060813',
            color: '#fff',
            padding: '32px',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'var(--gradient-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(0, 242, 254, 0.4)',
              marginBottom: '24px',
            }}
          >
            <span style={{ fontSize: '32px' }}>🛡️</span>
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '12px', background: 'var(--gradient-cyan)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SENTINELX SECURITY CONTROL PLANE
          </h2>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '520px', marginBottom: '28px', lineHeight: 1.6 }}>
            O painel de controle detectou uma inconsistência temporária na sessão local. Clique no botão abaixo para restaurar o estado limpo da plataforma instantaneamente:
          </p>

          <button
            onClick={this.handleReset}
            style={{
              background: 'var(--gradient-cyan)',
              border: 'none',
              color: '#060813',
              padding: '14px 28px',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 0 25px rgba(0, 242, 254, 0.5)',
            }}
          >
            ⚡ RESTAURAR E ABRIR PLATAFORMA (1-CLIQUE)
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

import { LanguageProvider } from './context/LanguageContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
