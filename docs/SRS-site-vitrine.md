# Especificação de Requisitos de Software (SRS)
## Site Vitrine DigiPath — Plataforma de Patologia Digital

### 1. Introdução

#### 1.1 Propósito
Este documento define os requisitos de software para o desenvolvimento do **Site Vitrine DigiPath**, um portal institucional de caráter público focado na divulgação, transparência e compartilhamento de informações do projeto DigiPath (Plataforma de Patologia Digital). O objetivo é fornecer uma referência clara e abrangente para a implementação do site.

#### 1.2 Escopo
O site será um projeto estático separado (localizado no diretório `site/` do repositório) construído com React, atuando como a vitrine pública (landing page e blog) do projeto. Ele dividirá o domínio principal com a aplicação core (o sistema dataPATH Mini-PACS). Enquanto o site será hospedado na raiz do domínio (`/`), o sistema será movido para o subdiretório `/sistema`.

#### 1.3 Referências
*   **Modelo de Inspiração**: [PADTech UFES](https://pad.ufes.br/padtech/) (referência de layout institucional e blog acadêmico).
*   **Instagram Oficial**: @projetodigipath (fonte de conteúdo e identidade visual).
*   **Sistema dataPATH**: Mini-PACS em desenvolvimento paralelo.

---

### 2. Descrição Geral

#### 2.1 Perspectiva do Produto
O site substitui a necessidade de um CMS complexo neste primeiro momento, optando por uma abordagem estática (dados em JSON) com React para garantir altíssima performance, baixo custo de hospedagem e compartilhamento de stack tecnológica com o sistema principal.

#### 2.2 Funções do Produto
*   Apresentação institucional do projeto (história, parceiros, infraestrutura).
*   Exibição de notícias e atualizações (blog) via dados estáticos.
*   Galeria de lâminas (portfólio de patologia digital) com filtros.
*   Ponto de entrada (redirecionamento) para o sistema dataPATH.

#### 2.3 Público-Alvo
*   Pesquisadores e comunidade acadêmica.
*   Profissionais de saúde (patologistas, oncologistas).
*   Pacientes e público geral buscando informações sobre o projeto.
*   Órgãos de fomento e parceiros institucionais.

---

### 3. Requisitos Funcionais

#### 3.1 Menu de Navegação (Navbar)
*   **RF01**: O menu deve ser fixo (sticky) no topo da página.
*   **RF02**: A navbar deve conter o logo "digiPATH fundo branco" à esquerda.
*   **RF03**: A navbar deve conter links para as 4 seções principais:
    *   Sobre
    *   dataPATH (Galeria)
    *   Notícias
    *   Serviço (Acesso ao Sistema)
*   **RF04**: No mobile, o menu deve colapsar em um ícone de hambúrguer.

#### 3.2 Página Inicial (Home)
*   **RF05**: Deve exibir um *Hero Banner* com o título "DigiPath — Patologia Digital & Inovação Oncológica" e o logo "digiPATH fundo lilás" centralizado.
*   **RF06**: Deve conter uma seção de "Métricas de Impacto" exibindo números (ex: lâminas digitalizadas, parceiros, pesquisadores).
*   **RF07**: Deve conter um bloco de texto "O que é o DigiPath?" resumindo a iniciativa.
*   **RF08**: Deve exibir 3 *cards* com as notícias mais recentes.
*   **RF09**: Deve conter uma barra visual com os logos dos parceiros (UFES, AFECC, FAPES, CNPq).
*   **RF10**: Deve conter botões *Call-to-Action* (CTA): "Acessar dataPATH" e "Solicitar Digitalização".

#### 3.3 Página "Sobre"
*   **RF11**: Deve detalhar a parceria institucional entre a UFES (PPGBiotec) e a AFECC (Hospital Santa Rita de Cássia).
*   **RF12**: Deve exibir placeholders/mockups para fotos do laboratório e equipamentos (Scanner 3DHISTECH Pannoramic, Real Time 7500 PCR). Não devem ser exibidas fotos de pessoas.
*   **RF13**: Deve explicitar a missão do projeto: "democratizar o acesso à patologia digital no SUS".
*   **RF14**: Deve conter uma seção sobre governança, detalhando a conformidade com a LGPD e o CEP (Comitê de Ética em Pesquisa).

#### 3.4 Página "dataPATH" (Galeria de Lâminas)
*   **RF15**: Deve exibir um grid responsivo com miniaturas de lâminas histopatológicas geradas de forma estática.
*   **RF16**: O componente de miniatura pode reaproveitar a lógica `SlideThumb.tsx` do sistema principal (geração procedural/SVG) ou usar imagens estáticas.
*   **RF17**: Cada card de miniatura deve exibir metadados: coloração, órgão de origem e código anonimizado.
*   **RF18**: Deve fornecer um filtro funcional por tipo de coloração (HE, Ki-67, HER2, PAS, Giemsa).
*   **RF19**: A arquitetura do componente deve prever fácil substituição da fonte de dados estática para uma API futura (ex: buscando do QNAP).

#### 3.5 Página "Notícias" (Blog)
*   **RF20**: Deve renderizar uma lista/feed cronológico baseado no arquivo `data/news.json`.
*   **RF21**: Os *cards* de notícia devem conter: miniatura, título, data, resumo e tag de categoria.
*   **RF22**: As categorias suportadas devem ser: Tecnologia, Pesquisa, Eventos, Editais.
*   **RF23**: A estrutura de carregamento (fetch) deve ser isolada em um serviço para facilitar futura integração com uma API REST ou Headless CMS.

#### 3.6 Botão "Serviço" (Acesso ao Sistema)
*   **RF24**: Na navbar ou no menu, o link "Serviço" deve redirecionar o usuário para o sistema Mini-PACS.
*   **RF25**: O link deve abrir em nova aba apontando para `https://datapath.produtoweb.com.br/sistema`.

---

### 4. Requisitos Não-Funcionais

*   **RNF01 - Responsividade**: A interface deve seguir a abordagem *mobile-first*, adaptando-se perfeitamente a smartphones, tablets e desktops.
*   **RNF02 - Performance**: O site deve ter carregamento rápido, sem depender de banco de dados na renderização inicial (SSG/SPA leve).
*   **RNF03 - SEO**: O site deve conter as meta tags essenciais e configurações de Open Graph para boa indexação e compartilhamento em redes sociais.
*   **RNF04 - Acessibilidade**: Deve implementar atributos essenciais como `alt` em imagens, contraste adequado de cores e suporte à navegação por teclado (foco visível).
*   **RNF05 - Escalabilidade**: A arquitetura do frontend deve suportar a substituição de arquivos JSON estáticos por requisições de rede (API) no futuro.

---

### 5. Design System e Identidade Visual

#### 5.1 Paleta de Cores
*   **Cores Principais**: Tons lilás e roxo (extraídos dos logos).
*   **Cores de Apoio (herdadas do dataPATH)**: Sky-600 (`#0284c7`) e Teal-700 (`#0f766e`).
*   **Background Geral**: Slate-50 (`#f8fafc`).

#### 5.2 Tipografia e Bordas
*   **Fontes**: `system-ui` stack (nativa do sistema do usuário).
*   **Bordas**: `rounded-2xl` para elementos estruturais.
*   **Espaçamento**: Padding generoso em blocos (`p-6`, `p-8`).

#### 5.3 Componentes Visuais (Cards)
*   Estilo **Glass-card**: Fundo branco ou levemente translúcido, bordas muito sutis (ex: `border-slate-100`) e sombra suave (`shadow-sm` ou customizada).

#### 5.4 Utilização dos Logos
1.  **Selo Circular**: Utilizado como Favicon e no rodapé (Footer).
2.  **digiPATH fundo lilás**: Utilizado em destaque no Hero banner.
3.  **digiPATH fundo branco**: Utilizado na Navbar principal.
4.  **digiPATH neon/tech**: Utilizado em backgrounds ou seções de destaque tecnológico.
5.  **Circular tech completo**: Elementos decorativos esporádicos pela página.

---

### 6. Arquitetura do Projeto

#### 6.1 Stack Tecnológica
*   **Framework**: React 18
*   **Linguagem**: TypeScript
*   **Bundler**: Vite 8
*   **Estilização**: Tailwind CSS v4

#### 6.2 Estrutura de Diretórios
```text
site/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── components/
    │   ├── Navbar.tsx
    │   ├── Footer.tsx
    │   ├── HeroSection.tsx
    │   ├── NewsCard.tsx
    │   └── SlideGallery.tsx
    ├── pages/
    │   ├── HomePage.tsx
    │   ├── AboutPage.tsx
    │   ├── GalleryPage.tsx
    │   └── NewsPage.tsx
    ├── data/
    │   └── news.json
    └── assets/
        ├── logos/
        └── images/
```

---

### 7. Conteúdo Mockup (Base)

#### 7.1 Textos Institucionais (Home)
**Título (Hero):** "DigiPath — Patologia Digital & Inovação Oncológica"
**Texto sobre:** "O DigiPath é uma iniciativa conjunta que visa modernizar o fluxo de trabalho da anatomia patológica. Através da digitalização de lâminas histológicas e infraestrutura de ponta, buscamos democratizar o acesso ao diagnóstico preciso no SUS, unindo assistência médica, pesquisa avançada e inovação tecnológica."

#### 7.2 Mockups de Notícias (`news.json`)
O arquivo deverá ser inicializado com as seguintes postagens fictícias:
1.  **Lançamento oficial da plataforma dataPATH no Hospital Santa Rita** (Categoria: Tecnologia)
2.  **Parceria UFES-AFECC para avanço na patologia digital** (Categoria: Eventos)
3.  **Aprovação no edital FAPES de Extensão Tecnológica** (Categoria: Editais)
4.  **Workshop de escaneamento de lâminas para estudantes e residentes** (Categoria: Eventos)
5.  **Consórcio internacional HEADSpAcE — pesquisa em câncer de cabeça e pescoço** (Categoria: Pesquisa)
6.  **Campanha Outubro Rosa e o papel crucial do diagnóstico digital** (Categoria: Eventos)

---

### 8. Plano de Deploy e Integração

#### 8.1 Cenário de Hospedagem
Ambos os projetos (Site Vitrine e Sistema dataPATH) coexistirão no mesmo servidor (Hetzner / Portainer).

#### 8.2 Roteamento de Domínio (`datapath.produtoweb.com.br`)
*   As requisições para a raiz do domínio (`/`) deverão ser roteadas (via proxy reverso, como Nginx ou Traefik) para o contêiner/pasta do **Site Vitrine**.
*   As requisições para a rota `/sistema` deverão ser repassadas para o frontend da aplicação **dataPATH Mini-PACS**.

#### 8.3 Integrações Futuras
A organização do site deve permitir que componentes como o `SlideGallery.tsx` e o serviço de notícias sejam facilmente conectados às APIs do backend Node.js do sistema principal quando estas estiverem expostas.
