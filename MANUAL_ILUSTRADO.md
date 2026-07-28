# 📖 Manual de Utilização do Sistema dataPATH — Versão Ilustrada

Plataforma de Patologia Digital Mini-PACS para Compartilhamento Seguro de WSI e 2ª Opinião Remota.

---

## 📸 Capturas de Tela e Fluxos do Sistema

### 1. Tela de Autenticação e Seleção de Perfil (Login)
![Tela de Login do dataPATH](C:/Users/ivens/OneDrive/Desktop/_Algoritimos/DataPath/Sistema/docs/images/login_page_mockup_1785263078901.png)

> **Instruções de Acesso**:
> - Escolha um dos perfis pré-configurados no ambiente de desenvolvimento: **Técnico Lab**, **Patologista** ou **Admin**.
> - Senha padrão de teste: `DataPath@2026`.

---

### 2. Dashboard de Casos Histopatológicos
![Dashboard do dataPATH](C:/Users/ivens/OneDrive/Desktop/_Algoritimos/DataPath/Sistema/docs/images/dashboard_page_mockup_1785263091565.png)

> **Recursos do Dashboard**:
> - **Métricas em Tempo Real**: Total de casos, Pendentes, Em Revisão e Laudados.
> - **Filtros Rápidos**: Busca livre por código/anamnese e filtro suspenso por Órgão e Status.
> - **Tabela de Biópsias**: Exibição dos códigos pseudonimizados (LGPD) e acionamento por um clique.

---

### 3. Visualizador WSI (Gigapixel) e Emissão de Parecer Técnico
![Visualizador WSI e Parecer Médico](C:/Users/ivens/OneDrive/Desktop/_Algoritimos/DataPath/Sistema/docs/images/case_detail_page_mockup_1785263102857.png)

> **Ferramentas do Patologista**:
> - **Estágio WSI Interativo**: Navegação por *pan* e ajuste de zoom (10x a 40x).
> - **Formulário de Segunda Opinião**: Registro da impressão diagnóstica e observações microscópicas.
> - **Assinatura Digital**: Finalização e mudança de status para 🟢 *Laudado*.

---

### 4. Painel de Governança e Auditoria LGPD
![Trilha de Auditoria LGPD](C:/Users/ivens/OneDrive/Desktop/_Algoritimos/DataPath/Sistema/docs/images/audit_logs_page_mockup_1785263114076.png)

> **Segurança e Conformidade**:
> - **Trilha Imutável**: Auditoria completa de requisições às rotas médicas.
> - **Dados Registrados**: Timestamp UTC, Ação (`READ`/`CREATE`/`UPDATE`), Entidade, Usuário e IP de origem.

---

## 📄 Gerar PDF do Manual
Para exportar a versão impressa em PDF com alta definição:
1. Abra o arquivo `docs/manual-impresso.html` no seu navegador (Chrome/Edge).
2. Pressione `Ctrl + P` (Imprimir) e selecione a opção **"Salvar como PDF"**.
