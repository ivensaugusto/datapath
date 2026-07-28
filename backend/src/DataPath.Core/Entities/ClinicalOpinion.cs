namespace DataPath.Core.Entities;

/// <summary>
/// Parecer técnico (segunda opinião) emitido por um patologista especialista.
/// Vinculado a um caso clínico e ao médico que o emitiu.
/// </summary>
public class ClinicalOpinion
{
    public Guid Id { get; set; }

    /// <summary>
    /// Diagnóstico ou impressão diagnóstica do especialista.
    /// </summary>
    public string DiagnosticImpression { get; set; } = string.Empty;

    /// <summary>
    /// Descrição microscópica detalhada.
    /// </summary>
    public string? MicroscopicDescription { get; set; }

    /// <summary>
    /// Comentários adicionais do especialista.
    /// </summary>
    public string? AdditionalComments { get; set; }

    /// <summary>
    /// Classificação de urgência/prioridade (ex: "Rotina", "Urgente").
    /// </summary>
    public string? PriorityLevel { get; set; }

    /// <summary>
    /// Se o parecer foi assinado digitalmente pelo especialista.
    /// </summary>
    public bool IsSigned { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? SignedAt { get; set; }

    // ── Chaves estrangeiras ──────────────────────────────────────
    /// <summary>
    /// Caso clínico ao qual este parecer se refere.
    /// </summary>
    public Guid BiopsyCaseId { get; set; }
    public BiopsyCase BiopsyCase { get; set; } = null!;

    /// <summary>
    /// Médico especialista que emitiu o parecer.
    /// </summary>
    public Guid IssuedByUserId { get; set; }
    public User IssuedByUser { get; set; } = null!;
}
