using System.ComponentModel.DataAnnotations;
using DataPath.Core.Enums;
using Microsoft.AspNetCore.Http;

namespace DataPath.Core.DTOs;

/// <summary>
/// DTO de solicitação pública de onboarding / acesso a equipamentos.
/// </summary>
public class CreateEquipmentAccessRequestDto
{
    [Required(ErrorMessage = "Nome completo é obrigatório.")]
    [StringLength(200)]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "E-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "E-mail inválido.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Telefone é obrigatório.")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "Instituição e departamento são obrigatórios.")]
    public string InstitutionAndDepartment { get; set; } = string.Empty;

    public EquipmentModality Modality { get; set; } = EquipmentModality.IniciacaoCientifica;

    [Required(ErrorMessage = "Título da pesquisa é obrigatório.")]
    public string ResearchTitle { get; set; } = string.Empty;

    public bool HasEthicsApproval { get; set; }

    /// <summary>
    /// Arquivos PDF de comprovação do CEP/CEUA (até 5 PDFs de no máximo 10MB cada).
    /// </summary>
    public List<IFormFile>? EthicsFiles { get; set; }

    public bool RequestScanner3DHistech { get; set; } = true;
    public bool RequestPcrRealTime7500 { get; set; }

    public StoragePolicyType RequestedStoragePolicy { get; set; } = StoragePolicyType.PrivateTemporary;
}

/// <summary>
/// DTO de resposta para exibição de solicitação de onboarding.
/// </summary>
public class EquipmentAccessRequestDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string InstitutionAndDepartment { get; set; } = string.Empty;
    public string Modality { get; set; } = string.Empty;
    public string ResearchTitle { get; set; } = string.Empty;
    public bool HasEthicsApproval { get; set; }
    public int EthicsDocumentsCount { get; set; }
    public bool RequestScanner3DHistech { get; set; }
    public bool RequestPcrRealTime7500 { get; set; }
    public string RequestedStoragePolicy { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? ReviewNotes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? ReviewedByUserName { get; set; }
}

/// <summary>
/// DTO de requisição para aprovação de solicitação e geração de Ordem de Serviço.
/// </summary>
public class ApproveOnboardingRequestDto
{
    public string? ReviewNotes { get; set; }
    public int ExpectedSlidesCount { get; set; } = 10;
    public PartnerInstitutionType InstitutionType { get; set; } = PartnerInstitutionType.AcademicResearch;
    public UserRole AssignedUserRole { get; set; } = UserRole.LabOperator;
}

/// <summary>
/// DTO de requisição para rejeição de solicitação.
/// </summary>
public class RejectOnboardingRequestDto
{
    [Required(ErrorMessage = "Justificativa de rejeição é obrigatória.")]
    public string ReviewNotes { get; set; } = string.Empty;
}
