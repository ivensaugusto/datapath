# Path Vision Hub

Create a modern, high-end, ultra-sleek Medical Telepathology & Digital Pathology Web Application called "dataPATH" (Mini-PACS & Equipment Onboarding Portal).

### 🎨 Design System & Aesthetics:

- Style: Modern Clinical Cyber-Tech Workstation with dark mode default (Deep Slate/Navy background `#0b0f17`, polished glassmorphism cards, glowing borders `#1e293b`, subtle accent gradients in Electric Cyan `#06b6d4`, Indigo `#6366f1`, and Emerald Green `#10b981`).

- Typography: Clean sans-serif (Inter / Plus Jakarta Sans), crisp hierarchy, metric counters, smooth status badges.

- Layout: Generous spacing (p-6/p-8 padding), rounded-2xl card containers, smooth transitions, non-cluttered layout.

### 📱 Key Pages & Components to Build:

1. GLOBAL NAVIGATION & HEADER:

- Left: Logo "dataPATH" with a glowing cyan microscope/cell icon and a "Mini-PACS v2.0" pill badge.

- Center/Right: Navigation links (Dashboard, Casos Clínicos, Onboarding de Equipamentos, Gestão de Parceiros, Auditoria LGPD), Notification Bell, Theme Switcher, and User Profile menu (Admin / Patologista).

2. DASHBOARD PAGE (Painel do Mini-PACS):

- Top KPI Summary Cards (5 stats):

  * Total de Casos (Biopsias)

  * Aguardando 2ª Opinião

  * Laudos Concluídos

  * Solicitações de Equipamento

  * Armazenamento WSI (TB / Lâminas Gigapixel)

- Search & Action Bar: Quick search input, Organ filter (Próstata, Mama, Pulmão, Colo do Útero, Rins), Staining Filter (HE, Ki-67, HER2, PAS), Status Filter, and a prominent "+ Nova Biópsia" button.

- Biopsy Cases Table/Grid (Interactive view): Columns for ID do Caso (e.g. #PAT-2026-089), Órgão/Tecido, Coloração, Data de Entrada, Status Badge (Pendente, Em Análise, Laudado, Arquivado), Visualização rápida da lâmina (WSI thumbnail), e botões de ação ("Abrir Lâmina", "Emitir Parecer", "Baixar PDF").

3. CASE DETAIL & WSI VIEWING WORKSPACE (Visualizador de Lâmina & 2ª Opinião):

- Split View Layout:

  * Left Panel (30%): Clinical Metadata & Anamnesis summary, patient code (anonymized), organ, stain type, attending physician, and historical notes.

  * Main Panel (70%): Interactive Gigapixel Slide Viewer mockup. Includes zoom controls (10x, 20x, 40x magnification), pan tools, annotation toolbar (draw region, measure distance in µm, pin diagnostic note), side-by-side stain comparison, and an "Emitir Laudo / Parecer Técnico" drawer with ICD coding and digital signature preview.

4. PARTNER ONBOARDING & EQUIPMENT BOOKING PORTAL (Formulário de Captação de Parceiros):

- Sleek 4-Step Wizard Layout:

  * Step 1 (Identificação): Nome do Pesquisador, CPF/CNPJ, Vínculo (Iniciação Científica, Mestrado, Doutorado, Pós-Doc), Instituição.

  * Step 2 (Seleção de Equipamento): Interactive selectable visual cards for "Scanner de Lâminas 3DHISTECH (Gigapixel 20x/40x)" and "PCR Real-Time 7500 StepOne".

  * Step 3 (Conformidade Ética): Drag-and-drop file upload for Parecer do Comité de Ética (CEP/CEUA PDF), número do parecer, validade, quantidade de amostras e espécie/amostra.

  * Step 4 (Termos & Política de Storage): Acceptance of SLA terms, data retention policy, and final submit button.

5. ONBOARDING MANAGEMENT ADMIN PANEL (Gestão de Parceiros):

- Admin view listing partner applications, CEP/CEUA PDF preview modal, Approval/Rejection buttons with feedback rationale, and partner quota management.

6. LGPD AUDIT TRAIL PAGE (Governança & Auditoria):

- Log table with columns: Data/Hora, Usuário (E-mail/Perfil), Ação (Acesso a Lâmina, Upload WSI, Emissão de Laudo), Endereço IP, Status de Conformidade LGPD (Badge Verde "Auditado").

Make all screens look cohesive, hyper-professional, responsive, and visually stunning.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://dataverse-scope.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/49b3aabc-c01d-4780-9da5-8a8670ccdefd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
