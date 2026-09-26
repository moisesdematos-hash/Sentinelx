import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';

declare const __APP_BUILD_ID__: string;

// Current Build ID injected by Vite build
const CURRENT_BUILD_ID = typeof __APP_BUILD_ID__ !== 'undefined' ? __APP_BUILD_ID__ : String(Date.now());

// Helper function to clear caches and force hard reload
const purgeCacheAndReload = async () => {
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }
  } catch (e) {
    console.warn('Cache purge error:', e);
  } finally {
    window.location.reload();
  }
};

// 1. VERSION CHECK & AUTOMATIC DEPLOYMENT MIGRATION
try {
  const storedBuildId = localStorage.getItem('sentinelx_build_id');
  if (storedBuildId !== CURRENT_BUILD_ID) {
    console.log(`[SENTINELX] New deployment detected: ${storedBuildId} -> ${CURRENT_BUILD_ID}. Clearing stale caches.`);
    localStorage.setItem('sentinelx_build_id', CURRENT_BUILD_ID);
    if ('caches' in window) {
      caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
    }
  }
} catch (e) {}

// 2. VITE PRELOAD & CHUNK LOAD ERROR RECOVERY
window.addEventListener('vite:preloadError', (event) => {
  console.warn('[SENTINELX] Vite asset preload failed. Auto-reloading to fetch current deployment assets.');
  event.preventDefault();
  purgeCacheAndReload();
});

// 3. GLOBAL ERROR HANDLER FOR SYNTAX ERROR (HTML FALLBACK ON DELETED CHUNKS)
window.addEventListener('error', (event) => {
  const msg = event.message || '';
  if (
    msg.includes("Unexpected token '<'") ||
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Loading chunk') ||
    msg.includes('import() failure')
  ) {
    console.warn('[SENTINELX] Detected stale bundle loading error. Purging cache and reloading.');
    purgeCacheAndReload();
  }
});

// 4. UNHANDLED REJECTION HANDLER FOR PROMISE CHUNK FAILURES
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason ? String(event.reason) : '';
  if (
    reason.includes("Unexpected token '<'") ||
    reason.includes('Failed to fetch dynamically imported module') ||
    reason.includes('Loading chunk')
  ) {
    console.warn('[SENTINELX] Detected unhandled chunk import failure. Purging cache and reloading.');
    purgeCacheAndReload();
  }
});

// 5. REGISTER PWA SERVICE WORKER WITH FORCE UPDATE PROTOCOL
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        // Check for updates on load
        reg.update();
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[SENTINELX] SW updated with new deployment. Claiming clients.');
                installingWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            };
          }
        };
      })
      .catch((err) => {
        console.warn('SENTINELX ServiceWorker registration warning:', err);
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

  private handleReset = async () => {
    await purgeCacheAndReload();
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

          <h2
            style={{
              fontSize: '1.8rem',
              fontWeight: 900,
              marginBottom: '12px',
              background: 'var(--gradient-cyan)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SENTINELX SECURITY CONTROL PLANE
          </h2>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '520px', marginBottom: '28px', lineHeight: 1.6 }}>
            Uma nova versão da plataforma foi disponibilizada ou ocorreu uma sincronização de sessão. Clique no botão abaixo para carregar a versão mais recente instantaneamente:
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
            ⚡ CARREGAR VERSÃO ATUALIZADA (1-CLIQUE)
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
