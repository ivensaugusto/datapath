# 📖 Manual de Utilização do Sistema — dataPATH

Plataforma de Patologia Digital & Mini-PACS para Compartilhamento Seguro de Lâminas Histopatológicas WSI e Emissão de Segundas Opiniões Remotas.

---

## 🎯 Visão Geral e Propósito

O **dataPATH** é um sistema médico do tipo **Mini-PACS** voltado para a **Patologia Digital**. Ele permite que laboratórios publiquem lâminas de biópsias digitalizadas em altíssima resolução (*Whole Slide Imaging - WSI*) para que médicos especialistas possam analisar os casos e emitir **segundas opiniões diagnósticas remotas** de forma ágil, segura e em rigorosa conformidade com a **LGPD (Lei nº 13.709/2018)**.

---

## 🔑 Credenciais e Perfis de Acesso para Testes (Ambiente Local)

| Perfil | E-mail de Acesso | Senha Padrão | Responsabilidades Principais |
|---|---|---|---|
| **Técnico de Laboratório** | `maria.silva@datapath.local` | `DataPath@2026` | Cadastro de biópsias e upload de lâminas WSI. |
| **Médico Patologista** | `carlos.mendes@datapath.local` | `DataPath@2026` | Análise visual WSI, emissão e assinatura de pareceres. |
| **Administrador** | `admin@datapath.local` | `DataPath@2026` | Gestão do sistema e auditoria de acessos LGPD. |

---

## 👩‍🔬 1. Manual do Técnico de Laboratório (`LabOperator`)

### 1.1 Efetuar Login
1. Acesse o sistema em `http://localhost:5173`.
2. Clique no botão de atalho **"👩‍🔬 Técnico Lab"** ou digite `maria.silva@datapath.local` e a senha `DataPath@2026`.
3. Clique em **"Entrar no Sistema"**.

### 1.2 Cadastrar Novo Caso Clínico e Anexar Lâmina WSI
1. No menu superior, clique em **"➕ Novo Caso"**.
2. Preencha os campos obrigatórios:
   - **Órgão / Sítio Anatômico**: Ex: *Pele, Mama, Próstata*.
   - **Tipo de Coloração**: Ex: *HE (Hematoxilina-Eosina)* ou *Imuno-histoquímica*.
   - **Resumo Clínico / Anamnese**: História clínica do paciente (não informe dados identificáveis como CPF ou Nome).
   - **Idade / Sexo Biológico**: Opcional para fins estatísticos.
3. No campo **"Arquivo de Lâmina WSI"**, clique na caixa para selecionar o arquivo digitalizado (ex: `.svs`, `.tif`, `.ndpi`, `.jpg`).
4. Clique em **"Cadastrar e Concluir"**. O sistema gerará automaticamente um código único pseudonimizado (ex: `DP-2026-0003`).

### 1.3 Acompanhar Status dos Casos
1. No **Dashboard**, você pode visualizar o status de cada biópsia:
   - 🟡 **Pendente**: Cadastrado, aguardando análise médica.
   - 🔵 **Em Revisão**: Patologista emitiu rascunho de parecer.
   - 🟢 **Laudado**: Parecer final assinado digitalmente pelo médico.

---

## 👨‍⚕️ 2. Manual do Médico Patologista / Especialista (`SpecialistDoctor`)

### 2.1 Efetuar Login
1. Na tela inicial, utilize o atalho **"👨‍⚕️ Patologista"** ou insira `carlos.mendes@datapath.local` e a senha `DataPath@2026`.

### 2.2 Consultar Casos Clínicos
1. No **Dashboard**, utilize a barra de busca ou os filtros rápidos por **Órgão** e **Status** para localizar a biópsia desejada.
2. Clique na linha do caso ou no botão **"Abrir Caso →"**.

### 2.3 Visualizar Lâminas WSI (Gigapixel)
1. Na página de detalhes do caso, localize o painel **"Lâminas WSI Vinculadas"**.
2. Clique no botão **"🔬 Visualizar"** ao lado da lâmina desejada.
3. Utilize os botões **[ + ]** e **[ - ]** para ajustar o **zoom (10x a 40x)** e navegue arrastando a lâmina.

### 2.4 Emitir e Assinar Parecer Técnico (2ª Opinião)
1. No formulário **"Emitir Novo Parecer Técnico"**, preencha:
   - **Impressão Diagnóstica**: Diagnóstico conclusivo ou hipótese principal (ex: *Carcinoma ductal invasivo*).
   - **Descrição Microscópica**: Achados histológicos relevantes.
   - **Observações Complementares**: Recomendações de exames adicionais (ex: painel IHQ).
   - **Prioridade**: *Normal*, *Urgente* ou *Crítica*.
2. Clique em **"Registrar Parecer"**.
3. Quando o parecer estiver finalizado, clique em **"🖋️ Assinar Digitalmente e Concluir Laudo"**. O status do caso será atualizado para 🟢 **Laudado**.
4. Clique em **"📄 Relatório de Segunda Opinião"** no topo da página para visualizar/imprimir o laudo em PDF.

---

## 👑 3. Manual do Administrador (`Admin`)

### 3.1 Acesso Total e Governança LGPD
1. Efetue login com o atalho **"👑 Admin"** (`admin@datapath.local`).
2. O perfil Admin tem acesso total a todas as funcionalidades de cadastro, emissão de pareceres e exclusão de registros.

### 3.2 Consultar Trilha de Auditoria LGPD
1. No menu superior, clique em **"🔒 Auditoria LGPD"**.
2. O painel exibirá o registro imutável de todas as ações executadas no sistema:
   - **Horário (UTC)**: Carimbo de tempo exato da operação.
   - **Ação**: `READ`, `CREATE`, `UPDATE` ou `DELETE`.
   - **Entidade**: Tabela ou arquivo acessado (`BiopsyCase`, `SlideFile`, `ClinicalOpinion`).
   - **Usuário**: Nome e e-mail de quem realizou o acesso.
   - **Endereço IP**: IP de origem do cliente para auditoria forense.

### 3.3 Rotinas Automáticas de Manutenção (Background Service)
- O sistema conta com uma rotina automatizada que roda em segundo plano a cada 24 horas para:
  1. Identificar casos laudados sem alteração há mais de 30 dias e atualizar para o status `ReadyForArchive`.
  2. Revogar automaticamente links de compartilhamento temporários expirados.

---

## 🔒 Compromisso com a Privacidade LGPD

- **Sem dados pessoais sensíveis expostos**: O sistema utiliza códigos anonimizados (`DP-YYYY-XXXX`).
- **Criptografia e Hashes de Integridade**: Cada arquivo WSI possui um hash SHA-256 único para garantia de não violação.
- **Links Temporários Assinados**: Os links de compartilhamento possuem chave criptográfica e expiram automaticamente.
