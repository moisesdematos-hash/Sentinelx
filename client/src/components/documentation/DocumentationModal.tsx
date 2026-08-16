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
  Plug,
} from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'QUICKSTART' | 'CONNECTIVITY' | 'AGENTS_VS_AGENTLESS' | 'AUTOPILOT' | 'SELF_HEALING' | 'API_WEBHOOKS' | 'COMPLIANCE'>('CONNECTIVITY');
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
              onClick={() => setActiveSection('CONNECTIVITY')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeSection === 'CONNECTIVITY' ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                color: activeSection === 'CONNECTIVITY' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: activeSection === 'CONNECTIVITY' ? 700 : 500,
                fontSize: '0.85rem',
                textAlign: 'left',
              }}
            >
              <Plug size={16} /> 🔌 Conexão de Sistemas
            </button>

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
            {activeSection === 'CONNECTIVITY' && (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '16px', color: 'var(--accent-cyan)' }}>
                  🔌 COMO FAZER A CONEXÃO DA SUA EMPRESA COM O SENTINELX
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  Conectar seus sistemas ao **SENTINELX** é simples, rápido e não exige parar seus serviços. O processo é feito diretamente pela interface da plataforma em 3 passos para cada tipo de ambiente.
                </p>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '12px' }}>
                  Abaixo estão os 4 métodos de conexão disponíveis:
                </h3>

                {/* Method 1 */}
                <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', borderLeft: '4px solid var(--accent-cyan)' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: 0, marginBottom: '8px' }}>
                    ☁️ 1. Conectar Contas de Nuvem (AWS, Azure ou GCP) — Sem Agente
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Esta é a conexão mais rápida. Ela permite ao SENTINELX auditar buckets S3, servidores EC2, regras de firewall e permissões IAM sem instalar nada nos servidores.
                  </p>

                  <strong style={{ color: '#fff', fontSize: '0.88rem' }}>📋 Passo a Passo:</strong>
                  <ol style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <li>No menu à esquerda do SENTINELX, acesse <strong>Conectores de Nuvem</strong>.</li>
                    <li>Clique no botão <strong>"Adicionar Conector de Nuvem"</strong>.</li>
                    <li>Selecione o provedor (<strong>AWS</strong>, <strong>AZURE</strong> ou <strong>GCP</strong>).</li>
                    <li>Informe o <strong>Role ARN</strong> da sua conta AWS (ex: <code style={{ color: 'var(--accent-cyan)' }}>arn:aws:iam::123456789012:role/SentinelXAuditRole</code>).</li>
                    <li>Clique em <strong>"Testar Conexão"</strong>. O SENTINELX começará a descobrir e monitorar seus ativos automaticamente em tempo real!</li>
                  </ol>
                </div>

                {/* Method 2 */}
                <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', borderLeft: '4px solid var(--accent-purple)' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-purple)', marginTop: 0, marginBottom: '8px' }}>
                    💻 2. Conectar Repositórios GitHub / GitLab — Para Auto-Cura de Código
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Permite ao SENTINELX ler o código das suas aplicações e abrir Pull Requests automáticos com as correções de vulnerabilidade.
                  </p>

                  <strong style={{ color: '#fff', fontSize: '0.88rem' }}>📋 Passo a Passo:</strong>
                  <ol style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <li>No menu à esquerda, acesse <strong>Painel de Administração -&gt; Chaves de API & Integrações</strong>.</li>
                    <li>Na seção <strong>Conectores Git</strong>, cole o seu <strong>Personal Access Token (PAT)</strong> do GitHub/GitLab com permissão de <code style={{ color: 'var(--accent-purple)' }}>repo</code>.</li>
                    <li>Selecione os repositórios que deseja proteger (ex: <code style={{ color: 'var(--accent-purple)' }}>empresa/backend-api</code>).</li>
                    <li>Pronto! O motor de Auto-Cura já está conectado para monitorar e enviar correções de código.</li>
                  </ol>
                </div>

                {/* Method 3 */}
                <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', borderLeft: '4px solid var(--accent-emerald)' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: 0, marginBottom: '8px' }}>
                    🌐 3. Conectar Websites e APIs REST / GraphQL — Para Scanners de Vulnerabilidade
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Para monitorar seus sites públicos, portais web e endpoints de API contra ataques de hackers.
                  </p>

                  <strong style={{ color: '#fff', fontSize: '0.88rem' }}>📋 Passo a Passo:</strong>
                  <ol style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <li>Acesse <strong>Inventário de Ativos (Asset Inventory)</strong> no menu lateral.</li>
                    <li>Clique em <strong>"Cadastrar Novo Ativo"</strong>.</li>
                    <li>Selecione o tipo (<strong>WEBSITE</strong> ou <strong>API_ENDPOINT</strong>).</li>
                    <li>Informe o nome e a URL (ex: <code style={{ color: 'var(--accent-emerald)' }}>https://api.suaempresa.com.br</code>).</li>
                    <li>Clique em <strong>"Iniciar Varredura Inicial"</strong>.</li>
                  </ol>
                </div>

                {/* Method 4 */}
                <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', borderLeft: '4px solid var(--accent-amber)' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: 0, marginBottom: '8px' }}>
                    🛡️ 4. Conectar Servidores Linux / Windows — Opção Com Agente ou Sem Agente
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Você escolhe como quer conectar cada servidor:
                  </p>

                  <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    <li>
                      <strong>Opção A: Sem Agente (Agentless):</strong><br />
                      Na tela de <strong>Segurança de Servidores</strong>, selecione a opção <em>Agentless</em>. O SENTINELX faz a auditoria via conexões SSH seguras.
                    </li>
                    <li style={{ marginTop: '10px' }}>
                      <strong>Opção B: Com Agente eBPF (Recomendado para servidores críticos):</strong><br />
                      Copie o comando de 1-linha exibido no painel de Segurança de Servidores e cole no terminal do seu servidor Linux:
                      <div style={{ marginTop: '6px', padding: '10px', background: '#0b0f19', borderRadius: '6px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', position: 'relative' }}>
                        <button onClick={() => handleCopy('curl -sSL https://api.sentinelx-cyber.com/v1/agents/install.sh | sudo bash', 'agent_cmd')} style={{ position: 'absolute', top: '6px', right: '8px', background: 'none', border: 'none', color: 'var(--accent-amber)', cursor: 'pointer' }}>
                          {copiedSnippet === 'agent_cmd' ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        curl -sSL https://api.sentinelx-cyber.com/v1/agents/install.sh | sudo bash
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                        O agente eBPF leve (~14MB de RAM) se conectará instantaneamente ao painel do SENTINELX!
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Timing Summary */}
                <div style={{ padding: '20px', background: 'rgba(0, 242, 254, 0.08)', borderRadius: '12px', border: '1px solid var(--accent-cyan)' }}>
                  <h4 style={{ color: 'var(--accent-cyan)', marginTop: 0, marginBottom: '8px', fontSize: '1rem' }}>
                    ⏱️ Quanto tempo leva no total?
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <li>Conectar a Nuvem (AWS): <strong>3 minutos</strong>.</li>
                    <li>Conectar o GitHub: <strong>2 minutos</strong>.</li>
                    <li>Conectar um Website/API: <strong>1 minuto</strong>.</li>
                  </ul>
                  <p style={{ marginTop: '12px', marginBottom: 0, fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>
                    Em menos de 10 minutos, toda a sua infraestrutura estará conectada e protegida pelo SENTINELX!
                  </p>
                </div>
              </div>
            )}

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
                      curl -sSL https://get.sentinelx-cyber.com/agent.sh | sudo bash
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
{`curl -X POST https://api.sentinelx-cyber.com/v1/scans/trigger \\
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
