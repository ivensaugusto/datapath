using System.ComponentModel.DataAnnotations;
using DataPath.Core.Enums;

namespace DataPath.Core.DTOs;

/// <summary>
/// DTO para criação de novo Caso Clínico.
/// </summary>
public class CreateBiopsyCaseDto
{
    [Required(ErrorMessage = "Órgão/Sítio anatômico é obrigatório.")]
    [StringLength(100)]
    public string OrganSite { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tipo de coloração é obrigatório.")]
    [StringLength(100)]
    public string StainingType { get; set; } = string.Empty;

    [Required(ErrorMessage = "Resumo clínico é obrigatório.")]
    [StringLength(4000)]
    public string ClinicalSummary { get; set; } = string.Empty;

    [StringLength(10)]
    public string? PatientBiologicalSex { get; set; }

    [Range(0, 150)]
    public int? PatientAgeAtBiopsy { get; set; }
}

/// <summary>
/// DTO para atualização de Caso Clínico existente.
/// </summary>
public class UpdateBiopsyCaseDto
{
    [Required]
    [StringLength(100)]
    public string OrganSite { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string StainingType { get; set; } = string.Empty;

    [Required]
    [StringLength(4000)]
    public string ClinicalSummary { get; set; } = string.Empty;

    public CaseStatus Status { get; set; }
}

/// <summary>
/// DTO de resposta detalhada de um Caso Clínico com Lâminas e Pareceres.
/// </summary>
public class BiopsyCaseDetailDto
{
    public Guid Id { get; set; }
    public string InternalCaseCode { get; set; } = string.Empty;
    public string OrganSite { get; set; } = string.Empty;
    public string StainingType { get; set; } = string.Empty;
    public string ClinicalSummary { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? PatientBiologicalSex { get; set; }
    public int? PatientAgeAtBiopsy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string CreatedByUserName { get; set; } = string.Empty;
    public List<SlideFileDto> SlideFiles { get; set; } = new();
    public List<ClinicalOpinionDto> Opinions { get; set; } = new();
}

/// <summary>
/// DTO de resposta resumida de Caso Clínico para o Dashboard.
/// </summary>
public class BiopsyCaseSummaryDto
{
    public Guid Id { get; set; }
    public string InternalCaseCode { get; set; } = string.Empty;
    public string OrganSite { get; set; } = string.Empty;
    public string StainingType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int SlideCount { get; set; }
    public bool HasOpinion { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedByUserName { get; set; } = string.Empty;
}

/// <summary>
/// DTO de resposta para um arquivo de Lâmina WSI.
/// </summary>
public class SlideFileDto
{
    public Guid Id { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public string? FileHash { get; set; }
    public string? TemporaryShareLink { get; set; }
    public DateTime? ShareLinkExpiresAt { get; set; }
    public DateTime UploadedAt { get; set; }
}

/// <summary>
/// DTO para criação/emissão de Parecer Clínico (2ª Opinião).
/// </summary>
public class CreateClinicalOpinionDto
{
    [Required(ErrorMessage = "Impressão diagnóstica é obrigatória.")]
    [StringLength(4000)]
    public string DiagnosticImpression { get; set; } = string.Empty;

    [StringLength(4000)]
    public string? MicroscopicDescription { get; set; }

    [StringLength(2000)]
    public string? AdditionalComments { get; set; }

    [StringLength(50)]
    public string? PriorityLevel { get; set; }
}

/// <summary>
/// DTO de resposta para Parecer Clínico.
/// </summary>
public class ClinicalOpinionDto
{
    public Guid Id { get; set; }
    public string DiagnosticImpression { get; set; } = string.Empty;
    public string? MicroscopicDescription { get; set; }
    public string? AdditionalComments { get; set; }
    public string? PriorityLevel { get; set; }
    public bool IsSigned { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? SignedAt { get; set; }
    public Guid IssuedByUserId { get; set; }
    public string IssuedByUserName { get; set; } = string.Empty;
    public string? IssuedByUserSpecialty { get; set; }
}
