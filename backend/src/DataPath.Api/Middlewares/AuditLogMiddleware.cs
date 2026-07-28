using System.Security.Claims;
using DataPath.Core.Entities;
using DataPath.Infrastructure.Persistence;

namespace DataPath.Api.Middlewares;

/// <summary>
/// Middleware de auditoria LGPD.
/// Registra no banco todo acesso a rotas clínicas (/api/cases, /api/files, /api/opinions).
/// Captura: Quem (UserId), O quê (Rota + Método), Quando (UTC), De onde (IP + UserAgent).
/// </summary>
public class AuditLogMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<AuditLogMiddleware> _logger;

    // Rotas que devem ser auditadas (prefixos)
    private static readonly string[] AuditedPrefixes =
    {
        "/api/cases",
        "/api/files",
        "/api/opinions",
        "/api/auth/me"
    };

    public AuditLogMiddleware(RequestDelegate next, ILogger<AuditLogMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Executar o request primeiro
        await _next(context);

        // Verificar se a rota deve ser auditada
        var path = context.Request.Path.Value?.ToLowerInvariant() ?? "";
        if (!ShouldAudit(path, context.Request.Method))
            return;

        try
        {
            // Extrair dados do contexto
            var userId = ExtractUserId(context);
            var ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var userAgent = context.Request.Headers.UserAgent.ToString();
            var method = context.Request.Method;
            var statusCode = context.Response.StatusCode;

            // Determinar a ação baseada no método HTTP
            var action = method switch
            {
                "GET" => "READ",
                "POST" => "CREATE",
                "PUT" or "PATCH" => "UPDATE",
                "DELETE" => "DELETE",
                _ => method
            };

            // Extrair nome da entidade e ID da rota
            var (entityName, entityId) = ExtractEntityInfo(path);

            // Salvar no banco via escopo DI
            using var scope = context.RequestServices.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DataPathDbContext>();

            var auditLog = new AuditLog
            {
                Action = action,
                EntityName = entityName,
                EntityId = entityId,
                Details = $"{method} {path} → {statusCode}",
                IpAddress = ipAddress,
                UserAgent = userAgent?.Length > 500 ? userAgent[..500] : userAgent,
                Timestamp = DateTime.UtcNow,
                UserId = userId
            };

            db.AuditLogs.Add(auditLog);
            await db.SaveChangesAsync();

            _logger.LogDebug("📋 Audit: {Action} {Entity} [{EntityId}] by {UserId} from {IP}",
                action, entityName, entityId ?? "N/A", userId?.ToString() ?? "anonymous", ipAddress);
        }
        catch (Exception ex)
        {
            // Auditoria nunca deve quebrar o fluxo principal
            _logger.LogError(ex, "Erro ao registrar auditoria para {Path}", path);
        }
    }

    private static bool ShouldAudit(string path, string method)
    {
        // Não auditar preflight CORS
        if (method == "OPTIONS") return false;

        return AuditedPrefixes.Any(prefix => path.StartsWith(prefix, StringComparison.OrdinalIgnoreCase));
    }

    private static Guid? ExtractUserId(HttpContext context)
    {
        var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? context.User.FindFirst("sub")?.Value;

        return Guid.TryParse(userIdClaim, out var id) ? id : null;
    }

    private static (string EntityName, string? EntityId) ExtractEntityInfo(string path)
    {
        var segments = path.Split('/', StringSplitOptions.RemoveEmptyEntries);

        // /api/cases/{id} → ("BiopsyCase", id)
        // /api/files/{id} → ("SlideFile", id)
        // /api/opinions/{id} → ("ClinicalOpinion", id)
        var entityName = segments.Length >= 2 ? segments[1] switch
        {
            "cases" => "BiopsyCase",
            "files" => "SlideFile",
            "opinions" => "ClinicalOpinion",
            "auth" => "User",
            _ => segments[1]
        } : "Unknown";

        var entityId = segments.Length >= 3 && Guid.TryParse(segments[2], out _)
            ? segments[2]
            : null;

        return (entityName, entityId);
    }
}

/// <summary>
/// Extension method para registrar o middleware no pipeline.
/// </summary>
public static class AuditLogMiddlewareExtensions
{
    public static IApplicationBuilder UseAuditLog(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<AuditLogMiddleware>();
    }
}
