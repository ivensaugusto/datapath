# Backlog do Projeto dataPATH — MVP (Fase 1)
Status Geral: CONCLUÍDO (100% MVP FASE 1)
Ambiente Atual: Desenvolvimento Local (Notebook / Docker Desktop)
Stack: .NET 8 (ASP.NET Core Web API) + PostgreSQL 16 + React 18 (Vite/TypeScript/Tailwind)

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
- [x] **US-202**: Configurar controle de acesso baseado em cargos (RBAC): perfil `LabOperator` (acesso total no CRUD) e `SpecialistDoctor` (acesso restrito aos casos vinculados).
- [x] **US-203**: Criar middleware de auditoria (`AuditLogMiddleware`) para registrar no banco (IP, Horário, Usuário e Ação) todo acesso a metadados clínicos e arquivos.

## ÉPICO 3: Mini-PACS e Cadastro de Casos Clínicos
- [x] **US-301**: Criar endpoints REST (CRUD) no .NET para gerenciar Casos Clínicos (`BiopsyCase`) com campos anonimizados (ID do Caso, Órgão, Coloração HE/Imuno, Resumo Clínico).
- [x] **US-302**: Desenvolver tela em React/Tailwind para a operadora cadastrar novas biópsias e fazer upload/vínculo do arquivo WSI de teste.
- [x] **US-303**: Desenvolver tela de Dashboard em React listando os casos, com filtros rápidos por Órgão, Data e Status de Laudo (Pendente/Concluído).

## ÉPICO 4: Camada de Armazenamento Abstraída (Storage Provider)
- [x] **US-401**: Criar a interface C# `IStorageProvider` declarando métodos `SaveFileAsync()`, `GetFileUrlAsync()` e `GenerateTemporaryLinkAsync(string fileId, int expirationDays)`.
- [x] **US-402**: Implementar `LocalFileSystemDriver` para rodar no Notebook durante o desenvolvimento, simulando geração de links temporários locais com token de expiração.
- [x] **US-403**: Criar a estrutura base (esboço injetável via DI) do `QnapRestApiDriver` para futura conexão no File Station com sessão autenticada (`SID`).

## ÉPICO 5: Módulo de Laudo Assíncrono (2ª Opinião Remota)
- [x] **US-501**: Criar endpoint e tela React para o patologista externo logado abrir o caso, ler a anamnese e preencher o formulário de parecer técnico (`ClinicalOpinion`).
- [x] **US-502**: Adicionar lógica no back-end que altera o status do caso para `Laudado` ao receber o parecer e salva o registro histórico com carimbo de tempo.
- [x] **US-503**: Implementar geração de relatório clínico em PDF no back-end (utilizando biblioteca como QuestPDF ou iText7) compilando dados do caso e o laudo final.

## ÉPICO 6: Automações de Rotina e Fechamento
- [x] **US-601**: Implementar `BackgroundService` (.NET Hosted Service) executando diariamente às 03h00 para verificar links/casos expirados (>30 dias) e alterar status para `ReadyForArchive`.
- [x] **US-602**: Criar suíte de testes unitários básicos no .NET (xUnit) para os serviços de autenticação, regras da LGPD e driver de armazenamento local.