namespace DataPath.Core.Entities;

/// <summary>
/// Arquivo de lâmina digital (WSI — Whole Slide Image) vinculado a um caso.
/// Armazena apenas metadados e o caminho/referência no storage.
/// </summary>
public class SlideFile
{
    public Guid Id { get; set; }

    /// <summary>
    /// Nome original do arquivo (ex: "lamina_HE_001.svs").
    /// </summary>
    public string OriginalFileName { get; set; } = string.Empty;

    /// <summary>
    /// Caminho ou identificador no storage (retornado pelo IStorageProvider).
    /// </summary>
    public string StoragePath { get; set; } = string.Empty;

    /// <summary>
    /// Tamanho do arquivo em bytes.
    /// </summary>
    public long FileSizeBytes { get; set; }

    /// <summary>
    /// MIME type do arquivo (ex: "image/tiff", "image/svs").
    /// </summary>
    public string ContentType { get; set; } = string.Empty;

    /// <summary>
    /// Hash SHA-256 do arquivo para verificação de integridade.
    /// </summary>
    public string? FileHash { get; set; }

    /// <summary>
    /// Link temporário de compartilhamento (gerado pelo IStorageProvider).
    /// Null se nenhum link ativo.
    /// </summary>
    public string? TemporaryShareLink { get; set; }

    /// <summary>
    /// Data de expiração do link temporário.
    /// </summary>
    public DateTime? ShareLinkExpiresAt { get; set; }

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    // ── Chaves estrangeiras ──────────────────────────────────────
    /// <summary>
    /// Caso clínico ao qual esta lâmina pertence.
    /// </summary>
    public Guid BiopsyCaseId { get; set; }
    public BiopsyCase BiopsyCase { get; set; } = null!;

    /// <summary>
    /// Pasta de acervo (SlideFolder) à qual este arquivo pertence.
    /// </summary>
    public Guid? SlideFolderId { get; set; }
    public SlideFolder? SlideFolder { get; set; }
}
