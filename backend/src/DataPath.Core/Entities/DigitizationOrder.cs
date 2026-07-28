using DataPath.Core.Enums;

namespace DataPath.Core.Entities;

/// <summary>
/// Ordem de Serviço / Lote de Trabalho de digitalização de lâminas no scanner.
/// </summary>
public class DigitizationOrder
{
    public Guid Id { get; set; }

    /// <summary>
    /// Código único da ordem (ex: "ORD-2026-0001").
    /// </summary>
    public string OrderCode { get; set; } = string.Empty;

    /// <summary>
    /// Tenant/Instituição vinculada a este lote.
    /// </summary>
    public Guid PartnerInstitutionId { get; set; }
    public PartnerInstitution PartnerInstitution { get; set; } = null!;

    /// <summary>
    /// ID da solicitação de acesso que gerou esta ordem (opcional).
    /// </summary>
    public Guid? EquipmentAccessRequestId { get; set; }
    public EquipmentAccessRequest? EquipmentAccessRequest { get; set; }

    /// <summary>
    /// Quantidade de lâminas estimadas para digitalização.
    /// </summary>
    public int ExpectedSlidesCount { get; set; }

    /// <summary>
    /// Quantidade de lâminas efetivamente digitalizadas.
    /// </summary>
    public int DigitizedSlidesCount { get; set; }

    /// <summary>
    /// Status atual da ordem de trabalho.
    /// </summary>
    public DigitizationOrderStatus Status { get; set; } = DigitizationOrderStatus.Received;

    /// <summary>
    /// Notas técnicas ou observações do operador do laboratório.
    /// </summary>
    public string? TechnicalNotes { get; set; }

    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
}
