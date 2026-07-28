# ════════════════════════════════════════════════════════════════════
# dataPATH — Script PowerShell para gerar EF Core Migrations via Docker
# Uso: .\scripts\ef-migration.ps1 -MigrationName "InitialCreate"
# ════════════════════════════════════════════════════════════════════

param(
    [string]$MigrationName = "InitialCreate"
)

Write-Host "🔧 Gerando migration '$MigrationName' via Docker SDK..." -ForegroundColor Cyan

$backendPath = (Get-Item $PSScriptRoot).Parent.FullName

docker run --rm `
    -v "${backendPath}:/src" `
    -w /src `
    mcr.microsoft.com/dotnet/sdk:8.0 `
    bash -c "
        dotnet tool install --global dotnet-ef --version 8.0.12 && 
        export PATH=`"`$PATH:/root/.dotnet/tools`" && 
        dotnet ef migrations add $MigrationName 
            --project src/DataPath.Infrastructure/DataPath.Infrastructure.csproj 
            --startup-project src/DataPath.Api/DataPath.Api.csproj 
            --output-dir Persistence/Migrations 
            --verbose
    "

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migration '$MigrationName' gerada com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao gerar migration. Verifique os logs acima." -ForegroundColor Red
}
