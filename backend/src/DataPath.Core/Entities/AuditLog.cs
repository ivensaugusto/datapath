namespace DataPath.Core.Entities;

/// <summary>
/// Registro de auditoria — conformidade LGPD.
/// Todo acesso a dados clínicos e arquivos é registrado aqui.
/// Campos obrigatórios: Quem (UserId), O quê (Action/EntityName), 
/// Quando (Timestamp) e De onde (IpAddress).
/// </summary>
public class AuditLog
{
    public Guid Id { get; set; }

    /// <summary>
    /// Ação realizada (ex: "READ", "CREATE", "UPDATE", "DELETE", "DOWNLOAD").
    /// </summary>
    public string Action { get; set; } = string.Empty;

    /// <summary>
    /// Nome da entidade acessada (ex: "BiopsyCase", "SlideFile").
    /// </summary>
    public string EntityName { get; set; } = string.Empty;

    /// <summary>
    /// ID da entidade acessada.
    /// </summary>
    public string? EntityId { get; set; }

    /// <summary>
    /// Detalhes adicionais da ação (ex: campos alterados, motivo).
    /// </summary>
    public string? Details { get; set; }

    /// <summary>
    /// Endereço IP de origem da requisição.
    /// </summary>
    public string IpAddress { get; set; } = string.Empty;

    /// <summary>
    /// User-Agent do navegador/cliente.
    /// </summary>
    public string? UserAgent { get; set; }

    /// <summary>
    /// Carimbo de tempo UTC do evento.
    /// </summary>
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    // ── Chaves estrangeiras ──────────────────────────────────────
    /// <summary>
    /// Usuário que realizou a ação. Null para ações de sistema.
    /// </summary>
    public Guid? UserId { get; set; }
    public User? User { get; set; }
}
