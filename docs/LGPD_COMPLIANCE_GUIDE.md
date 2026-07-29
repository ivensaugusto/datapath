# 🛡️ Guia de Governança, Segurança & Conformidade LGPD — dataPATH

Especificação técnica dos mecanismos de conformidade com a **Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)** implementados na plataforma **dataPATH**.

---

## 1. Princípios Fundamentais Aplicados

O sistema dataPATH foi construído sob o princípio de **Privacy by Design & Privacy by Default**, garantindo a proteção de dados de saúde sensíveis (Art. 5º, II da LGPD):

| Princípio LGPD | Implementação Técnica no dataPATH |
| :--- | :--- |
| **Pseudonimização (Art. 13)** | Todos os casos histopatológicos recebem um identificador público pseudonimizado (ex: `DP-2026-0089`). Nome completo, CPF, RG ou dados de contato do paciente **nunca são armazenados** na camada clínica do Mini-PACS. |
| **Finalidade & Adequação (Art. 6º, I e II)** | Apenas dados histopatológicos estritamente necessários para o diagnóstico (órgão, coloração, idade à biópsia e sexo biológico) são processados. |
| **Segurança & Confidencialidade (Art. 46)** | Criptografia SSL/TLS em trânsito (HTTPS), hashing de senhas com algoritmos fortes (BCrypt/Argon2) e isolamento de banco de dados em rede containerizada interna. |
| **Responsabilização & Prestação de Contas (Art. 6º, X)** | Trilha imutável de auditoria (`AuditLogMiddleware`) que registra cada acesso, leitura de caso ou download de lâmina gigapixel. |

---

## 2. Trilha de Auditoria Imutável (`AuditLogMiddleware`)

Toda requisição que consome metadados de pacientes ou arquivos de imagem WSI é interceptada pelo middleware de auditoria da API .NET 8.

### 2.1 Estrutura do Log de Auditoria
Cada registro no banco PostgreSQL contém:
- **Timestamp UTC:** Data e hora exata no padrão ISO-8601.
- **User ID & Email:** Identificação do operador ou médico autenticado.
- **Role:** Perfil de acesso (`LabOperator`, `SpecialistDoctor`, `Admin`).
- **IP de Origem:** Endereço IP do dispositivo cliente (preservado pelo `X-Forwarded-For` do Nginx).
- **Ação:** Método HTTP e rota acessada (ex: `GET /api/cases/case-902-abc`).
- **User-Agent:** Identificador do navegador/sistema operacional.

### 2.2 Imutabilidade
Os logs de auditoria não possuem endpoints de alteração (`UPDATE`) ou exclusão (`DELETE`). Apenas o administrador pode consultar ou exportar relatórios periódicos de conformidade.

---

## 3. Matriz de Controle de Acesso Baseado em Cargos (RBAC)

| Funcionalidade | Técnico Lab (`LabOperator`) | Médico Patologista (`SpecialistDoctor`) | Administrador (`Admin`) |
| :--- | :---: | :---: | :---: |
| Cadastrar Caso Clínico | ✅ | ❌ | ✅ |
| Upload de Lâmina WSI | ✅ | ❌ | ✅ |
| Visualizar WSI & Anamnese | ✅ | ✅ | ✅ |
| Emissão / Assinatura de Laudo | ❌ | ✅ | ✅ |
| Aprovar Onboarding de Parceiros | ❌ | ❌ | ✅ |
| Consultar Logs de Auditoria | ❌ | ❌ | ✅ |

---

## 4. Política de Retenção de Dados e Purga Automática

Conforme exigido pelo Art. 16 da LGPD, os dados devem ser eliminados após o término de seu tratamento ou arquivados com segurança:

1. **Casos Ativos:** Mantidos com acesso rápido no NAS/Storage local durante a fase de análise diagnóstica.
2. **Serviço de Arquivamento (`Background Purge Service`):** Um processo hospedado em segundo plano (`HostedService` no .NET 8) executa diariamente à meia-noite verificando casos com mais de 30 dias de conclusão de laudo.
3. **Status `ReadyForArchive`:** O status é alterado automaticamente, revogando links temporários externos e transferindo os arquivos WSI pesados para o cold storage de longo prazo.
