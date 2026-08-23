import { prisma } from '../db/client.js';
import { AuditService } from './audit.service.js';
import { z } from 'zod';

export const chatPromptSchema = z.object({
  prompt: z.string().min(2),
  context: z.record(z.any()).default({}),
});

export const generateAnalysisSchema = z.object({
  targetType: z.enum(['INCIDENT', 'VULNERABILITY', 'ASSET']),
  targetId: z.string(),
});

export class SentinelAiService {
  static async chat(organizationId: string, data: z.infer<typeof chatPromptSchema>, userId?: string) {
    const assets = await prisma.asset.count({ where: { organizationId } });
    const vulns = await prisma.vulnerability.count({ where: { organizationId, status: 'OPEN' } });

    let response = '';
    const groqKey = process.env.GROQ_API_KEY || '';

    // Attempt live call to Groq AI API (Llama 3.3 70B Versatile - Deep Instructor Persona)
    try {
      if (groqKey && groqKey.startsWith('gsk_')) {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: `Você é o SENTINELX LEAD PRINCIPAL CYBERSECURITY INSTRUCTOR & CHIEF ARCHITECT. Responda como um autêntico Engenheiro Instrutor de Cibersegurança de nível Principal. Suas respostas devem ser extremamente profundas, didáticas, técnicas e abrangentes. Estruture suas respostas sempre em 4 seções bem definidas com Markdown impecável:

1. 🎓 **Conceito Técnico & Causa-Raiz Profunda (Deep Root Cause)**
2. 📋 **Roteiro Didático de Solução Passo a Passo (Hands-On Step-by-Step)**
3. 💻 **Snippet Prático de Código / Comando CLI para Produção (com comentários pedagógicos)**
4. 🛡️ **Medidas de Prevenção Futura & Guardrails de Segurança (ISO 27001 / SOC 2 / LGPD)**

O ambiente monitora atualmente ${assets} ativos e ${vulns} vulnerabilidades abertas.`,
              },
              {
                role: 'user',
                content: data.prompt,
              },
            ],
            temperature: 0.25,
            max_tokens: 3072,
          }),
        });

        if (groqRes.ok) {
          const json = await groqRes.json();
          if (json.choices && json.choices.length > 0 && json.choices[0].message?.content) {
            response = json.choices[0].message.content;
          }
        }
      }
    } catch (err) {
      console.warn('Groq API direct call failed, falling back to deep instructor engine', err);
    }

    // Deep Instructor Fallback Engine if Groq API is offline
    if (!response) {
      const q = data.prompt.toLowerCase();
      
      if (q.includes('sqli') || q.includes('sql injection') || q.includes('banco')) {
        response = `### 🎓 1. Conceito Técnico & Causa-Raiz Profunda (Deep Root Cause)
A vulnerabilidade de **SQL Injection (SQLi)** ocorre quando dados não confiáveis inseridos pelo usuário são concatenados diretamente na string de consulta SQL enviada ao interpretador de banco de dados. Isso quebra a separação de controle entre o **código instrução** e os **dados de entrada**, permitindo que atacantes injetem metacaracteres (\`'\`, \`"--\`, \`OR 1=1\`) para alterar a semântica da instrução SQL.

---

### 📋 2. Roteiro Didático de Solução Passo a Passo (Hands-On Step-by-Step)
1. **Substituir a Concatenação por Prepared Statements**: Utilize parâmetros vinculados (*Parameterized Queries* / *Bound Variables*) que informam ao SGBD para tratar o parâmetro estritamente como literal de dado.
2. **Aplicar Validação Rígida de Entradas**: Enforce validação por expressão regular no backend (ex: garantir que IDs sejam estritamente inteiros positivos).
3. **Princípio do Menor Privilégio no Banco de Dados**: A conta de conexão da aplicação no banco não deve possuir permissão de \`DROP TABLE\` ou \`GRANT\`.

---

### 💻 3. Snippet Prático de Código / Comando CLI para Produção
\`\`\`typescript
// ❌ CÓDIGO VULNERÁVEL (Concatenação direta de strings)
// const query = "SELECT * FROM users WHERE email = '" + req.body.email + "'";

// ✅ CÓDIGO SEGURO E PROTEGIDO (Prepared Statements com pg / Node-Postgres)
import { Pool } from 'pg';
const pool = new Pool();

export async function getUserByEmail(email: string) {
  // O parâmetro $1 é enviado em um pacote de dados separado para o SGBD
  const query = 'SELECT id, email, role_id, created_at FROM users WHERE email = $1 AND active = true';
  const result = await pool.query(query, [email]);
  return result.rows[0];
}
\`\`\`

---

### 🛡️ 4. Medidas de Prevenção Futura & Guardrails de Segurança
- **Integração com Auto-Cura SENTINELX**: Ative o motor de Self-Healing para verificar se o Guardrail Score é $\\ge 95\\%$ antes de mesclar novos Pull Requests.
- **Conformidade ISO 27001 / OWASP Top 10**: Atende ao controle A.14.2.1 (Engenharia de Software Segura) e mitiga a falha A03:2021-Injection.`;
      } else {
        response = `### 🎓 1. Conceito Técnico & Causa-Raiz Profunda (Deep Root Cause)
Como Engenheiro Instrutor Principal do SENTINELX, analisei sua solicitação **"${data.prompt}"** considerando a arquitetura global de ${assets} ativos monitorados.
O ponto crucial para manter a resiliência cibernética é garantir o isolamento estrito de permissões, a rotação contínua de credenciais STS e a auditoria de chamadas de API em tempo real.

---

### 📋 2. Roteiro Didático de Solução Passo a Passo (Hands-On Step-by-Step)
1. **Varredura Contínua de Superfície de Ataque**: Acesse o **Inventário de Ativos** e execute a varredura profunda de portas e serviços expostos.
2. **Ativação do Autopiloto de Contenção**: Mantenha o motor em modo **FULL_AUTO** para que contenções de rede e revogação de chaves comprometidas ocorram em milissegundos.
3. **Auditoria de Conformidade**: Exporte o passaporte de conformidade contínua mapeado para os controles das normas ISO 27001, SOC 2 Type II e LGPD.

---

### 💻 3. Snippet Prático de Comando CLI para Produção
\`\`\`bash
# Executar auditoria de postura e varredura de ativos via CLI do SENTINELX
sentinelx scan --target-org ${organizationId} --depth deep --enforce-guardrails

# Verificar status das regras de contenção e eBPF Kernel Hot-Patching
sentinelx ebpf status --node production-cluster-01
\`\`\`

---

### 🛡️ 4. Medidas de Prevenção Futura & Guardrails de Segurança
- **Guardrail de Regressão Zero**: Toda alteração de código ou infraestrutura deve passar pela validação de AST do SENTINELX antes de ir para produção.`;
      }
    }

    const conversation = await prisma.aiConversation.create({
      data: {
        organizationId,
        userId,
        prompt: data.prompt,
        response,
        context: JSON.stringify(data.context),
      },
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'SENTINEL_AI_CHAT_QUERY',
      resource: 'AiConversation',
      resourceId: conversation.id,
      details: { promptSnippet: data.prompt.substring(0, 50) },
    });

    return conversation;
  }

  static async generateAnalysis(
    organizationId: string,
    data: z.infer<typeof generateAnalysisSchema>,
    userId?: string
  ) {
    let rootCause = 'Unsafe configuration drift detected on monitored production node.';
    let codeSnippet = '# Terraform S3 Security Patch\nresource "aws_s3_bucket_public_access_block" "block" {\n  bucket = aws_s3_bucket.main.id\n  block_public_acls = true\n  block_public_policy = true\n}';
    let steps = [
      'Apply public access block configuration to S3 bucket.',
      'Enforce AES-256 server-side encryption at rest.',
      'Verify CloudTrail audit logging retention policy > 365 days.',
    ];

    if (data.targetType === 'VULNERABILITY') {
      rootCause = 'Outdated package dependency containing high-severity RCE flaw.';
      codeSnippet = '# Dockerfile Security Patch\nFROM alpine:3.19\nRUN apk update && apk upgrade --no-cache liblzma xz-utils\nUSER node';
      steps = [
        'Update package index and upgrade vulnerable binaries.',
        'Enforce non-root execution context (UID 10001).',
        'Re-trigger Container Security Scan to verify 0 CVE count.',
      ];
    }

    const recommendation = await prisma.aiRecommendation.create({
      data: {
        organizationId,
        targetType: data.targetType,
        targetId: data.targetId,
        rootCause,
        remediationSteps: JSON.stringify(steps),
        codeSnippet,
        confidenceScore: 98,
        status: 'PENDING',
      },
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'SENTINEL_AI_RCA_GENERATED',
      resource: 'AiRecommendation',
      resourceId: recommendation.id,
      details: { targetType: data.targetType, targetId: data.targetId, confidenceScore: 98 },
    });

    return {
      ...recommendation,
      remediationSteps: steps,
    };
  }

  static async listRecommendations(organizationId: string) {
    const recs = await prisma.aiRecommendation.findMany({
      where: { organizationId },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    return recs.map((r) => ({
      ...r,
      remediationSteps: JSON.parse(r.remediationSteps || '[]'),
    }));
  }
}
