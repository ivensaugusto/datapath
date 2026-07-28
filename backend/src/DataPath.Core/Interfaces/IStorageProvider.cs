namespace DataPath.Core.Interfaces;

/// <summary>
/// Abstração de armazenamento de arquivos WSI.
/// Permite alternar entre armazenamento no sistema de arquivos local e servidor NAS QNAP via DI.
/// </summary>
public interface IStorageProvider
{
    /// <summary>
    /// Salva um arquivo no storage e retorna o caminho/identificador gerado.
    /// </summary>
    Task<string> SaveFileAsync(Stream fileStream, string fileName, string folderPath);

    /// <summary>
    /// Obtém o Stream de um arquivo armazenado para leitura/download.
    /// </summary>
    Task<Stream?> GetFileStreamAsync(string filePath);

    /// <summary>
    /// Gera um link temporário assinado com token de expiração para compartilhamento seguro.
    /// </summary>
    Task<string> GenerateTemporaryShareLinkAsync(string filePath, int expirationDays);

    /// <summary>
    /// Revoga/invalida um link de compartilhamento existente.
    /// </summary>
    Task<bool> RevokeShareLinkAsync(string filePath);

    /// <summary>
    /// Exclui um arquivo do storage.
    /// </summary>
    Task<bool> DeleteFileAsync(string filePath);
}
