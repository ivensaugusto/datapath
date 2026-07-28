using DataPath.Core.Enums;

namespace DataPath.Core.Entities;

/// <summary>
/// Pasta de Acervo e Políticas de Retenção de Lâminas WSI.
/// </summary>
public class SlideFolder
{
    public Guid Id { get; set; }

    /// <summary>
    /// Nome da pasta de acervo.
    /// </summary>
    public string FolderName { get; set; } = string.Empty;

    /// <summary>
    /// Usuário proprietário do acervo.
    /// </summary>
    public Guid OwnerUserId { get; set; }
    public User OwnerUser { get; set; } = null!;

    /// <summary>
    /// Tenant/Instituição parceira vinculada.
    /// </summary>
    public Guid? PartnerInstitutionId { get; set; }
    public PartnerInstitution? PartnerInstitution { get; set; }

    /// <summary>
    /// Política de armazenamento (Privada Temporária, Privada Persistente, Repositório Público).
    /// </summary>
    public StoragePolicyType Policy { get; set; } = StoragePolicyType.PrivateTemporary;

    /// <summary>
    /// Dias de retenção antes do expurgo (quando Policy == PrivateTemporary).
    /// </summary>
    public int? RetentionDays { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Data de expiração calculada (quando Policy == PrivateTemporary).
    /// </summary>
    public DateTime? ExpiresAt { get; set; }

    /// <summary>
    /// Token único para Magic Link de visualização/compartilhamento sem login.
    /// </summary>
    public string ShareToken { get; set; } = Guid.NewGuid().ToString("N");

    // ── Navegação ────────────────────────────────────────────────
    public ICollection<BiopsyCase> BiopsyCases { get; set; } = new List<BiopsyCase>();
    public ICollection<SlideFile> SlideFiles { get; set; } = new List<SlideFile>();
}
