# Backlog do Projeto dataPATH — Mini-PACS & Onboarding
Status Geral: 100% CONCLUÍDO (MVP FASE 1 & PRODUÇÃO)
Ambiente Atual: Produção (Hetzner / Portainer / Docker / SSL HTTPS) — `https://datapath.produtoweb.com.br`
Stack: .NET 8 (ASP.NET Core Web API) + PostgreSQL 16 + React 18 (Vite/TypeScript/Tailwind v4)

## Legenda de Status
- [ ] Todo (Pendente)
- [/] In Progress (Em Andamento)
- [x] Done (Concluído)

---

## ÉPICO 1: Fundação, Infraestrutura Docker e Banco de Dados
- [x] **US-101**: Criar estrutura de pastas limpa (Backend .NET, Frontend React) e arquivo `docker-compose.yml` com serviços para API, Web e PostgreSQL (volume local persistente).
- [x] **US-102**: Configurar Entity Framework Core 8 com migrations e modelar as entidades primárias: `User`, `BiopsyCase`, `SlideFile`, `ClinicalOpinion` e `AuditLog`.
- [x] **US-103**: Criar Seed de dados inicial no banco (usuário Admin local para testes e 2 casos clínicos fakes).

## ÉPICO 2: Autenticação, Segurança e Conformidade LGPD (RBAC)
- [x] **US-201**: Implementar autenticação via JWT (JSON Web Token) no .NET 8 com senhas hasheadas utilizando BCrypt ou Argon2.
- [x] **US-202**: Configurar controle de acesso baseado em cargos (RBAC): perfil `LabOperator` (acesso total no CRUD), `SpecialistDoctor` (acesso aos casos) e `Admin` (governança).
- [x] **US-203**: Criar middleware de auditoria (`AuditLogMiddleware`) para registrar no banco (IP, Horário, Usuário e Ação) todo acesso a metadados clínicos e arquivos.

## ÉPICO 3: Mini-PACS e Cadastro de Casos Clínicos
- [x] **US-301**: Criar endpoints REST (CRUD) no .NET para gerenciar Casos Clínicos (`BiopsyCase`) com campos anonimizados (ID do Caso, Órgão, Coloração HE/Imuno, Resumo Clínico).
- [x] **US-302**: Desenvolver tela em React/Tailwind para a operadora cadastrar novas biópsias e fazer upload/vínculo do arquivo WSI de teste.
- [x] **US-303**: Desenvolver tela de Dashboard em React listando os casos, com filtros rápidos por Órgão, Data e Status de Laudo (Pendente/Concluído).

## ÉPICO 4: Camada de Armazenamento Abstraída (Storage Provider)
- [x] **US-401**: Criar a interface C# `IStorageProvider` declarando métodos `SaveFileAsync()`, `GetFileUrlAsync()` e `GenerateTemporaryLinkAsync(string fileId, int expirationDays)`.
- [x] **US-402**: Implementar `LocalFileSystemDriver` para armazenamento persistente de arquivos WSI no container/servidor.
- [x] **US-403**: Criar a estrutura base (esboço injetável via DI) do `QnapRestApiDriver` para futura conexão com NAS File Station.

## ÉPICO 5: Módulo de Laudo Assíncrono (2ª Opinião Remota)
- [x] **US-501**: Criar endpoint e tela React para o patologista externo logado abrir o caso, ler a anamnese e preencher o parecer técnico (`ClinicalOpinion`).
- [x] **US-502**: Adicionar lógica no back-end que altera o status do caso para `Laudado` ao receber o parecer e salva o registro histórico com carimbo de tempo.
- [x] **US-503**: Implementar geração de relatório clínico em PDF no back-end compilando dados do caso e o laudo final.

## ÉPICO 6: Automações de Rotina e Fechamento
- [x] **US-601**: Implementar `BackgroundService` (.NET Hosted Service) executando rotinas diárias para verificar links/casos expirados (>30 dias) e alterar status para `ReadyForArchive`.
- [x] **US-602**: Criar suíte de testes unitários no .NET para os serviços de autenticação, regras da LGPD e driver de armazenamento local.

## ÉPICO 7: Módulo de Onboarding & Captação de Parceiros (Scanner 3DHISTECH & PCR)
- [x] **US-701**: Criar entidades C# `EquipmentAccessRequest` para captura de dados cadastrais, vinculo institucional (IC, Mestrado, Doutorado), aprovação ética CEP/CEUA e politica de armazenamento.
- [x] **US-702**: Criar endpoints em `OnboardingController` para submissão pública e listagem gestora de solicitações de onboarding.
- [x] **US-703**: Desenvolver interface responsiva `OnboardingApplyPage.tsx` em 4 seções com validações, upload de documentos CEP/CEUA em PDF e seleção de equipamentos (Scanner 3DHISTECH / Real Time 7500 PCR).
- [x] **US-704**: Desenvolver painel gestor `OnboardingManagementPage.tsx` para aprovação/rejeição de parceiros cadastrados.

## ÉPICO 8: Implantação e Deploy em Produção (Hetzner / Portainer)
- [x] **US-801**: Criar arquivo `docker-compose.prod.yml` e `Dockerfile.prod` otimizados para produção com multi-stage build (.NET 8 + Nginx + Node).
- [x] **US-802**: Configurar stack `app-datapath` no Portainer do servidor Hetzner em `https://pac.produtoweb.com.br`.
- [x] **US-803**: Configurar proxy reverso Nginx com integração automática SSL/TLS via Let's Encrypt (ACME Companion) no domínio `https://datapath.produtoweb.com.br`.
- [x] **US-804**: Desenvolver scripts de automação PowerShell para hot-deploy de atualizações sem downtime e sem dependência de GitHub Actions.

## ÉPICO 9: Refinamento de UI/UX, Design System e Espaçamento
- [x] **US-901**: Refatorar o layout global do frontend ajustando respiro interno (padding `p-6`/`p-8`) em todos os cards, formulários e painéis para evitar contato de textos/ícones com as bordas arredondadas (`rounded-2xl`).
- [x] **US-902**: Ajustar responsividade do dashboard de métricas e tabela de casos histopatológicos.