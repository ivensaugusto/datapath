using DataPath.Core.Enums;

namespace DataPath.Core.Entities;

/// <summary>
/// Instituição parceira (Inquilino / Tenant) no modelo Multi-Tenant.
/// </summary>
public class PartnerInstitution
{
    public Guid Id { get; set; }

    /// <summary>
    /// Razão social ou Nome da instituição.
    /// </summary>
    public string CorporateName { get; set; } = string.Empty;

    /// <summary>
    /// Nome fantasia ou sigla do departamento/laboratório.
    /// </summary>
    public string TradeName { get; set; } = string.Empty;

    /// <summary>
    /// CNPJ ou CPF do responsável/entidade.
    /// </summary>
    public string DocumentNumber { get; set; } = string.Empty;

    /// <summary>
    /// E-mail principal de contato/notificação.
    /// </summary>
    public string ContactEmail { get; set; } = string.Empty;

    /// <summary>
    /// Telefone de contato.
    /// </summary>
    public string ContactPhone { get; set; } = string.Empty;

    /// <summary>
    /// Tipo da instituição (Pesquisa Acadêmica, Laboratório Clínico, Hospital, Patologista Autônomo).
    /// </summary>
    public PartnerInstitutionType Type { get; set; } = PartnerInstitutionType.AcademicResearch;

    /// <summary>
    /// Se a instituição está ativa.
    /// </summary>
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // ── Navegação ────────────────────────────────────────────────
    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<BiopsyCase> BiopsyCases { get; set; } = new List<BiopsyCase>();
    public ICollection<DigitizationOrder> DigitizationOrders { get; set; } = new List<DigitizationOrder>();
    public ICollection<SlideFolder> SlideFolders { get; set; } = new List<SlideFolder>();
}
