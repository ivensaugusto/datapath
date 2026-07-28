# Especificação Arquitetônica — Projeto dataPATH

## 1. Estrutura do Projeto (.NET 8 Clean Architecture Enxuta)
O back-end deve seguir separação de responsabilidades sem sobrecarga de camadas desnecessárias para um MVP:
- `DataPath.Api`: Controllers, Middlewares de Auditoria, Program.cs, Configurações DI.
- `DataPath.Core`: Entidades de Domínio, Interfaces (`IStorageProvider`), DTOs, Enums.
- `DataPath.Infrastructure`: Entity Framework Core (DbContext, Migrations), Serviços de Auth, Implementações de Storage (`LocalFileSystemDriver`, `QnapRestApiDriver`).

## 2. Padrão de Abstração de Armazenamento (Storage Strategy)
O back-end nunca deve acessar o sistema de arquivos diretamente nos Controllers. Todo tráfego de imagens WSI passa pela seguinte interface C#:

```csharp
public interface IStorageProvider
{
    Task<string> SaveFileAsync(Stream fileStream, string fileName, string folderPath);
    Task<string> GenerateTemporaryShareLinkAsync(string filePath, int expirationDays);
    Task<bool> RevokeShareLinkAsync(string filePath);
}
```

No arquivo `Program.cs`, o driver deve ser injetado dinamicamente via `appsettings.json`:

```csharp
var storageType = builder.Configuration["Storage:DriverType"]; // "Local" ou "Qnap"
if (storageType == "Local")
    builder.Services.AddScoped<IStorageProvider, LocalFileSystemDriver>();
else
    builder.Services.AddScoped<IStorageProvider, QnapRestApiDriver>();
```

## 3. Conformidade LGPD e Regras de Acesso
- A entidade `BiopsyCase` NÃO DEVE conter nomes de pacientes, CPF ou contatos diretos. Usar apenas `InternalCaseCode` (ex: "DP-2026-0089") e dados clínicos biológicos.
- Qualquer requisição para `GET /api/cases/{id}` deve obrigatoriamente passar pelo `AuditLogMiddleware`, registrando no banco quem leu o caso, o IP e em qual horário.

