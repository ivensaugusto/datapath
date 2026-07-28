using System.Security.Cryptography;
using System.Text;
using DataPath.Core.Interfaces;

namespace DataPath.Infrastructure.Storage;

/// <summary>
/// Implementação de armazenamento no sistema de arquivos local com suporte a links temporários assinados.
/// Usado para desenvolvimento no notebook e amostragem de lâminas WSI.
/// </summary>
public class LocalFileSystemDriver : IStorageProvider
{
    private readonly string _basePath;
    private static readonly string SecretSigningKey = "dataPATH_WSI_Storage_Secret_Key_2026_LGPD_Compliant";

    public LocalFileSystemDriver(string basePath = "/app/storage")
    {
        _basePath = basePath;
        if (!Directory.Exists(_basePath))
        {
            try
            {
                Directory.CreateDirectory(_basePath);
            }
            catch
            {
                // Ignorar exceção se não houver permissão no /app/storage no ambiente local fora do container
            }
        }
    }

    public async Task<string> SaveFileAsync(Stream fileStream, string fileName, string folderPath)
    {
        var targetFolder = Path.Combine(_basePath, folderPath.Replace('/', Path.DirectorySeparatorChar));
        Directory.CreateDirectory(targetFolder);

        var fullPath = Path.Combine(targetFolder, fileName);
        using var destination = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None, 8192, useAsync: true);
        await fileStream.CopyToAsync(destination);

        return fullPath;
    }

    public Task<Stream?> GetFileStreamAsync(string filePath)
    {
        if (!File.Exists(filePath))
        {
            // Tentar resolver relativo ao _basePath se não for absoluto existente
            var relativePath = Path.Combine(_basePath, filePath.TrimStart('/', '\\'));
            if (!File.Exists(relativePath))
            {
                return Task.FromResult<Stream?>(null);
            }
            filePath = relativePath;
        }

        Stream stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, 8192, useAsync: true);
        return Task.FromResult<Stream?>(stream);
    }

    public Task<string> GenerateTemporaryShareLinkAsync(string filePath, int expirationDays)
    {
        var expiresAt = DateTime.UtcNow.AddDays(expirationDays).Ticks;
        var rawData = $"{filePath}:{expiresAt}:{SecretSigningKey}";

        using var sha256 = SHA256.Create();
        var hash = Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(rawData)))
            .Replace('/', '_').Replace('+', '-').TrimEnd('=');

        var encodedPath = Convert.ToBase64String(Encoding.UTF8.GetBytes(filePath))
            .Replace('/', '_').Replace('+', '-').TrimEnd('=');

        var shareLink = $"/api/files/shared/{encodedPath}?exp={expiresAt}&token={hash}";
        return Task.FromResult(shareLink);
    }

    public Task<bool> RevokeShareLinkAsync(string filePath)
    {
        // No driver local, revogação é tratada pela expiração ou remoção do arquivo
        return Task.FromResult(true);
    }

    public Task<bool> DeleteFileAsync(string filePath)
    {
        try
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                return Task.FromResult(true);
            }
        }
        catch
        {
            return Task.FromResult(false);
        }
        return Task.FromResult(false);
    }

    /// <summary>
    /// Valida um token de link temporário.
    /// </summary>
    public static bool ValidateShareToken(string encodedPath, long expiresAt, string token, out string decodedFilePath)
    {
        decodedFilePath = string.Empty;
        try
        {
            if (DateTime.UtcNow.Ticks > expiresAt) return false;

            var padding = (4 - encodedPath.Length % 4) % 4;
            var base64 = encodedPath.Replace('_', '/').Replace('-', '+') + new string('=', padding);
            decodedFilePath = Encoding.UTF8.GetString(Convert.FromBase64String(base64));

            var rawData = $"{decodedFilePath}:{expiresAt}:{SecretSigningKey}";
            using var sha256 = SHA256.Create();
            var expectedHash = Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(rawData)))
                .Replace('/', '_').Replace('+', '-').TrimEnd('=');

            return token == expectedHash;
        }
        catch
        {
            return false;
        }
    }
}
