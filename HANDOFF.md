# 🚀 GUIA DE HANDOFF TÉCNICO & TRANSIÇÃO DE PROJETO — dataPATH

> **Documento de Transição Oficial do Projeto dataPATH**  
> **Última Atualização:** 28 de Julho de 2026  
> **Status:** 100% Funcional e Implantado em Produção com SSL HTTPS ativo  
> **URL do Sistema em Produção:** `https://datapath.produtoweb.com.br`  
> **Painel Portainer (Gestão Docker):** `https://pac.produtoweb.com.br/#!/auth`

---

## 📌 1. Visão Geral do Sistema

O **dataPATH** é uma plataforma de Patologia Digital Mini-PACS e Módulo de Onboarding/Captação de Parceiros para solicitação de uso e digitalização de lâminas histopatológicas em altíssima resolução (WSI — Gigapixel).

### Principais Módulos do Sistema:
1. **Mini-PACS WSI**: Cadastro e visualização de casos clínicos anonimizados, associados a lâminas WSI.
2. **2ª Opinião Remota Assíncrona**: Emissão de pareceres diagnósticos por médicos patologistas com geração de laudos em PDF.
3. **Módulo de Onboarding de Parceiros**: Formulário público para cadastro de pesquisadores/instituições com envio de aprovação ética (CEP/CEUA) e seleção de equipamentos (*Scanner 3DHISTECH* e *Real Time 7500 PCR*).
4. **Governança & Auditoria LGPD**: Registro rigoroso de acessos (IP, timestamp, usuário, ação) para conformidade com a Lei 13.709/2018.

---

## 🛠️ 2. Arquitetura e Stack Tecnológica

### Backend
* **Linguagem / Framework**: C# / .NET 8 (ASP.NET Core Web API)
* **Banco de Dados**: PostgreSQL 16 Alpine com Entity Framework Core 8
* **Autenticação**: JWT (JSON Web Tokens) com RBAC (`Admin`, `LabOperator`, `SpecialistDoctor`)
* **Armazenamento**: Abstração `IStorageProvider` com implementação `LocalFileSystemDriver` (suporta expansão para NAS QNAP)
* **Localização no Código**: `backend/src/DataPath.Api`, `backend/src/DataPath.Core`, `backend/src/DataPath.Infrastructure`

### Frontend
* **Framework**: React 18 + TypeScript + Vite 8
* **Estilização**: TailwindCSS v4 + CSS Vanilla (`index.css`)
* **Design System**: Modos escuros avançados, cores tailgated, cards com bordas arredondadas (`rounded-2xl`) e amplo respiro interno (`p-6`/`p-8`)
* **Localização no Código**: `frontend/src/`

---

## 🔐 3. Credenciais e Acessos

### Credenciais de Teste da Aplicação (Produção e Local)
* **Senha Padrão para todos os usuários cadastrados:** `DataPath@2026`

| Perfil | E-mail | Descrição do Escopo |
| :--- | :--- | :--- |
| **Administrador** | `admin@datapath.local` | Acesso total, gestão de usuários, auditoria LGPD e onboarding |
| **Técnico de Laboratório** | `maria.silva@datapath.local` | Criar casos, associar lâminas WSI, gerenciar parceiros |
| **Médico Patologista** | `carlos.mendes@datapath.local` | Visualizar lâminas, emitir pareceres de 2ª opinião |

### Credenciais de Infraestrutura (Portainer Server)
* **URL:** `https://pac.produtoweb.com.br/#!/auth`
* **Usuário:** `pwbot`
* **Senha:** `sneviugaS!26`
* **Stack Name:** `app-datapath` (obrigatoriamente prefixado com `app-`)

---

## 🚢 4. Como Executar Deploys e Atualizações (Sem GitHub Actions)

O projeto **NÃO UTILIZA GITHUB ACTIONS** conforme decisão de arquitetura. O deploy de alterações é feito de forma direta e otimizada:

### Opção A: Atualizar Apenas o Frontend (Hot-Deploy Instantâneo - 10 Segundos)
Quando modificar apenas arquivos do frontend em `frontend/src/`:

1. Abra o terminal na pasta raiz e compile o frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Execute o script de hot-deploy via PowerShell:
   ```powershell
   powershell -ExecutionPolicy Bypass -File "scratch/hot_deploy_exec.ps1"
   ```
   *O script empacota o `dist/` em base64 e o injeta via API Exec do Portainer direto em `/usr/share/nginx/html` no container `datapath-app`, recarregando o Nginx sem derrubar o backend.*

### Opção B: Atualizar o Backend ou Alterações Estruturais
Quando modificar arquivos do C# / .NET / Migrations:

1. Faça commit e push das alterações para a branch `master`:
   ```bash
   git add .
   git commit -m "feat: sua mensagem"
   git push origin master
   ```
2. Execute o script de redeploy da stack:
   ```powershell
   powershell -ExecutionPolicy Bypass -File "scratch/portainer_deploy.ps1"
   ```

---

## 📁 5. Estrutura de Arquivos Principais

```
Sistema/
├── ARCHITECTURE.md                 # Especificação arquitetônica das camadas .NET
├── BACKLOG.md                      # Lista completa de User Stories concluídas
├── HANDOFF.md                      # (Este arquivo) Guia mestre de transição
├── Dockerfile.prod                 # Multi-stage build (.NET 8 + Node + Nginx)
├── docker-compose.prod.yml         # Configuração da stack de produção
├── backend/                        # Solução .NET 8 (Core, Infrastructure, Api)
│   └── src/
│       ├── DataPath.Api/           # Controllers e Web API
│       ├── DataPath.Core/          # Entidades (BiopsyCase, EquipmentAccessRequest, etc)
│       └── DataPath.Infrastructure/# DB Context, EF Migrations e Services
├── frontend/                       # Aplicação React 18 + Vite
│   └── src/
│       ├── components/             # Componentes reusáveis (Navbar, etc)
│       ├── pages/                  # Dashboard, Onboarding, CaseDetail, AuditLogs
│       └── index.css               # Design system e tema global Tailwind
├── docs/                           # Manuais do usuário e capturas de tela
│   └── manual-impresso.html        # Manual oficial para impressão/PDF
└── scratch/                        # Scripts de suporte e automações de deploy
    ├── hot_deploy_exec.ps1         # Script de hot-deploy rápido do frontend
    └── portainer_deploy.ps1        # Script de deploy completo da stack Portainer
```

---

## 💡 6. Dicas e Próximos Passos Recomendados para a Próxima IA / Dev

1. **Adicionar novos campos ao Onboarding**: Caso precise adicionar campos no formulário de captação de parceiros, modifique a entidade `EquipmentAccessRequest.cs` em `backend/src/DataPath.Core/Entities/` e adicione o campo correspondente em `OnboardingApplyPage.tsx`.
2. **Integração com NAS QNAP**: O driver de armazenamento abstrato em `backend/src/DataPath.Infrastructure/Storage/LocalFileSystemDriver.cs` pode ser substituído por `QnapRestApiDriver.cs` alterando apenas a flag `"Storage:DriverType": "Qnap"` no `appsettings.json`.
3. **Certificado SSL**: O SSL é gerado e renovado automaticamente pelo container `acme-companion` do Nginx Proxy presente no servidor.
