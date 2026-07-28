# ════════════════════════════════════════════════════════════════════
# dataPATH API — Multi-stage Dockerfile (.NET 8)
# ════════════════════════════════════════════════════════════════════

# ── Stage 1: Restore + Build ──────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY src/DataPath.Core/DataPath.Core.csproj src/DataPath.Core/
COPY src/DataPath.Infrastructure/DataPath.Infrastructure.csproj src/DataPath.Infrastructure/
COPY src/DataPath.Api/DataPath.Api.csproj src/DataPath.Api/
COPY DataPath.sln ./
RUN dotnet restore DataPath.sln

COPY . .
RUN dotnet publish DataPath.sln -c Release -o /app/publish /p:UseAppHost=false

# ── Stage 2: Runtime ──────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Criar diretório de storage local
RUN mkdir -p /app/storage

COPY --from=build /app/publish .

# Porta da API
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

ENTRYPOINT ["dotnet", "DataPath.Api.dll"]
