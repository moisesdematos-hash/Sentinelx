import React, { useState } from 'react';
import {
  Shield,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Bot,
  Lock,
  Globe2,
  Award,
  CreditCard,
  Building2,
  Clock,
  Layers,
  Code2,
  ChevronRight,
  ShieldCheck,
  Check,
  Star,
  Users,
  Flame,
  X,
  Play,
  BookOpen,
  Calculator,
  HelpCircle,
  Video,
  Cpu,
  UserCheck,
} from 'lucide-react';
import { DocumentationModal } from '../components/documentation/DocumentationModal';

interface WelcomeLandingPageProps {
  onEnterApp?: () => void;
  onEnterGuest?: () => void;
}

export const WelcomeLandingPage: React.FC<WelcomeLandingPageProps> = ({ onEnterApp, onEnterGuest }) => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showDemoVideoModal, setShowDemoVideoModal] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    price: string;
    period: string;
    variantId: string;
  } | null>(null);

  const [paymentStep, setPaymentStep] = useState<'DETAILS' | 'PROCESSING' | 'SUCCESS'>('DETAILS');

  // ROI Calculator State
  const [assetCount, setAssetCount] = useState<number>(35);
  const [analystCount, setAnalystCount] = useState<number>(4);

  // Calculated Savings
  const traditionalCostPerYear = analystCount * 120000 + assetCount * 1500;
  const sentinelxCostPerYear = 11880; // Enterprise Plan annual rate
  const annualSavings = Math.max(0, traditionalCostPerYear - sentinelxCostPerYear);

  // Expanded FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const plans = [
    {
      id: 'pro',
      name: 'PRO STARTUP',
      tagline: 'Ideal para empresas em crescimento protegendo até 50 ativos.',
      price: '$199',
      priceBrl: 'R$ 990',
      period: '/ mês',
      lemonVariantId: 'variant_lemon_pro_199',
      features: [
        'Até 50 Ativos e APIs Monitorados',
        'Scanners Diários de Vulnerabilidades',
        'Autopiloto de Contenção (Modo Semi-Auto)',
        'Sentinel AI Co-Pilot & Chat Expert',
        'Relatórios de Conformidade (LGPD & ISO 27001)',
        'Suporte Prioritário 24/7',
      ],
      isPopular: false,
    },
    {
      id: 'enterprise',
      name: 'ENTERPRISE AUTONOMOUS',
      tagline: 'Defesa 100% Autônoma com Auto-Cura de Código e Provedores de IA.',
      price: '$1,999',
      priceBrl: 'R$ 9.900',
      period: '/ mês',
      lemonVariantId: 'variant_lemon_ent_1999',
      features: [
        'Até 500 Ativos e Multi-Nuvem (AWS, Azure, GCP)',
        'Auto-Cura Generativa de Código (Self-Healing & Auto-PR)',
        'Autopiloto de Contenção Total (Modo FULL_AUTO)',
        'Grafo de Conhecimento & Raio de Explosão',
        'Groq AI Llama 3.3 / Gemini / OpenAI Integrados',
        'Troca Global de Ameaças (Global Threat Exchange)',
        'Auditoria SOC 2 Type II, PCI DSS v4 e HIPAA',
        'Gerente de Conta Dedicado',
      ],
      isPopular: true,
    },
    {
      id: 'mssp',
      name: 'MSSP PARTNER / WHITE-LABEL',
      tagline: 'Para Provedores Gerenciados de Segurança com Marca Própria.',
      price: '$4,999',
      priceBrl: 'R$ 24.900',
      period: '/ mês',
      lemonVariantId: 'variant_lemon_mssp_4999',
      features: [
        'Ativos Ilimitados & Organizações Multi-Tenant',
        'Portal Co-Branded com Logo e Marca Própria',
        'Faturamento SaaS & Entitlements Marketplace',
        'API & Webhooks Dedicados',
        'Integração SIEM/SOAR Personalizada',
        'SLA Garantido de 99.99%',
      ],
      isPopular: false,
    },
  ];

  const faqs = [
    {
      question: 'Posso entrar e testar como Convidado sem cadastro?',
      answer: 'SIM! Você pode clicar no botão "Entrar como Convidado (Demo Instantânea)" no topo da página e acessar imediatamente todo o Painel de Controle, a Auto-Cura de Código e o Chat Expert com Groq AI sem precisar digitar senha ou informar e-mail.',
    },
    {
      question: 'Podemos optar por usar Agentes ou o modelo Sem Agente (Agentless)?',
      answer: 'SIM! Você tem total liberdade de escolha. O SENTINELX funciona no modelo Híbrido: 1) Agentless (Sem Agente) via APIs nativas de nuvem (AWS Role, Azure, GCP) sem nenhum impacto de performance nos servidores; 2) Agent-Based (Com Agente eBPF) instalando um Daemon ultra-leve para auditoria profunda no nível do Kernel Linux/Windows; ou 3) Combinar ambos os modelos no seu ambiente!',
    },
    {
      question: 'Como a Auto-Cura de Código abre um Pull Request no meu GitHub/GitLab?',
      answer: 'Ao detectar uma falha no código (como SQL Injection ou CORS permissivo), o motor de Auto-Cura sintetiza o patch corrigido, calcula uma nota de segurança (Guardrail Score > 95%) e utiliza a API do seu repositório para criar uma branch e abrir o PR automaticamente.',
    },
    {
      question: 'Como funciona o faturamento com o Lemon Squeezy?',
      answer: 'O faturamento é processado pela Lemon Squeezy como Merchant of Record seguro. Você pode pagar via Cartão de Crédito internacional/nacional, Pix, Apple Pay, Google Pay e Boleto Bancário com nota fiscal emitida automaticamente.',
    },
    {
      question: 'O SENTINELX é compatível com a LGPD e a ISO 27001?',
      answer: 'Sim! O motor de Compliance Auditor monitora continuamente 100% dos controles técnicos da ISO 27001, SOC 2 Type II, PCI DSS v4 e LGPD Art. 46, permitindo exportar relatórios executivos em PDF com 1-clique.',
    },
  ];

  const handleOpenLemonCheckout = (plan: typeof plans[0]) => {
    setSelectedPlan({
      name: plan.name,
      price: plan.priceBrl,
      period: plan.period,
      variantId: plan.lemonVariantId,
    });
    setPaymentStep('DETAILS');
    setShowCheckoutModal(true);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep('PROCESSING');
    setTimeout(() => {
      setPaymentStep('SUCCESS');
    }, 1800);
  };

  return (
    <div style={{ background: 'var(--bg-primary)', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* 1. TOP NAVIGATION BAR */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(6, 8, 19, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-color)',
          padding: '16px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gradient-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)' }}>
            <Shield size={24} color="#060813" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '1px', background: 'var(--gradient-cyan)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SENTINELX
            </h1>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              AUTONOMOUS CONTINUOUS CYBER DEFENSE
            </span>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#dores" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500 }}>Dores & Soluções</a>
          <a href="#roi" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500 }}>Calculadora de ROI</a>
          <a href="#planos" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500 }}>Planos & Preços</a>
          <a href="#faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500 }}>Perguntas Frequentes</a>

          <button
            onClick={() => setShowDocModal(true)}
            style={{
              background: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              color: 'var(--accent-cyan)',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <BookOpen size={14} /> Documentação Técnica
          </button>
        </nav>

        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          {/* 1-CLICK GUEST BUTTON IN HEADER */}
          <button
            onClick={onEnterGuest}
            style={{
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid var(--accent-purple)',
              color: 'var(--accent-purple)',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <UserCheck size={16} /> Entrar como Convidado
          </button>

          <button className="btn-primary" onClick={onEnterApp}>
            <Play size={16} /> Login Corporativo
          </button>
        </div>
      </header>

      {/* 2. HERO BANNER SECTION */}
      <section style={{ padding: '80px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0, 242, 254, 0.15) 0%, rgba(6, 8, 19, 0) 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
          <span className="badge badge-cyan" style={{ fontSize: '0.85rem', padding: '8px 18px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={14} /> ACESSO LIVRE DEMO — ENTRE COMO CONVIDADO EM 1-CLIQUE
          </span>

          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-1px' }}>
            Não Apenas Alerte Ameaças.<br />
            <span style={{ background: 'var(--gradient-cyan)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Elimine e Corrija Vulnerabilidades Automaticamente.
            </span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '780px' }}>
            O **SENTINELX** é o primeiro SOC Autônomo com arquitetura **Híbrida**: escolha usar **Agentless** sem instalação ou **Agentes eBPF** ultra-leves para auditoria profunda no kernel.
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <button
              onClick={onEnterGuest}
              className="btn-primary"
              style={{
                padding: '16px 32px',
                fontSize: '1.05rem',
                background: 'var(--gradient-cyan)',
                boxShadow: '0 0 25px rgba(0, 242, 254, 0.4)',
              }}
            >
              🎮 Entrar como Convidado (Demo Instantânea) <ArrowRight size={18} />
            </button>

            <button className="btn-secondary" style={{ padding: '16px 32px', fontSize: '1rem' }} onClick={() => setShowDemoVideoModal(true)}>
              <Video size={18} /> Ver Vídeo de Demonstração
            </button>
          </div>

          <div style={{ display: 'flex', gap: '32px', marginTop: '30px', color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
            <span>✓ Acesso Convidado sem Senha</span>
            <span>✓ Opção Agentless ou Agente eBPF</span>
            <span>✓ Certificado ISO 27001 & LGPD</span>
          </div>
        </div>
      </section>

      {/* 3. SECTION: DORES QUE O SENTINELX RESOLVE */}
      <section id="dores" style={{ padding: '80px 40px', background: 'rgba(11, 15, 25, 0.6)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="badge badge-rose" style={{ marginBottom: '12px' }}>AS DORES DO MERCADO DE SEGURANÇA</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Por Que as Ferramentas Tradicionais Falham?</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Veja como o SENTINELX transforma o caos da cibersegurança em proteção autônoma tranquila.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
            {/* Dor 1 */}
            <div className="glass-panel" style={{ padding: '32px', borderTop: '4px solid var(--accent-rose)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-rose)', marginBottom: '20px' }}>
                <Clock size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: 'var(--accent-rose)' }}>1. Falta de Equipe 24/7 (SOC Caríssimo)</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                Contratar analistas de segurança para monitorar telas 24 horas por dia custa dezenas de milhares de reais por mês e gera sobrecarga.
              </p>
              <div style={{ padding: '14px', background: 'rgba(0, 242, 254, 0.08)', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
                <strong style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>Solução SENTINELX:</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
                  SOC Autônomo alimentado por IA que monitora, detecta e reage sozinho 24/7/365.
                </p>
              </div>
            </div>

            {/* Dor 2 */}
            <div className="glass-panel" style={{ padding: '32px', borderTop: '4px solid var(--accent-amber)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-amber)', marginBottom: '20px' }}>
                <AlertTriangle size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: 'var(--accent-amber)' }}>2. Fadiga de Alertas & Falsos Positivos</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                Ferramentas antigas disparam milhares de e-mails diários sobre alertas irrelevantes, fazendo sua equipe ignorar avisos realmente críticos.
              </p>
              <div style={{ padding: '14px', background: 'rgba(0, 242, 254, 0.08)', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
                <strong style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>Solução SENTINELX:</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
                  Grafo de Conhecimento que correlaciona dependências e filtra apenas ameaças com real Raio de Explosão.
                </p>
              </div>
            </div>

            {/* Dor 3 */}
            <div className="glass-panel" style={{ padding: '32px', borderTop: '4px solid var(--accent-purple)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)', marginBottom: '20px' }}>
                <Code2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: 'var(--accent-purple)' }}>3. Demora de Semanas para Corrigir Código</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                Após descobrir um SQL Injection ou XSS, os desenvolvedores demoram semanas para priorizar e refatorar o código vulnerável.
              </p>
              <div style={{ padding: '14px', background: 'rgba(0, 242, 254, 0.08)', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
                <strong style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>Solução SENTINELX:</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
                  Motor de Auto-Cura (Self-Healing) que sintetiza o patch e abre um Pull Request no GitHub automaticamente.
                </p>
              </div>
            </div>

            {/* Dor 4 */}
            <div className="glass-panel" style={{ padding: '32px', borderTop: '4px solid var(--accent-cyan)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 242, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', marginBottom: '20px' }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: 'var(--accent-cyan)' }}>4. Riscos de Multa por LGPD, ISO 27001 e SOC 2</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                Preparar relatórios de auditoria exige semanas de trabalho manual coletando evidências de servidores e nuvem.
              </p>
              <div style={{ padding: '14px', background: 'rgba(0, 242, 254, 0.08)', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
                <strong style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>Solução SENTINELX:</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
                  Auditor contínuo de conformidade com exportação de relatórios PDF executivos em 1-clique.
                </p>
              </div>
            </div>

            {/* Dor 5 */}
            <div className="glass-panel" style={{ padding: '32px', borderTop: '4px solid var(--accent-emerald)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', marginBottom: '20px' }}>
                <Globe2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: 'var(--accent-emerald)' }}>5. Vulnerabilidades de Nuvem (S3 & IAM Vazados)</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                Buckets S3 públicos e chaves IAM com acesso root expostas acidentalmente causam vazamentos catastróficos.
              </p>
              <div style={{ padding: '14px', background: 'rgba(0, 242, 254, 0.08)', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
                <strong style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>Solução SENTINELX:</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
                  CSPM em tempo real que bloqueia buckets públicos e revoga credenciais vazadas instantaneamente.
                </p>
              </div>
            </div>

            {/* Dor 6 */}
            <div className="glass-panel" style={{ padding: '32px', borderTop: '4px solid var(--accent-purple)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)', marginBottom: '20px' }}>
                <Bot size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: 'var(--accent-purple)' }}>6. Investigação Lenta de Causa-Raiz</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                Descobrir por onde o invasor entrou exige cruzar logs de rede, servidores e nuvens em planilhas confusas.
              </p>
              <div style={{ padding: '14px', background: 'rgba(0, 242, 254, 0.08)', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
                <strong style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>Solução SENTINELX:</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
                  Investigador Multi-Agente com Groq AI que reconstrói a linha do tempo do ataque (*storyboard*).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE ROI CALCULATOR SECTION */}
      <section id="roi" style={{ padding: '80px 40px', background: 'rgba(6, 8, 19, 0.95)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-purple" style={{ marginBottom: '12px' }}>CALCULADORA DE ROI</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900 }}>Quanto Sua Empresa Economizará com o SENTINELX?</h2>
            <p style={{ color: 'var(--text-muted)' }}>Calcule o valor economizado ao substituir equipes tradicionais e consultorias manuais por defesa autônoma.</p>
          </div>

          <div className="glass-panel" style={{ padding: '40px', border: '1px solid var(--accent-purple)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Quantidade de Ativos & APIs Monitoradas:</span>
                  <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{assetCount} ativos</strong>
                </label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={assetCount}
                  onChange={(e) => setAssetCount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Analistas de Segurança (SOC Tradicional):</span>
                  <strong style={{ color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>{analystCount} analistas</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={analystCount}
                  onChange={(e) => setAnalystCount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
                />
              </div>
            </div>

            <div style={{ padding: '30px', background: 'rgba(15, 23, 42, 0.9)', borderRadius: '14px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>ECONOMIA ESTIMADA POR ANO</span>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                R$ {annualSavings.toLocaleString('pt-BR')}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px', display: 'block' }}>
                Redução de custos operacionais com 99.4% mais velocidade na resposta a incidentes.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING & LEMON SQUEEZY CHECKOUT SECTION */}
      <section id="planos" style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>FATURAMENTO SIMPLIFICADO VIA LEMON SQUEEZY</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Escolha o Plano Ideal para a Sua Empresa</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Ativação imediata com faturamento seguro processado por Lemon Squeezy (Cartão, Pix, Apple Pay e Boleto).</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="glass-panel"
                style={{
                  padding: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  border: plan.isPopular ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  boxShadow: plan.isPopular ? '0 0 30px rgba(0, 242, 254, 0.25)' : 'none',
                }}
              >
                {plan.isPopular && (
                  <span
                    className="badge badge-cyan"
                    style={{
                      position: 'absolute',
                      top: '-14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '0.75rem',
                      padding: '4px 16px',
                    }}
                  >
                    MAIS POPULAR & RECOMENDADO
                  </span>
                )}

                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '6px' }}>{plan.name}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '24px', minHeight: '38px' }}>{plan.tagline}</p>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '2.8rem', fontWeight: 900, color: plan.isPopular ? 'var(--accent-cyan)' : '#fff', fontFamily: 'var(--font-mono)' }}>
                      {plan.priceBrl}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{plan.period}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
                    ({plan.price} USD / mês via Lemon Squeezy)
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
                        <CheckCircle2 size={16} color="var(--accent-cyan)" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className={plan.isPopular ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => handleOpenLemonCheckout(plan)}
                  style={{ width: '100%', padding: '14px', fontSize: '0.95rem', justifyContent: 'center' }}
                >
                  <CreditCard size={18} /> Assinar com Lemon Squeezy
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION SECTION */}
      <section id="faq" style={{ padding: '80px 40px', background: 'rgba(11, 15, 25, 0.6)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>PERGUNTAS FREQUENTES</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900 }}>Tire Suas Dúvidas Sobre o SENTINELX</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-panel" style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{faq.question}</span>
                  <ChevronRight size={20} style={{ transform: openFaqIndex === idx ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--accent-cyan)' }} />
                </button>

                {openFaqIndex === idx && (
                  <div style={{ padding: '0 24px 20px 24px', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7, borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer style={{ padding: '40px', borderTop: '1px solid var(--border-color)', background: 'rgba(6, 8, 19, 0.95)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>© 2026 SENTINELX Inc. Plataforma SaaS de Defesa Cibernética Contínua. Todos os direitos reservados.</p>
        <p style={{ marginTop: '8px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          Processamento seguro de faturamento powered by Lemon Squeezy Merchant of Record.
        </p>
      </footer>

      {/* 8. DOCUMENTATION MODAL COMPONENT */}
      <DocumentationModal isOpen={showDocModal} onClose={() => setShowDocModal(false)} />

      {/* 9. DEMO VIDEO MODAL */}
      {showDemoVideoModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(6, 8, 19, 0.92)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div className="glass-panel" style={{ width: '800px', padding: '24px', border: '1px solid var(--accent-cyan)', boxShadow: '0 0 40px rgba(0, 242, 254, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Demonstração dos 38 Módulos Autônomos</h3>
              <button onClick={() => setShowDemoVideoModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ width: '100%', height: '400px', background: '#0b0f19', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: 'var(--accent-cyan)' }}>
              <Play size={48} />
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Tour Guiado de Demonstração SENTINELX</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Assista à Auto-Cura de Código abrindo Pull Requests no GitHub em tempo real.</p>
            </div>
          </div>
        </div>
      )}

      {/* 10. LEMON SQUEEZY CHECKOUT OVERLAY MODAL */}
      {showCheckoutModal && selectedPlan && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(6, 8, 19, 0.88)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div className="glass-panel" style={{ width: '540px', padding: '36px', border: '2px solid var(--accent-cyan)', boxShadow: '0 0 40px rgba(0, 242, 254, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(0, 242, 254, 0.15)', color: 'var(--accent-cyan)' }}>
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>Lemon Squeezy Checkout</h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CHECKOUT SEGURO 256-BIT SSL</span>
                </div>
              </div>

              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setShowCheckoutModal(false)}>
                <X size={20} />
              </button>
            </div>

            {paymentStep === 'DETAILS' && (
              <form onSubmit={handleProcessPayment} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 700, display: 'block' }}>PLANO SELECIONADO</span>
                    <strong style={{ fontSize: '1.1rem' }}>{selectedPlan.name}</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>{selectedPlan.price}</div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{selectedPlan.period}</span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>E-mail da Conta Corporativa</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@empresa.com"
                    defaultValue="admin@sentinelx.io"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.9)', border: '1px solid var(--border-color)', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Número do Cartão / Métodos de Pagamento</label>
                  <input
                    type="text"
                    required
                    placeholder="4000 1234 5678 9010 (ou Pix / Apple Pay)"
                    defaultValue="4111 •••• •••• 8824"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.9)', border: '1px solid var(--border-color)', color: '#fff', fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Validade</label>
                    <input type="text" defaultValue="12/29" style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.9)', border: '1px solid var(--border-color)', color: '#fff', fontFamily: 'var(--font-mono)' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>CVC</label>
                    <input type="text" defaultValue="888" style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(11, 15, 25, 0.9)', border: '1px solid var(--border-color)', color: '#fff', fontFamily: 'var(--font-mono)' }} />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '10px', justifyContent: 'center' }}>
                  Confirmar Pagamento de {selectedPlan.price}
                </button>
              </form>
            )}

            {paymentStep === 'PROCESSING' && (
              <div style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '3px solid var(--accent-cyan)', borderTopColor: 'transparent' }} className="spin" />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Processando Pagamento no Lemon Squeezy...</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Comunicando com a operadora financeira e ativando os 38 módulos autônomos.</p>
              </div>
            )}

            {paymentStep === 'SUCCESS' && (
              <div style={{ padding: '30px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={36} />
                </div>
                <h4 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>Pagamento Confirmado com Sucesso!</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Sua assinatura do plano **{selectedPlan.name}** foi ativada. O recibo foi enviado para o seu e-mail pelo Lemon Squeezy.
                </p>

                <button
                  className="btn-primary"
                  onClick={() => {
                    setShowCheckoutModal(false);
                    if (onEnterApp) onEnterApp();
                  }}
                  style={{ padding: '14px 28px', fontSize: '0.95rem', marginTop: '10px' }}
                >
                  Acessar Plataforma SENTINELX Agora
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
