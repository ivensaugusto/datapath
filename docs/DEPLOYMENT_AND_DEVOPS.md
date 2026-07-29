# 🚀 Guia de DevOps, Infraestrutura & Deploy — dataPATH

Manual operacional de implantação, infraestrutura Docker, SSL/TLS e automação de deploys para a plataforma **dataPATH**.

---

## 🌐 1. Topologia da Infraestrutura de Produção

A infraestrutura é hospedada no provedor **Hetzner Cloud** e gerenciada pelo servidor **Portainer (PAC)**:

- **Domínio Público da Aplicação:** `https://datapath.produtoweb.com.br`
- **Servidor Portainer (PAC):** `https://pac.produtoweb.com.br`
- **Stack Name:** `app-datapath` (Endpoint ID: `3` - `local`)
- **Container Frontend/Nginx:** `/datapath-app`
- **Container Banco de Dados:** `/datapath-db` (PostgreSQL 16)
- **Proxy Reverso Global:** `/nginx-proxy` com ACME Companion (Let's Encrypt SSL)

---

## 🛠️ 2. Estrutura Docker (`docker-compose.prod.yml`)

A aplicação utiliza compilação em múltiplos estágios (**Multi-stage Build**) para garantir imagens leves e seguras:

- **Estágio 1 (Node 20):** Compila o frontend React / Vite em `dist/`.
- **Estágio 2 (.NET 8 SDK):** Compila o código C# da API REST em modo `Release`.
- **Estágio 3 (Nginx Alpine):** Serve os arquivos estáticos do frontend e atua como proxy reverso interno repassando requisições `/api` para a porta 5000 do container .NET.

---

## ⚡ 3. Automação de Deploys (Sem GitHub Actions)

Em conformidade com a decisão de arquitetura do projeto, os deploys são realizados via scripts automatizados em PowerShell utilizando a API do Portainer:

### 3.1 Hot-Deploy Instantâneo do Frontend (Sem Downtime)
Quando houver alterações exclusivamente na interface React (`frontend/src/`):

1. Execute o script via PowerShell na raiz do projeto:
   ```powershell
   powershell -ExecutionPolicy Bypass -File "scratch/hot_deploy_exec.ps1"
   ```
2. **Funcionamento Interno:**
   - Compila o bundle React (`npm run build`).
   - Empacota os arquivos compilados em um arquivo `.tar.gz` e converte para carga útil Base64.
   - Autentica na API do Portainer (`/api/auth`) e localiza o container ativo `/datapath-app`.
   - Injeta a carga útil diretamente em `/usr/share/nginx/html` e executa o comando `nginx -s reload`.
   - **Resultado:** A nova versão da interface entra no ar em ~10 segundos sem reiniciar o container e sem queda na API C#.

### 3.2 Redeploy Completo da Stack (Backend / Migrations)
Quando houver alterações no C#, banco de dados ou estrutura Docker:

1. Faça commit e push das alterações para o GitHub:
   ```bash
   git add .
   git commit -m "feat: nova funcionalidade"
   git push origin master
   ```
2. Execute o script de redeploy da stack:
   ```powershell
   powershell -ExecutionPolicy Bypass -File "scratch/portainer_deploy.ps1"
   ```

---

## 🔒 4. Gestão de Certificados SSL/TLS

O certificado digital SSL é emitido e renovado automaticamente pela Autoridade Certificadora **Let's Encrypt** via container `acme-companion` integrado ao Nginx Proxy. Não é necessária nenhuma intervenção manual.
