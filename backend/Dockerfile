# ════════════════════════════════════════════════════════════════════
# dataPATH API — Multi-stage Dockerfile (.NET 8)
# ════════════════════════════════════════════════════════════════════

# ── Stage 1: Restore + Build ──────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore src/DataPath.Api/DataPath.Api.csproj
RUN dotnet publish src/DataPath.Api/DataPath.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

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
