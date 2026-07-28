using System.Net.Http.Json;
using System.Text.Json.Serialization;
using DataPath.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DataPath.Infrastructure.Storage;

/// <summary>
/// Driver de integração com QNAP File Station REST API.
/// Gerencia autenticação (SID), upload de grandes arquivos WSI e geração de links de compartilhamento.
/// Em caso de falha de conexão ou ausência de credenciais, delega operações de fallback para o driver local.
/// </summary>
public class QnapRestApiDriver : IStorageProvider
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;
    private readonly ILogger<QnapRestApiDriver> _logger;
    private readonly LocalFileSystemDriver _fallbackDriver;
    private string? _sessionId;

    public QnapRestApiDriver(HttpClient httpClient, IConfiguration config, ILogger<QnapRestApiDriver> logger)
    {
        _httpClient = httpClient;
        _config = config;
        _logger = logger;
        _fallbackDriver = new LocalFileSystemDriver(config["Storage:LocalBasePath"] ?? "/app/storage");
    }

    public async Task<string> SaveFileAsync(Stream fileStream, string fileName, string folderPath)
    {
        var qnapHost = _config["Storage:QnapHost"];
        if (string.IsNullOrEmpty(qnapHost))
        {
            _logger.LogInformation("QNAP Host não configurado. Utilizando fallback local.");
            return await _fallbackDriver.SaveFileAsync(fileStream, fileName, folderPath);
        }

        try
        {
            await EnsureAuthenticatedAsync();

            var uploadUrl = $"{qnapHost}/cgi-bin/filemanager/utilRequest.cgi?func=upload&sid={_sessionId}&dest_path={Uri.EscapeDataString(folderPath)}&overwrite=1";
            using var content = new MultipartFormDataContent();
            content.Add(new StreamContent(fileStream), "file", fileName);

            var response = await _httpClient.PostAsync(uploadUrl, content);
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Arquivo {FileName} salvo com sucesso no QNAP NAS.", fileName);
                return $"{folderPath}/{fileName}";
            }

            _logger.LogWarning("Upload no QNAP retornou {StatusCode}. Usando fallback local.", response.StatusCode);
            return await _fallbackDriver.SaveFileAsync(fileStream, fileName, folderPath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao salvar no QNAP NAS. Recorrendo a fallback local.");
            return await _fallbackDriver.SaveFileAsync(fileStream, fileName, folderPath);
        }
    }

    public async Task<Stream?> GetFileStreamAsync(string filePath)
    {
        var qnapHost = _config["Storage:QnapHost"];
        if (string.IsNullOrEmpty(qnapHost))
        {
            return await _fallbackDriver.GetFileStreamAsync(filePath);
        }

        try
        {
            await EnsureAuthenticatedAsync();
            var downloadUrl = $"{qnapHost}/cgi-bin/filemanager/utilRequest.cgi?func=download&sid={_sessionId}&path={Uri.EscapeDataString(filePath)}";
            return await _httpClient.GetStreamAsync(downloadUrl);
        }
        catch
        {
            return await _fallbackDriver.GetFileStreamAsync(filePath);
        }
    }

    public async Task<string> GenerateTemporaryShareLinkAsync(string filePath, int expirationDays)
    {
        var qnapHost = _config["Storage:QnapHost"];
        if (string.IsNullOrEmpty(qnapHost))
        {
            return await _fallbackDriver.GenerateTemporaryShareLinkAsync(filePath, expirationDays);
        }

        try
        {
            await EnsureAuthenticatedAsync();
            var shareUrl = $"{qnapHost}/cgi-bin/filemanager/utilRequest.cgi?func=share&sid={_sessionId}&path={Uri.EscapeDataString(filePath)}&expire={expirationDays}";
            var response = await _httpClient.GetFromJsonAsync<QnapShareResponse>(shareUrl);

            if (!string.IsNullOrEmpty(response?.Url))
            {
                return response.Url;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao gerar link de compartilhamento no QNAP.");
        }

        return await _fallbackDriver.GenerateTemporaryShareLinkAsync(filePath, expirationDays);
    }

    public async Task<bool> RevokeShareLinkAsync(string filePath)
    {
        return await _fallbackDriver.RevokeShareLinkAsync(filePath);
    }

    public async Task<bool> DeleteFileAsync(string filePath)
    {
        return await _fallbackDriver.DeleteFileAsync(filePath);
    }

    private async Task EnsureAuthenticatedAsync()
    {
        if (!string.IsNullOrEmpty(_sessionId)) return;

        var qnapHost = _config["Storage:QnapHost"];
        var username = _config["Storage:QnapUsername"] ?? "admin";
        var password = _config["Storage:QnapPassword"] ?? "";

        var loginUrl = $"{qnapHost}/cgi-bin/filemanager/utilRequest.cgi?func=login&user={Uri.EscapeDataString(username)}&pwd={Uri.EscapeDataString(password)}";
        var response = await _httpClient.GetFromJsonAsync<QnapLoginResponse>(loginUrl);

        if (response?.Status == 1 && !string.IsNullOrEmpty(response.Sid))
        {
            _sessionId = response.Sid;
            _logger.LogInformation("Autenticado com sucesso no QNAP File Station (SID: {Sid}).", _sessionId[..4] + "...");
        }
        else
        {
            throw new InvalidOperationException("Falha na autenticação do QNAP File Station.");
        }
    }

    private record QnapLoginResponse([property: JsonPropertyName("status")] int Status, [property: JsonPropertyName("sid")] string Sid);
    private record QnapShareResponse([property: JsonPropertyName("url")] string Url);
}
