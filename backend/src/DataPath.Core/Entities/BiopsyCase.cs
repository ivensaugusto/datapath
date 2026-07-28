using DataPath.Core.Enums;

namespace DataPath.Core.Entities;

/// <summary>
/// Caso clínico de biópsia — entidade central do Mini-PACS.
/// LGPD: NÃO contém dados nominais do paciente (nome, CPF, contato).
/// Identificação exclusiva via InternalCaseCode (ex: "DP-2026-0089").
/// </summary>
public class BiopsyCase
{
    public Guid Id { get; set; }

    /// <summary>
    /// Código interno anonimizado do caso (ex: "DP-2026-0089").
    /// Gerado pelo sistema, sem vínculo direto com dados pessoais.
    /// </summary>
    public string InternalCaseCode { get; set; } = string.Empty;

    /// <summary>
    /// Órgão / sítio anatômico da biópsia (ex: "Pele", "Fígado", "Mama").
    /// </summary>
    public string OrganSite { get; set; } = string.Empty;

    /// <summary>
    /// Tipo de coloração da lâmina (ex: "HE", "Imuno-histoquímica", "PAS").
    /// </summary>
    public string StainingType { get; set; } = string.Empty;

    /// <summary>
    /// Resumo clínico anonimizado (anamnese sem dados pessoais).
    /// </summary>
    public string ClinicalSummary { get; set; } = string.Empty;

    /// <summary>
    /// Status atual do caso no fluxo de trabalho.
    /// </summary>
    public CaseStatus Status { get; set; } = CaseStatus.Pending;

    /// <summary>
    /// Sexo biológico do paciente (M/F/I — apenas dado clínico).
    /// </summary>
    public string? PatientBiologicalSex { get; set; }

    /// <summary>
    /// Idade do paciente no momento da biópsia (dado clínico, não identificável).
    /// </summary>
    public int? PatientAgeAtBiopsy { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // ── Chaves estrangeiras ──────────────────────────────────────
    /// <summary>
    /// Operador que cadastrou o caso.
    /// </summary>
    public Guid CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; } = null!;

    /// <summary>
    /// Inquilino / Instituição parceira à qual este caso pertence.
    /// </summary>
    public Guid? PartnerInstitutionId { get; set; }
    public PartnerInstitution? PartnerInstitution { get; set; }

    /// <summary>
    /// Médico especialista especificamente atribuído para laudar o caso.
    /// </summary>
    public Guid? AssignedDoctorId { get; set; }
    public User? AssignedDoctor { get; set; }

    /// <summary>
    /// Pasta de acervo à qual este caso pertence.
    /// </summary>
    public Guid? SlideFolderId { get; set; }
    public SlideFolder? SlideFolder { get; set; }

    // ── Navegação ────────────────────────────────────────────────
    /// <summary>
    /// Arquivos de lâmina WSI vinculados a este caso.
    /// </summary>
    public ICollection<SlideFile> SlideFiles { get; set; } = new List<SlideFile>();

    /// <summary>
    /// Pareceres clínicos (segundas opiniões) emitidos para este caso.
    /// </summary>
    public ICollection<ClinicalOpinion> Opinions { get; set; } = new List<ClinicalOpinion>();
}
