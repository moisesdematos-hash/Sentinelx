import React, { useState } from 'react';
import {
  BookOpen,
  X,
  Code2,
  Terminal,
  ShieldCheck,
  Cloud,
  Bot,
  Zap,
  Lock,
  FileText,
  Search,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  Cpu,
} from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'QUICKSTART' | 'AGENTS_VS_AGENTLESS' | 'AUTOPILOT' | 'SELF_HEALING' | 'API_WEBHOOKS' | 'COMPLIANCE'>('QUICKSTART');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, snippetId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(snippetId);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(6, 8, 19, 0.92)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
      <div className="glass-panel" style={{ width: '90%', maxWidth: '1100px', height: '85vh', display: 'flex', flexDirection: 'column', border: '1px solid var(--accent-cyan)', boxShadow: '0 0 50px rgba(0, 242, 254, 0.3)', overflow: 'hidden' }}>
        {/* Header Bar */}
        <div style={{ padding: '20px 28px', background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--gradient-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={22} color="#060813" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                DOCUMENTAÇÃO TÉCNICA SENTINELX
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                MANUAL DA PLATAFORMA & ESPECIFICAÇÃO DE APIs v1.0
              </span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Modal Body Container */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Sidebar Doc Navigation */}
          <div style={{ width: '260px', background: 'rgba(11, 15, 25, 0.8)', borderRight: '1px solid var(--border-color)', padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', padding: '0 8px 8px 8px' }}>
              SUMÁRIO DE DOCUMENTAÇÃO
            </span>

            <button
              onClick={() => setActiveSection('QUICKSTART')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeSection === 'QUICKSTART' ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                color: activeSection === 'QUICKSTART' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: activeSection === 'QUICKSTART' ? 700 : 500,
                fontSize: '0.85rem',
                textAlign: 'left',
              }}
            >
              <Zap size={16} /> 🚀 Guia de Início Rápido
            </button>

            <button
              onClick={() => setActiveSection('AGENTS_VS_AGENTLESS')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeSection === 'AGENTS_VS_AGENTLESS' ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                color: activeSection === 'AGENTS_VS_AGENTLESS' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: activeSection === 'AGENTS_VS_AGENTLESS' ? 700 : 500,
                fontSize: '0.85rem',
                textAlign: 'left',
              }}
            >
              <Cpu size={16} /> 🔄 Agentes vs Agentless (Híbrido)
            </button>

            <button
              onClick={() => setActiveSection('AUTOPILOT')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeSection === 'AUTOPILOT' ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                color: activeSection === 'AUTOPILOT' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: activeSection === 'AUTOPILOT' ? 700 : 500,
                fontSize: '0.85rem',
                textAlign: 'left',
              }}
            >
              <Bot size={16} /> ⚡ Manual do Autopiloto
            </button>

            <button
              onClick={() => setActiveSection('SELF_HEALING')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeSection === 'SELF_HEALING' ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                color: activeSection === 'SELF_HEALING' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: activeSection === 'SELF_HEALING' ? 700 : 500,
                fontSize: '0.85rem',
                textAlign: 'left',
              }}
            >
              <Code2 size={16} /> 🛠️ Auto-Cura (Self-Healing)
            </button>

            <button
              onClick={() => setActiveSection('API_WEBHOOKS')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeSection === 'API_WEBHOOKS' ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                color: activeSection === 'API_WEBHOOKS' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: activeSection === 'API_WEBHOOKS' ? 700 : 500,
                fontSize: '0.85rem',
                textAlign: 'left',
              }}
            >
              <Terminal size={16} /> 🔑 API & Webhooks
            </button>

            <button
              onClick={() => setActiveSection('COMPLIANCE')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeSection === 'COMPLIANCE' ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                color: activeSection === 'COMPLIANCE' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: activeSection === 'COMPLIANCE' ? 700 : 500,
                fontSize: '0.85rem',
                textAlign: 'left',
              }}
            >
              <FileText size={16} /> 📜 ISO 27001 & LGPD
            </button>
          </div>

          {/* Doc Content Details Panel */}
          <div style={{ flex: 1, padding: '32px', overflowY: 'auto', color: '#fff', fontSize: '0.92rem', lineHeight: 1.7 }}>
            {activeSection === 'QUICKSTART' && (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '16px', color: 'var(--accent-cyan)' }}>
                  🚀 Guia de Início Rápido (Quickstart Guide)
                </h2>
                <p>
                  O **SENTINELX** oferece suporte a implantação **Híbrida**: você pode usar a opção **Agentless** (sem instalação de binários) ou instalar o **Agente Leve eBPF** quando desejar auditoria no nível de kernel.
                </p>

                <h3 style={{ marginTop: '24px', fontSize: '1.1rem', fontWeight: 800 }}>Passo 1: Conectar Conta de Nuvem (AWS / Azure / GCP)</h3>
                <p>Crie uma Role IAM de auditoria de segurança com a política gerenciada <code style={{ color: 'var(--accent-cyan)' }}>SecurityAudit</code>:</p>

                <div style={{ borderRadius: '8px', background: '#0b0f19', border: '1px solid var(--border-color)', padding: '16px', margin: '12px 0', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', position: 'relative' }}>
                  <button onClick={() => handleCopy('aws iam create-role --role-name SentinelXAuditRole --assume-role-policy-document file://trust-policy.json', 'aws_cli')} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer' }}>
                    {copiedSnippet === 'aws_cli' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <pre style={{ margin: 0, color: 'var(--accent-cyan)' }}>
{`aws iam create-role \\
  --role-name SentinelXAuditRole \\
  --assume-role-policy-document file://trust-policy.json

aws iam attach-role-policy \\
  --role-name SentinelXAuditRole \\
  --policy-arn arn:aws:iam::aws:policy/SecurityAudit`}
                  </pre>
                </div>
              </div>
            )}

            {activeSection === 'AGENTS_VS_AGENTLESS' && (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '16px', color: 'var(--accent-cyan)' }}>
                  🔄 Arquitetura Híbrida: Com Agente vs Sem Agente (Agentless)
                </h2>
                <p>
                  Você **tem total liberdade de escolha**. Pode optar por usar **Agentless (Sem Agente)**, **Agent-Based (Com Agente)** ou combinar ambos no modelo **Híbrido**.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px' }}>
                  <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '12px', border: '1px solid var(--accent-cyan)' }}>
                    <h3 style={{ color: 'var(--accent-cyan)', marginTop: 0, fontSize: '1.1rem' }}>🌐 1. Modo Sem Agente (Agentless - Padrão)</h3>
                    <ul style={{ paddingLeft: '18px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                      <li>**Como Funciona**: Integra-se diretamente pelas APIs nativas da nuvem (AWS Role ARN, Azure Service Principal, GCP).</li>
                      <li>**Vantagens**: Instalação em 3 minutos, **zero impacto na CPU/Memória do servidor**, sem binários para atualizar.</li>
                      <li>**Indicado Para**: Recursos Cloud-Native, Buckets S3, APIs REST, Funções Serverless e visibilidade rápida.</li>
                    </ul>
                  </div>

                  <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '12px', border: '1px solid var(--accent-purple)' }}>
                    <h3 style={{ color: 'var(--accent-purple)', marginTop: 0, fontSize: '1.1rem' }}>🛡️ 2. Modo Com Agente (eBPF Daemon - Opcional)</h3>
                    <ul style={{ paddingLeft: '18px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                      <li>**Como Funciona**: Um agente ultra-leve (`sentinelx-agent`) rodando via eBPF diretamente no Kernel Linux/Windows.</li>
                      <li>**Vantagens**: Monitoramento profundo de *syscalls*, integridade de arquivos em tempo real (FIM), bloqueio no SO.</li>
                      <li>**Comando de Instalação (Linha Única)**:</li>
                    </ul>
                    <div style={{ marginTop: '10px', padding: '10px', background: '#0b0f19', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>
                      curl -sSL https://get.sentinelx.io/agent.sh | sudo bash
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', borderLeft: '4px solid var(--accent-emerald)' }}>
                  <strong style={{ color: 'var(--accent-emerald)' }}>💡 Conclusão / Modelo Híbrido:</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    A maioria dos clientes utiliza **Agentless** para toda a nuvem e APIs, e ativa o **Agente eBPF** apenas nos servidores de produção mais críticos que exigem auditoria em nível de kernel.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'AUTOPILOT' && (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '16px', color: 'var(--accent-cyan)' }}>
                  ⚡ Manual de Operação do Autopiloto de Contenção
                </h2>
                <p>
                  O **Autopilot Engine** avalia a gravidade das ameaças registradas pelo motor de risco contextual e toma ações de contenção em milissegundos.
                </p>

                <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ color: 'var(--accent-emerald)', marginTop: 0 }}>Modo FULL_AUTO (Recomendado)</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Reage autonomamente bloqueando IPs no WAF, isolando Pods Kubernetes infectados e revogando chaves STS sem aguardar autorização prévia.
                    </p>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ color: 'var(--accent-amber)', marginTop: 0 }}>Modo SEMI_AUTO (Co-Piloto)</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Recomenda o plano de ação de contenção para os analistas no dashboard e exige confirmação de 1-clique antes de executar.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'SELF_HEALING' && (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '16px', color: 'var(--accent-cyan)' }}>
                  🛠️ Auto-Cura Generativa de Código (Self-Healing Engine)
                </h2>
                <p>
                  O motor de Auto-Cura analisa o repositório GitHub/GitLab, identifica o arquivo vulnerável (SQL Injection, XSS, BOLA, CORS) e sintetiza um patch seguro.
                </p>

                <h3 style={{ marginTop: '20px', fontSize: '1.1rem', fontWeight: 800 }}>Exemplo de Validação de Guardrail:</h3>
                <p>Se a nota do patch (<code style={{ color: 'var(--accent-cyan)' }}>Guardrail Score</code>) for maior que 95.0%, o Pull Request é aberto e assinado digitalmente com hash SHA-256.</p>
              </div>
            )}

            {activeSection === 'API_WEBHOOKS' && (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '16px', color: 'var(--accent-cyan)' }}>
                  🔑 Especificação de APIs REST & Webhooks
                </h2>
                <p>Autenticação via Bearer Token JWT e validação de Webhooks com assinatura HMAC SHA-256.</p>

                <div style={{ borderRadius: '8px', background: '#0b0f19', border: '1px solid var(--border-color)', padding: '16px', margin: '12px 0', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                  <pre style={{ margin: 0, color: 'var(--accent-cyan)' }}>
{`curl -X POST https://api.sentinelx.io/v1/scans/trigger \\
  -H "Authorization: Bearer stx_live_98f73b1a2c" \\
  -H "Content-Type: application/json" \\
  -d '{"assetId": "ast_web_prod_01", "scanType": "FULL_AUDIT"}'`}
                  </pre>
                </div>
              </div>
            )}

            {activeSection === 'COMPLIANCE' && (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '16px', color: 'var(--accent-cyan)' }}>
                  📜 Matriz de Mapeamento de Conformidade (ISO 27001 & LGPD)
                </h2>
                <p>O SENTINELX mapeia automaticamente evidências técnicas de infraestrutura para os seguintes controles norma de segurança:</p>

                <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
                  <li>**ISO 27001 A.12.6.1**: Gestão de Vulnerabilidades Técnicas (Scanners automatizados diários).</li>
                  <li>**ISO 27001 A.13.1.1**: Controles de Rede (Microsegmentação e regras WAF).</li>
                  <li>**LGPD Artigo 46**: Medidas de Segurança para Proteção de Dados Pessoais (Criptografia e Zero Trust IAM).</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
