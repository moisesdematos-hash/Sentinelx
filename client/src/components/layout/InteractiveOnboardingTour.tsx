import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronRight, ChevronLeft, Check, Sparkles, ShieldCheck, Zap, Plus, Bot, X } from 'lucide-react';

interface InteractiveOnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const InteractiveOnboardingTour: React.FC<InteractiveOnboardingTourProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const tourSteps = [
    {
      stepNumber: 1,
      badge: 'PASSO 1 DE 4 — BEM-VINDO',
      title: '🎯 Bem-vindo ao SENTINELX Security Cloud',
      icon: Sparkles,
      iconColor: 'var(--accent-cyan)',
      description:
        'O SentinelX é o primeiro SOC Autônomo com inteligência Multi-LLM, Hot-Patching de Kernel via eBPF e Auto-Cura Generativa de Código. Vamos mostrar como proteger os seus sistemas em 30 segundos!',
      highlightText: 'Siga este tutorial rápido para dominar a plataforma.',
      buttonLabel: 'Avançar para Passo 2',
    },
    {
      stepNumber: 2,
      badge: 'PASSO 2 DE 4 — CADASTRO DE ATIVOS',
      title: '📦 Como Cadastrar um Ativo a Proteger',
      icon: Plus,
      iconColor: 'var(--accent-emerald)',
      description:
        'No topo da página ou no menu lateral, clique no botão "+ Cadastrar Ativo". Insira o nome do seu serviço, o tipo (Website, API, Servidor, Cloud) e o endereço URL ou IP.',
      highlightText: 'Dica: Pode cadastrar serviços de Produção, Staging ou Desenvolvimento.',
      buttonLabel: 'Avançar para Passo 3',
    },
    {
      stepNumber: 3,
      badge: 'PASSO 3 DE 4 — BLINDAGEM 1-CLIQUE',
      title: '⚡ Blindagem Automática em 1-Clique',
      icon: Zap,
      iconColor: 'var(--accent-amber)',
      description:
        'Clique no botão "⚡ Blindar Todos" para aplicar instantaneamente o Snapshot SHA-256 (FIM), Hot-Patching eBPF no Ring 0 do Kernel e regras WAF com Autopiloto em FULL_AUTO.',
      highlightText: 'Status passa a 100/100 (Ótimo & Blindado).',
      buttonLabel: 'Avançar para Passo 4',
    },
    {
      stepNumber: 4,
      badge: 'PASSO 4 DE 4 — IA & COMANDOS',
      title: '🤖 Copiloto Cyber-Assistente & Superpodres',
      icon: Bot,
      iconColor: 'var(--accent-purple)',
      description:
        'Abra o Chat no canto inferior direito para tirar dúvidas em linguagem natural, pedir análises de causa-raiz ou executar comandos diretos como Pânico Quântico Air-Gap e Auto-Cura de Código.',
      highlightText: 'O SentinelX possui contingência automática entre Groq e Gemini Free!',
      buttonLabel: '🏆 Concluir Tour & Começar Agora',
    },
  ];

  const step = tourSteps[currentStep];
  const IconComponent = step.icon;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      localStorage.setItem('sentinelx_onboarding_completed', 'true');
      onClose();
      if (onNavigateTab) onNavigateTab('assets');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div
        className="glass-panel"
        style={{
          width: '580px',
          maxWidth: '100%',
          padding: '32px',
          borderRadius: '16px',
          border: '1px solid var(--accent-cyan)',
          boxShadow: '0 0 40px rgba(0, 242, 254, 0.3)',
          color: '#fff',
          position: 'relative',
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        {/* Step Progress Bar Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
            {step.badge}
          </span>

          {/* Dots Indicator */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {tourSteps.map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: idx === currentStep ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: idx === currentStep ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(11, 15, 25, 0.9)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconComponent size={28} color={step.iconColor} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>{step.title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.description}</p>
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0, 242, 254, 0.08)', borderLeft: '3px solid var(--accent-cyan)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
              💡 {step.highlightText}
            </div>
          </div>
        </div>

        {/* Tour Navigation Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <button
            className="btn-secondary"
            onClick={handlePrev}
            disabled={currentStep === 0}
            style={{ opacity: currentStep === 0 ? 0.4 : 1, fontSize: '0.82rem', padding: '8px 16px', gap: '4px' }}
          >
            <ChevronLeft size={16} /> Anterior
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={onClose} style={{ fontSize: '0.82rem', padding: '8px 14px' }}>
              Pular Tour
            </button>

            <button className="btn-primary" onClick={handleNext} style={{ background: 'var(--gradient-cyan)', fontWeight: 800, fontSize: '0.84rem', padding: '8px 18px', gap: '6px' }}>
              {step.buttonLabel} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
