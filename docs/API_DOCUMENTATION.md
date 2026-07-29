# 📡 Especificação da API REST — dataPATH (v2.0)

Documentação oficial dos endpoints RESTful desenvolvidos em **C# / .NET 8 (ASP.NET Core Web API)** para a plataforma **dataPATH**.

---

## 🔒 1. Autenticação e Segurança

A API utiliza autenticação baseada em **Bearer Tokens JWT (JSON Web Tokens)**. O token deve ser enviado no cabeçalho HTTP de cada requisição protegida:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔑 Endpoints de Autenticação (`/api/auth`)

### 1.1 Efetuar Login
- **URL:** `POST /api/auth/login`
- **Acesso:** Público
- **Corpo da Requisição (JSON):**
```json
{
  "email": "carlos.mendes@datapath.local",
  "password": "DataPath@2026"
}
```
- **Resposta Sucesso (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": {
    "id": "usr-88a9-11ef",
    "name": "Dr. Carlos Mendes",
    "email": "carlos.mendes@datapath.local",
    "role": "SpecialistDoctor",
    "crmOrCrbio": "CRM-SP 148920"
  }
}
```

---

## 🔬 Endpoints de Casos Clínicos (`/api/cases`)

### 2.1 Listar Casos Clínicos
- **URL:** `GET /api/cases`
- **Acesso:** Autenticado (`LabOperator`, `SpecialistDoctor`, `Admin`)
- **Parâmetros Query:**
  - `search` (opcional): Filtro textual por código do caso ou síntese anamnéstica.
  - `organSite` (opcional): Ex: `Próstata`, `Mama`, `Pele`, `Pulmão`, `Tiróide`.
  - `status` (opcional): `Pending`, `InReview`, `Laudado`, `ReadyForArchive`.
  - `page` (padrão: 1): Número da página.
  - `pageSize` (padrão: 10): Itens por página.
- **Resposta Sucesso (200 OK):**
```json
{
  "items": [
    {
      "id": "case-902-abc",
      "internalCaseCode": "DP-2026-0089",
      "organSite": "Próstata",
      "stainingType": "HE",
      "status": "Pending",
      "slideCount": 2,
      "createdAt": "2026-07-29T18:00:00Z"
    }
  ],
  "totalItems": 45,
  "page": 1,
  "totalPages": 5
}
```

### 2.2 Obter Detalhes do Caso
- **URL:** `GET /api/cases/{id}`
- **Acesso:** Autenticado
- **Resposta Sucesso (200 OK):** Retorna o objeto `BiopsyCase` completo com anamnese, histórico de alterações e lista de lâminas WSI vinculadas.

### 2.3 Cadastrar Novo Caso Bióptico
- **URL:** `POST /api/cases`
- **Acesso:** `LabOperator`, `Admin`
- **Corpo da Requisição (JSON):**
```json
{
  "organSite": "Mama",
  "stainingType": "Imuno-histoquímica",
  "clinicalSummary": "Nódulo no quadrante superior externo da mama esquerda. Suspeita de carcinoma ductal invasivo.",
  "patientBiologicalSex": "F",
  "patientAgeAtBiopsy": 52
}
```
- **Resposta Sucesso (201 Created):** Retorna o caso gerado com o código pseudonimizado (ex: `DP-2026-0090`).

### 2.4 Upload de Lâmina Gigapixel (WSI)
- **URL:** `POST /api/cases/{caseId}/slides`
- **Acesso:** `LabOperator`, `Admin`
- **Form-Data:** `file` (Arquivo binário `.svs`, `.tif`, `.ndpi`, `.mrxs`, `.jpg`, `.png`).
- **Resposta Sucesso (200 OK):**
```json
{
  "slideId": "sld-301-xyz",
  "fileName": "lamina_01_he.svs",
  "fileSizeBytes": 458920100,
  "stain": "HE",
  "uploadedAt": "2026-07-29T18:15:00Z"
}
```

### 2.5 Registrar Parecer Diagnóstico (2ª Opinião)
- **URL:** `POST /api/cases/{caseId}/opinion`
- **Acesso:** `SpecialistDoctor`, `Admin`
- **Corpo da Requisição (JSON):**
```json
{
  "diagnosticImpression": "Carcinoma Ductal Invasivo de Mama, SOE, Grau Histológico 2 (Nottingham: 3+2+1=6).",
  "microscopicDescription": "Proliferação neoplásica epitelial disposta em ninhos e cordões irregulares infiltrando o estroma fibromucinoso.",
  "icdCode": "C50.9",
  "histologicalGrade": "G2"
}
```
- **Resposta Sucesso (200 OK):** Altera o status do caso para `Laudado` e gera o documento oficial.

---

## 🤝 Endpoints de Onboarding de Parceiros (`/api/onboarding`)

### 3.1 Submeter Solicitação de Onboarding
- **URL:** `POST /api/onboarding`
- **Acesso:** Público (Form-Data)
- **Campos Form-Data:**
  - `fullName`: Nome completo do pesquisador responsável.
  - `email`: E-mail institucional.
  - `phone`: Telefone com DDD.
  - `institutionAndDepartment`: Instituição / Faculdade / Hospital.
  - `modality`: `IniciacaoCientifica`, `Mestrado`, `Doutorado`, `PosDoc`, `ParceiroClinico`.
  - `researchTitle`: Título do projeto de pesquisa.
  - `hasEthicsApproval`: `true` / `false`.
  - `requestScanner3DHistech`: `true` / `false`.
  - `requestPcrRealTime7500`: `true` / `false`.
  - `requestedStoragePolicy`: `PrivateTemporary` / `AcademicShare`.
  - `ethicsFiles` (opcional): Arquivos PDF da aprovação CEP/CEUA.

### 3.2 Listar Solicitações (Painel Gestor)
- **URL:** `GET /api/onboarding`
- **Acesso:** `Admin`, `LabOperator`
- **Parâmetros Query:** `status` (`Pending`, `Approved`, `Rejected`), `equipment` (`scanner`, `pcr`).

### 3.3 Aprovar Solicitação
- **URL:** `POST /api/onboarding/{id}/approve`
- **Acesso:** `Admin`
- **Corpo da Requisição (JSON):**
```json
{
  "reviewNotes": "Documentação CEP válida. Cotas aprovadas.",
  "expectedSlidesCount": 25
}
```

---

## 🛡️ Endpoints de Auditoria LGPD (`/api/audit-logs`)

### 4.1 Pesquisar Registros de Auditoria
- **URL:** `GET /api/audit-logs`
- **Acesso:** `Admin`
- **Parâmetros Query:** `searchTerm`, `userEmail`, `startDate`, `endDate`.
- **Resposta Sucesso (200 OK):** Retorna a lista imutável de eventos com timestamp UTC, IP do cliente, recurso acessado e usuário responsável.
