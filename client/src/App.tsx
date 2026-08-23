import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { FloatingChatWidget } from './components/layout/FloatingChatWidget';
import { WelcomeLandingPage } from './pages/WelcomeLandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssetsPage } from './pages/AssetsPage';
import { MspControlCenterPage } from './pages/MspControlCenterPage';
import { ApiWebhooksPage } from './pages/ApiWebhooksPage';
import { ContinuousMonitoringPage } from './pages/ContinuousMonitoringPage';
import { WebsiteSecurityPage } from './pages/WebsiteSecurityPage';
import { ServerSecurityPage } from './pages/ServerSecurityPage';
import { ApiSecurityPage } from './pages/ApiSecurityPage';
import { CloudConnectorsPage } from './pages/CloudConnectorsPage';
import { CloudPosturePage } from './pages/CloudPosturePage';
import { ContainerSecurityPage } from './pages/ContainerSecurityPage';
import { EventBusPage } from './pages/EventBusPage';
import { DetectionEnginePage } from './pages/DetectionEnginePage';
import { SecurityGraphPage } from './pages/SecurityGraphPage';
import { RiskEnginePage } from './pages/RiskEnginePage';
import { IncidentCenterPage } from './pages/IncidentCenterPage';
import { SentinelAiPage } from './pages/SentinelAiPage';
import { AutopilotPage } from './pages/AutopilotPage';
import { SoarEnginePage } from './pages/SoarEnginePage';
import { RemediationEnginePage } from './pages/RemediationEnginePage';
import { RecoveryRollbackPage } from './pages/RecoveryRollbackPage';
import { ThreatIntelPage } from './pages/ThreatIntelPage';
import { ComplianceAuditorPage } from './pages/ComplianceAuditorPage';
import { SiemIntegrationPage } from './pages/SiemIntegrationPage';
import { DeceptionEnginePage } from './pages/DeceptionEnginePage';
import { MicrosegmentationPage } from './pages/MicrosegmentationPage';
import { ZeroTrustIdentityPage } from './pages/ZeroTrustIdentityPage';
import { FinOpsOptimizationPage } from './pages/FinOpsOptimizationPage';
import { BrandProtectionPage } from './pages/BrandProtectionPage';
import { ExecutiveReportingPage } from './pages/ExecutiveReportingPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { MobileSecurityPage } from './pages/MobileSecurityPage';
import { EdgeSecurityPage } from './pages/EdgeSecurityPage';
import { SelfHealingPage } from './pages/SelfHealingPage';
import { ThreatExchangePage } from './pages/ThreatExchangePage';
import { AiInvestigationPage } from './pages/AiInvestigationPage';
import { MasteryBenchmarkPage } from './pages/MasteryBenchmarkPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { VulnerabilitiesPage } from './pages/VulnerabilitiesPage';
import { RedTeamingPage } from './pages/RedTeamingPage';
import { EbpfHotPatchPage } from './pages/EbpfHotPatchPage';
import { HoneytokenDeceptionPage } from './pages/HoneytokenDeceptionPage';
import { LoginPage } from './pages/LoginPage';

const MainApp: React.FC = () => {
  const { user, login, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<'LANDING' | 'LOGIN' | 'APP'>('LANDING');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleGuestAccess = () => {
    const guestUser = {
      id: 'guest-demo-1',
      name: 'Visitante Convidado (Demo)',
      email: 'guest@sentinelx.io',
      role: 'SUPER_ADMIN',
      organizationId: 'org-1',
      organizationName: 'SENTINELX Security Corp',
    };
    login('stx_guest_demo_token_98f73b', guestUser);
    setCurrentView('APP');
  };

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
        🛡️ INITIALIZING SENTINELX CONTROL PLANE...
      </div>
    );
  }

  // 1. PUBLIC LANDING PAGE (DEFAULT SEPARATE FRONT DOOR)
  if (currentView === 'LANDING') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <WelcomeLandingPage
          onEnterApp={() => {
            if (user) {
              setCurrentView('APP');
            } else {
              setCurrentView('LOGIN');
            }
          }}
          onEnterGuest={handleGuestAccess}
        />
        {/* Floating Chat Assistant available even on Public Landing Page */}
        <FloatingChatWidget />
      </div>
    );
  }

  // 2. PUBLIC LOGIN / REGISTRATION GATE
  if (currentView === 'LOGIN' && !user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
          <button className="btn-secondary" onClick={() => setCurrentView('LANDING')}>
            ← Voltar para a Landing Page
          </button>
        </div>
        <LoginPage />
      </div>
    );
  }

  // 3. AUTHENTICATED CONTROL PLANE (PRODUCTION PLATFORM)
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGoLanding={() => setCurrentView('LANDING')}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header
          onGoLanding={() => setCurrentView('LANDING')}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
        <main className="app-main" style={{ marginLeft: '280px', flex: 1, minHeight: 'calc(100vh - 70px)' }}>
          {activeTab === 'welcome' && (
            <div style={{ padding: '20px' }}>
              <button
                className="btn-primary"
                onClick={() => setCurrentView('LANDING')}
                style={{
                  marginBottom: '20px',
                  padding: '14px 28px',
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  background: 'var(--gradient-cyan)',
                  color: '#060813',
                  boxShadow: '0 0 25px rgba(0, 242, 254, 0.4)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                🌐 Ir para a Landing Page Pública Externa
              </button>
              <DashboardPage />
            </div>
          )}
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'admin-panel' && <AdminPanelPage />}
          {activeTab === 'assets' && <AssetsPage />}
          {activeTab === 'monitoring' && <ContinuousMonitoringPage />}
          {activeTab === 'server-security' && <ServerSecurityPage />}
          {activeTab === 'api-security' && <ApiSecurityPage />}
          {activeTab === 'container-security' && <ContainerSecurityPage />}
          {activeTab === 'cloud-connectors' && <CloudConnectorsPage />}
          {activeTab === 'cloud-posture' && <CloudPosturePage />}
          {activeTab === 'event-bus' && <EventBusPage />}
          {activeTab === 'detection-engine' && <DetectionEnginePage />}
          {activeTab === 'security-graph' && <SecurityGraphPage />}
          {activeTab === 'risk-engine' && <RiskEnginePage />}
          {activeTab === 'incidents' && <IncidentCenterPage />}
          {activeTab === 'sentinel-ai' && <SentinelAiPage />}
          {activeTab === 'red-teaming' && <RedTeamingPage />}
          {activeTab === 'ebpf-hotpatch' && <EbpfHotPatchPage />}
          {activeTab === 'honeytokens' && <HoneytokenDeceptionPage />}
          {activeTab === 'ai-investigations' && <AiInvestigationPage />}
          {activeTab === 'autopilot' && <AutopilotPage />}
          {activeTab === 'soar' && <SoarEnginePage />}
          {activeTab === 'remediation' && <RemediationEnginePage />}
          {activeTab === 'self-healing' && <SelfHealingPage />}
          {activeTab === 'recovery' && <RecoveryRollbackPage />}
          {activeTab === 'threat-intel' && <ThreatIntelPage />}
          {activeTab === 'threat-exchange' && <ThreatExchangePage />}
          {activeTab === 'compliance' && <ComplianceAuditorPage />}
          {activeTab === 'siem' && <SiemIntegrationPage />}
          {activeTab === 'deception' && <DeceptionEnginePage />}
          {activeTab === 'microsegmentation' && <MicrosegmentationPage />}
          {activeTab === 'identity' && <ZeroTrustIdentityPage />}
          {activeTab === 'finops' && <FinOpsOptimizationPage />}
          {activeTab === 'brand-protection' && <BrandProtectionPage />}
          {activeTab === 'executive-reporting' && <ExecutiveReportingPage />}
          {activeTab === 'subscriptions' && <SubscriptionsPage />}
          {activeTab === 'mobile-security' && <MobileSecurityPage />}
          {activeTab === 'edge-security' && <EdgeSecurityPage />}
          {activeTab === 'mastery-benchmark' && <MasteryBenchmarkPage />}
          {activeTab === 'vulnerabilities' && <VulnerabilitiesPage />}
          {activeTab === 'msp' && <MspControlCenterPage />}
          {activeTab === 'api' && <ApiWebhooksPage />}
        </main>
      </div>

      {/* Floating Chat Widget */}
      <FloatingChatWidget />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
