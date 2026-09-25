# Software Requirements Specification (SRS)
## DataPATH — Plataforma de Patologia Digital Mini-PACS

### 1. Introdução

#### 1.1 Propósito
Este documento de Especificação de Requisitos de Software (SRS) descreve a arquitetura, funcionalidades, modelo de dados e infraestrutura da plataforma **DataPATH**. Ele serve como uma referência rápida e completa para desenvolvedores, arquitetos e inteligências artificiais (IAs) envolvidas na manutenção, evolução e compreensão do sistema, evitando a necessidade de análise extensiva do código-fonte.

#### 1.2 Escopo
O **DataPATH** é uma plataforma de Patologia Digital (Mini-PACS) desenvolvida para gestão, visualização e emissão de laudos de segunda opinião remota para casos clínicos anonimizados com lâminas WSI (Whole Slide Imaging) de gigapixels. O sistema inclui um módulo de onboarding para parceiros e rígidos controles de governança e auditoria em conformidade com a LGPD.

#### 1.3 Definições e Acrônimos
* **WSI**: Whole Slide Imaging (Imagem de Lâmina Inteira).
* **PACS**: Picture Archiving and Communication System (Sistema de Comunicação e Arquivamento de Imagens).
* **LGPD**: Lei Geral de Proteção de Dados.
* **RBAC**: Role-Based Access Control (Controle de Acesso Baseado em Perfis).
* **CEP/CEUA**: Comitê de Ética em Pesquisa / Comitê de Ética no Uso de Animais.

---

### 2. Descrição Geral

#### 2.1 Perspectiva do Produto
O DataPATH é um sistema web autônomo, desenhado em arquitetura **Clean Architecture** (Api, Core, Infrastructure), com backend em .NET 8, banco de dados PostgreSQL 16 e frontend em React 18 com TypeScript, Vite 8 e TailwindCSS v4. É implantado via contêineres Docker no Hetzner através do Portainer.
* **URL de Produção**: [https://datapath.produtoweb.com.br](https://datapath.produtoweb.com.br)

#### 2.2 Principais Funções (Módulos)
1. **Mini-PACS WSI**: Cadastro e visualização de casos clínicos anonimizados com lâminas WSI.
2. **2ª Opinião Remota Assíncrona**: Emissão de pareceres diagnósticos por patologistas, com geração de laudos em PDF.
3. **Onboarding de Parceiros**: Formulário público para submissão de cadastro de pesquisadores/instituições com upload de aprovação ética.
4. **Governança & Auditoria LGPD**: Registro e rastreabilidade de acessos e ações no sistema.

#### 2.3 Perfis de Usuário (RBAC)
O sistema utiliza controle de acesso baseado em funções com os seguintes perfis:
* **Admin** (`admin@datapath.local`): Acesso total a todas as funcionalidades do sistema, incluindo auditoria e gestão de usuários/casos.
* **LabOperator** (`maria.silva@datapath.local`): Responsável por cadastrar novos casos, gerenciar o onboarding de parceiros e aprovações.
* **SpecialistDoctor** (`carlos.mendes@datapath.local`): Médico patologista que visualiza lâminas e emite pareceres diagnósticos (2ª opinião).
* **Senha padrão**: `DataPath@2026`

#### 2.4 Restrições e Premissas
* **Anonimização (LGPD)**: É estritamente proibido armazenar nome, CPF, telefone ou quaisquer dados diretamente identificáveis do paciente. Todo caso é tratado por um código interno (ex: `DP-YYYY-XXXX`).
* Tema da interface restrito ao modo "light" institucional.

---

### 3. Requisitos Funcionais

#### Épico 1: Gestão de Casos Clínicos (Mini-PACS)
* **RF01.1**: O sistema deve permitir o cadastro de casos clínicos (apenas perfis LabOperator e Admin) contendo dados demográficos anonimizados e dados clínicos.
* **RF01.2**: O sistema deve gerar automaticamente um código interno único para o caso no formato `DP-YYYY-XXXX`.
* **RF01.3**: O sistema deve permitir o upload de arquivos WSI associados ao caso (até 2GB por arquivo), gerando um hash SHA-256 para integridade.
* **RF01.4**: O sistema deve fornecer uma listagem paginada de casos com filtros por local anatômico (organSite), status e busca por texto livre, garantindo o isolamento (multi-tenant) quando aplicável.
* **RF01.5**: O sistema deve permitir o download e a visualização em stream (HTTP Range) das lâminas WSI com links temporários seguros.

#### Épico 2: Laudos e 2ª Opinião Remota
* **RF02.1**: O sistema deve permitir que médicos especialistas (SpecialistDoctor) e Admins emitam pareceres diagnósticos para os casos, alterando o status para `InReview`.
* **RF02.2**: O sistema deve permitir a assinatura eletrônica do laudo, alterando o status para `Laudado`.
* **RF02.3**: O sistema deve gerar um laudo em formato PDF e HTML para visualização.

#### Épico 3: Onboarding de Parceiros
* **RF03.1**: O sistema deve disponibilizar um formulário público sem autenticação para solicitações de captação/onboarding de parceiros e pesquisadores.
* **RF03.2**: O formulário deve aceitar o upload de até 5 documentos comprobatórios (ex: PDFs de aprovação CEP) com tamanho máximo total de 50MB.
* **RF03.3**: O sistema deve permitir que operadores (LabOperator e Admin) listem e visualizem as solicitações e os PDFs embutidos.
* **RF03.4**: A aprovação do onboarding deve criar automaticamente a Instituição Parceira, Usuário, Ordem de Serviço (DigitizationOrder) e Pasta (SlideFolder).
* **RF03.5**: O sistema deve permitir a rejeição do onboarding com exigência de justificativa.

#### Épico 4: Governança e Auditoria
* **RF04.1**: O sistema deve registrar automaticamente trilhas de auditoria (Audit Log) para ações críticas, incluindo a ação, entidade afetada, IP, UserAgent e Timestamp.
* **RF04.2**: O sistema deve disponibilizar uma consulta paginada de logs de auditoria exclusivamente para administradores.

---

### 4. Requisitos Não-Funcionais

* **RNF01 (Segurança/LGPD)**: Proteção rigorosa dos dados. Nenhum dado de identificação pessoal de pacientes deve transitar ou ser armazenado no banco de dados. Os arquivos digitais expiram através de links temporários com HMAC/SHA-256.
* **RNF02 (Desempenho)**: Suporte para uploads granulares de arquivos WSI pesados (até 2GB). Implementação de HTTP Range Requests para visualização eficiente.
* **RNF03 (Armazenamento)**: Abstração de armazenamento (`IStorageProvider`), permitindo o uso de FileSystem local ou APIs remotas (ex: QnapRestApiDriver). Suporte a políticas de retenção (Background Service executa expurgo após 30 dias).
* **RNF04 (Disponibilidade)**: Infraestrutura em contêineres Docker, gerenciados via Docker Compose com Nginx para proxy reverso. Deploy via scripts PowerShell com indisponibilidade mínima.

---

### 5. Modelo de Dados

O sistema possui 9 entidades de domínio principais.

| Entidade | Descrição / Campos Principais |
| :--- | :--- |
| **User** | Identidade, RBAC, CRM/CRBM, Especialidade, Tenant (PartnerInstitution). |
| **BiopsyCase** | Entidade central (anonimizada). `InternalCaseCode` (DP-YYYY-XXXX), `OrganSite`, `StainingType`, `ClinicalSummary`, `Status` (Enum), `PatientBiologicalSex`, `PatientAgeAtBiopsy`. |
| **SlideFile** | Metadados WSI. `StoragePath`, `Size`, `MimeType`, `HashSha256`, link temporário assinado com expiração. |
| **ClinicalOpinion** | Laudo 2ª opinião. `DiagnosticImpression`, `MicroscopicDescription`, `PriorityLevel`, `IsSigned`. |
| **SlideFolder** | Acervos com políticas de retenção (Enum: PrivateTemporary, PrivatePersistent, PublicRepository). |
| **PartnerInstitution** | Tenant multi-institucional. `CorporateName`, `TradeName`, `DocumentNumber`, `Type` (Enum). |
| **DigitizationOrder** | Ordem de Serviço. `OrderCode` (ORD-YYYY-XXXX), `Status` (Enum: Received, Scanning, Completed, Delivered). |
| **EquipmentAccessRequest**| Captação de parceiros para equipamentos (Scanner 3DHISTECH, PCR Real Time 7500). Status: Pending, Approved, Rejected. |
| **AuditLog** | Conformidade LGPD. `Action`, `EntityName`, `IpAddress`, `UserAgent`, `Timestamp`. |

#### 5.1 Enums Principais
* **CaseStatus**: Pending, InReview, Laudado, ReadyForArchive.
* **UserRole**: LabOperator, SpecialistDoctor, Admin.
* **EquipmentModality**: IniciacaoCientifica, Mestrado, Doutorado, PosDoc, ParceiroClinico, Outro.
* **PartnerInstitutionType**: AcademicResearch, ClinicalLab, Hospital, IndependentPathologist.

---

### 6. Referência da API

A API é estruturada em 7 Controllers. O sistema baseia-se na autenticação JWT.

#### AuthController (`/api/auth`)
* `POST /api/auth/login` [AllowAnonymous]: Autenticação JWT.
* `GET /api/auth/me` [Authorize]: Retorna perfil do usuário autenticado.

#### CasesController (`/api/cases`)
* `GET /api/cases` [Authorize]: Lista com paginação, filtros e suporte a multi-tenant.
* `GET /api/cases/{id}` [Authorize]: Detalhes do caso e links WSI assinados com duração de 30 dias.
* `POST /api/cases` [LabOperator, Admin]: Cadastrar novo caso.
* `POST /api/cases/{id}/slides` [LabOperator, Admin]: Upload WSI (até 2GB, gera SHA-256).
* `PUT /api/cases/{id}` [LabOperator, Admin]: Atualizar metadados do caso.
* `DELETE /api/cases/{id}` [Admin]: Remover caso e arquivos.

#### FilesController (`/api/files`)
* `GET /api/files/download/{slideId}` [Authorize]: Stream do arquivo WSI com suporte a HTTP Range.
* `GET /api/files/shared/{encodedPath}` [AllowAnonymous]: Download através de link temporário HMAC/SHA256.

#### OpinionsController (`/api/opinions`)
* `POST /api/opinions/cases/{caseId}` [SpecialistDoctor, Admin]: Registrar parecer (Rascunho), muda caso para `InReview`.
* `POST /api/opinions/{opinionId}/sign` [SpecialistDoctor, Admin]: Assinar laudo definitivamente, muda caso para `Laudado`.
* `GET /api/opinions/cases/{caseId}/report` [Authorize]: Gera/retorna PDF ou HTML do laudo.

#### OnboardingController (`/api/v1/onboarding`)
* `POST /api/v1/onboarding/apply` [AllowAnonymous]: Envio de solicitação (Formulário + até 5 PDFs, máx 50MB).
* `GET /api/v1/onboarding/requests` [LabOperator, Admin]: Listagem paginada de solicitações pendentes.
* `GET /api/v1/onboarding/requests/{id}/documents/{index}` [LabOperator, Admin]: Exibe PDF inline no navegador.
* `POST /api/v1/onboarding/requests/{id}/approve` [LabOperator, Admin]: Aprova solicitação (Workflow de criação em cadeia).
* `POST /api/v1/onboarding/requests/{id}/reject` [LabOperator, Admin]: Rejeita solicitação exigindo justificativa.

#### AuditLogsController (`/api/auditlogs`)
* `GET /api/auditlogs` [Admin]: Consulta paginada com filtros (action, entityName).

#### HealthController (`/api/health`)
* `GET /api/health` [AllowAnonymous]: Retorna status da API, versão e timestamp.

---

### 7. Referência do Frontend

O frontend utiliza React 18 e Vite, implementando um roteador customizado (History API). O design system não possui dark mode (apenas tema claro).

#### 7.1 Rotas e Componentes

| Path | Componente | Nível de Acesso |
| :--- | :--- | :--- |
| `/` ou `/home` | `HomePage` | Público |
| `/onboarding` ou `/cadastrar` | `OnboardingApplyPage` | Público |
| `/login` | `LoginPage` | Público |
| `/dashboard` ou `/sistema` | `DashboardPage` | Autenticado |
| `/novo-caso` | `NewCasePage` | Admin, LabOperator |
| `/caso/:id` | `CaseDetailPage` | Autenticado |
| `/gestao-onboarding`| `OnboardingManagementPage` | Admin, LabOperator |
| `/auditoria` | `AuditLogsPage` | Admin |
| `/manual` | Redirecionamento | Público |

#### 7.2 Design System e UI
* **Cores Principais**: Sky-600 (`#0284c7`), Teal-700 (`#0f766e`). Background Slate-50 (`#f8fafc`). Textos em Slate-900 e Slate-500.
* **Gradiente**: Linear de Sky-600 para Teal-700.
* **Estilos Comuns**:
  * `.glass-card`: Fundo branco, borda slate-200, sombra suave, efeito `translateY` no hover.
  * `.glow-cyan`: `rgba(2,132,199,0.25)`.
  * **Tipografia**: Utilização de `system-ui` stack. Bordas arredondadas (`rounded-2xl`) com padding amplo (`p-6` / `p-8`).
* **Componentes Exclusivos**: `SlideThumb.tsx` gerador de miniaturas SVG procedurais baseadas na coloração histológica (HE, Ki-67, HER2, PAS, Giemsa).

---

### 8. Infraestrutura e Deploy

#### 8.1 Stack e Hospedagem
* **Ambiente de Produção**: Servidores no provedor Hetzner, orquestrados pelo Portainer.
* **Docker Compose (`docker-compose.prod.yml`)**:
  1. `postgres:16-alpine` (Banco de dados)
  2. `.NET 8 API` (Backend)
  3. `Nginx + React` (Frontend)
* **Rede**: Conexão com proxy reverso externo `pwbot_net` configurado via `nginx-proxy`.
* **Certificados**: Geração automática SSL Let's Encrypt via `acme-companion`.

#### 8.2 Background Services (Workers .NET)
* **CaseRetentionBackgroundService**: Controla exclusão lógica/física após o período de 30 dias estabelecido.
* **StoragePurgeBackgroundService**: Limpeza e manutenção de arquivos órfãos.

#### 8.3 Scripts de Automação (Powershell)
Localizados na pasta `/scratch/`:
* `hot_deploy_exec.ps1`: Implantação rápida e hot-reload focado no frontend.
* `portainer_deploy.ps1`: Script de implantação completo (build, push, webhook) da stack inteira.

#### 8.4 Estrutura de Diretórios
```text
Sistema/
├── backend/src/
│   ├── DataPath.Api/            (Controllers, Middlewares, Program.cs)
│   ├── DataPath.Core/           (Entities, Interfaces, DTOs, Enums)
│   └── DataPath.Infrastructure/ (DbContext, Migrations, Auth, Storage, Background)
├── frontend/src/
│   ├── App.tsx                  (Router customizado com History API)
│   ├── index.css                (Design system Tailwind v4)
│   ├── components/              (Navbar, KpiCard, StatusBadge, SlideThumb)
│   ├── pages/                   (8 páginas principais)
│   ├── services/api.ts          (Cliente REST via Axios ou fetch com JWT)
│   ├── context/AuthContext.tsx
│   └── types/api.ts             (Interfaces TypeScript)
├── docs/                        (Documentação, este SRS)
├── scratch/                     (Scripts de deploy PowerShell)
├── Dockerfile.prod              (Multi-stage build: .NET 8 + Node + Nginx)
└── docker-compose.prod.yml
```

---

### 9. Glossário
* **Anonimização**: Processo obrigatório pela LGPD que remove ligações entre os dados armazenados e o paciente real.
* **Mini-PACS**: Uma versão simplificada de um PACS, focada num escopo clínico reduzido, neste caso, limitado ao armazenamento e gestão de biópsias histopatológicas.
* **Onboarding**: Ação de captar e cadastrar um novo parceiro de pesquisa clínica que deseja utilizar equipamentos (Scanner/PCR).
* **Workflow de Aprovação**: O processo sistêmico de transformar uma aplicação submetida no formulário público em um ambiente funcional e pronto para acesso.
