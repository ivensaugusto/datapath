#!/bin/bash
# ════════════════════════════════════════════════════════════════════
# dataPATH — Script para gerar EF Core Migrations via Docker
# Uso: ./scripts/ef-migration.sh <MigrationName>
# Exemplo: ./scripts/ef-migration.sh InitialCreate
# ════════════════════════════════════════════════════════════════════

MIGRATION_NAME=${1:-"InitialCreate"}

echo "🔧 Gerando migration '$MIGRATION_NAME' via Docker SDK..."

docker run --rm \
    -v "$(pwd):/src" \
    -w /src \
    mcr.microsoft.com/dotnet/sdk:8.0 \
    bash -c "
        dotnet tool install --global dotnet-ef --version 8.0.12 && \
        export PATH=\"\$PATH:/root/.dotnet/tools\" && \
        dotnet ef migrations add $MIGRATION_NAME \
            --project src/DataPath.Infrastructure/DataPath.Infrastructure.csproj \
            --startup-project src/DataPath.Api/DataPath.Api.csproj \
            --output-dir Persistence/Migrations \
            --verbose
    "

echo "✅ Migration '$MIGRATION_NAME' gerada com sucesso!"
