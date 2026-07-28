using DataPath.Core.Enums;

namespace DataPath.Core.Entities;

/// <summary>
/// Solicitação de Acesso a Equipamentos e Onboarding Nativo (substituição do Google Forms).
/// </summary>
public class EquipmentAccessRequest
{
    public Guid Id { get; set; }

    /// <summary>
    /// Nome completo do solicitante.
    /// </summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>
    /// E-mail de contato principal.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Telefone/DDD para contato direto.
    /// </summary>
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Nome da Instituição e Departamento de origem.
    /// </summary>
    public string InstitutionAndDepartment { get; set; } = string.Empty;

    /// <summary>
    /// Modalidade (Iniciação Científica, Mestrado, Doutorado, Pós-doc, Parceiro Clínico, Outro).
    /// </summary>
    public EquipmentModality Modality { get; set; } = EquipmentModality.IniciacaoCientifica;

    /// <summary>
    /// Título do projeto de pesquisa ou finalidade clínica.
    /// </summary>
    public string ResearchTitle { get; set; } = string.Empty;

    /// <summary>
    /// Indica se possui parecer aprovado do CEP/CEUA.
    /// </summary>
    public bool HasEthicsApproval { get; set; }

    /// <summary>
    /// Lista de caminhos de arquivos PDF de comprovante do CEP/CEUA salvos no storage (armazenado em JSON).
    /// </summary>
    public string EthicsDocumentPathsJson { get; set; } = "[]";

    /// <summary>
    /// Solicitação de uso do Scanner 3DHISTECH Pannoramic DESK II.
    /// </summary>
    public bool RequestScanner3DHistech { get; set; } = true;

    /// <summary>
    /// Solicitação de uso do Real Time 7500 PCR.
    /// </summary>
    public bool RequestPcrRealTime7500 { get; set; }

    /// <summary>
    /// Política de armazenamento desejada pelo solicitante.
    /// </summary>
    public StoragePolicyType RequestedStoragePolicy { get; set; } = StoragePolicyType.PrivateTemporary;

    /// <summary>
    /// Status da solicitação (Pendente, Aprovado, Rejeitado).
    /// </summary>
    public EquipmentRequestStatus Status { get; set; } = EquipmentRequestStatus.Pending;

    /// <summary>
    /// Observações ou justificativa do parecerista na avaliação.
    /// </summary>
    public string? ReviewNotes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReviewedAt { get; set; }

    /// <summary>
    /// Usuário administrador ou operador que avaliou esta solicitação.
    /// </summary>
    public Guid? ReviewedByUserId { get; set; }
    public User? ReviewedByUser { get; set; }

    // ── Navegação ────────────────────────────────────────────────
    public ICollection<DigitizationOrder> DigitizationOrders { get; set; } = new List<DigitizationOrder>();
}
