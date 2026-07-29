# 🏛️ Diagramas de Arquitetura & Fluxo de Dados — dataPATH

Visualização gráfica das camadas, componentes, bancos de dados e fluxos operacionais da plataforma **dataPATH**.

---

## 1. Diagrama de Contexto do Sistema (C4 Level 1)

O mapa de contexto a seguir ilustra a interação entre os diferentes atores (Técnicos, Médicos Patologistas, Pesquisadores) e o ecossistema de infraestrutura do dataPATH:

```mermaid
graph TD
    subgraph Usuários do Sistema
        A["🔬 Técnico de Laboratório"]
        B["👨‍⚕️ Patologista Consultor"]
        C["🎓 Pesquisador / Parceiro"]
        D["⚙️ Administrador de TI"]
    end

    subgraph Plataforma dataPATH (Hetzner Cloud)
        E["🌐 Frontend React (Nginx Proxy / SSL)"]
        F["⚡ Backend C# .NET 8 Web API"]
        G["🗄️ Banco PostgreSQL 16"]
        H["💾 Armazenamento Local / NAS QNAP"]
    end

    subgraph Serviços Externos
        I["🔒 Portainer Server (Hetzner PAC)"]
        J["🛡️ Let's Encrypt (ACME SSL)"]
    end

    A -->|"Upload de WSI & Anamnese"| E
    B -->|"Análise WSI & Emissão de Laudos"| E
    C -->|"Solicitação de Onboarding"| E
    D -->|"Governança & Auditoria"| E

    E -->|"Requisições REST / Bearer JWT"| F
    F -->|"Persistência de Dados & Logs"| G
    F -->|"Armazenamento de Arquivos WSI"| H
    I -->|"Automação de Deploy & Exec API"| E
    J -->|"Renovação Automática de Certificado SSL"| E
```

---

## 2. Arquitetura de Containers (C4 Level 2)

Visão interna dos containers Docker orquestrados via `docker-compose.prod.yml`:

```mermaid
graph LR
    subgraph Redes Docker Prod
        subgraph Frontend Layer
            Nginx["Container Nginx Proxy / Dist Státicos<br/>Porta 80 / 443"]
        end

        subgraph Application Layer
            DotNetAPI["Container DataPath.Api (.NET 8)<br/>Porta 5000"]
        end

        subgraph Database Layer
            Postgres["Container PostgreSQL 16<br/>Porta 5432 (Volume Local)"]
        end
    end

    Client["💻 Navegador Web Client"] -->|HTTPS / WSS| Nginx
    Nginx -->|Proxy Pass /api| DotNetAPI
    DotNetAPI -->|EF Core 8 / Npgsql| Postgres
```

---

## 3. Diagrama de Entidade e Relacionamento (ERD - Banco de Dados)

Modelo relacional simplificado do PostgreSQL:

```mermaid
erDiagram
    USERS ||--o{ BIOPSY_CASES : "cadastra"
    BIOPSY_CASES ||--o{ SLIDE_FILES : "contém"
    BIOPSY_CASES ||--o{ CLINICAL_OPINIONS : "recebe"
    USERS ||--o{ AUDIT_LOGS : "gera"
    EQUIPMENT_ACCESS_REQUESTS ||--o{ BIOPSY_CASES : "origina"

    USERS {
        uuid id PK
        string full_name
        string email
        string password_hash
        string role
        string crm_or_crbio
    }

    BIOPSY_CASES {
        uuid id PK
        string internal_case_code
        string organ_site
        string staining_type
        string clinical_summary
        string status
        dateTime created_at
    }

    SLIDE_FILES {
        uuid id PK
        uuid biopsy_case_id FK
        string file_name
        bigint file_size_bytes
        string storage_path
        string stain
    }

    CLINICAL_OPINIONS {
        uuid id PK
        uuid biopsy_case_id FK
        uuid doctor_id FK
        string diagnostic_impression
        string microscopic_description
        string icd_code
        dateTime signed_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        string action
        string resource_accessed
        string ip_address
        dateTime timestamp_utc
    }
```

---

## 4. Fluxo Sequencial de Entrada de Casos e 2ª Opinião Remota

```mermaid
sequenceDiagram
    autonumber
    actor T as Técnico Lab
    actor P as Patologista
    participant FE as Frontend React
    participant API as .NET 8 Web API
    participant DB as PostgreSQL
    participant NAS as Local Storage / NAS

    T->>FE: Cadastra Anamnese e Anexa Lâmina WSI
    FE->>API: POST /api/cases (Metadados Anonimizados)
    API->>DB: Salva BiopsyCase com status 'Pending'
    FE->>API: POST /api/cases/{id}/slides (Upload WSI)
    API->>NAS: Salva arquivo gigapixel (.svs / .tif)
    API->>DB: Registra SlideFile e dispara AuditLog

    P->>FE: Acessa Caso Pendente e Abre WSI Viewer
    FE->>API: GET /api/cases/{id}
    API->>DB: Grava Log de Acesso LGPD (AuditLogMiddleware)
    P->>FE: Preenche Parecer e Clica em Assinar Laudo
    FE->>API: POST /api/cases/{id}/opinion
    API->>DB: Altera status para 'Laudado' e salva ClinicalOpinion
    API-->>FE: Retorna confirmação e gera Laudo em PDF
```
