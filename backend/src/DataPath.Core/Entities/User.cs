using DataPath.Core.Enums;

namespace DataPath.Core.Entities;

/// <summary>
/// Usuário do sistema dataPATH.
/// Suporta RBAC com perfis: LabOperator, SpecialistDoctor, Admin.
/// </summary>
public class User
{
    public Guid Id { get; set; }

    /// <summary>
    /// Nome completo do profissional.
    /// </summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>
    /// E-mail utilizado como login.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Hash da senha (BCrypt/Argon2).
    /// </summary>
    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>
    /// Perfil de acesso RBAC.
    /// </summary>
    public UserRole Role { get; set; }

    /// <summary>
    /// Registro profissional (CRM, CRBM, etc).
    /// </summary>
    public string? ProfessionalRegistration { get; set; }

    /// <summary>
    /// Especialidade médica (ex: "Patologia", "Dermatopatologia").
    /// </summary>
    public string? Specialty { get; set; }

    /// <summary>
    /// Se o usuário está ativo no sistema.
    /// </summary>
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }

    // ── Navegação ────────────────────────────────────────────────
    /// <summary>
    /// Casos criados por este operador (LabOperator).
    /// </summary>
    public ICollection<BiopsyCase> CreatedCases { get; set; } = new List<BiopsyCase>();

    /// <summary>
    /// Pareceres emitidos por este especialista (SpecialistDoctor).
    /// </summary>
    public ICollection<ClinicalOpinion> IssuedOpinions { get; set; } = new List<ClinicalOpinion>();

    /// <summary>
    /// Registros de auditoria deste usuário.
    /// </summary>
    public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
}
