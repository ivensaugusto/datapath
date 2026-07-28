using DataPath.Core.Entities;
using DataPath.Core.Enums;
using DataPath.Core.Interfaces;
using DataPath.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace DataPath.Infrastructure.BackgroundServices;

/// <summary>
/// Worker de Ciclo de Vida de Storage e Expurgo Automático.
/// Executa periodicamente buscando acervos com política PrivateTemporary expirados (ExpiresAt <= UTC.Now).
/// Exclui fisicamente os arquivos WSI do QNAP NAS/Storage local e registra entrada imutável no AuditLog.
/// </summary>
public class StoragePurgeBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<StoragePurgeBackgroundService> _logger;
    private readonly TimeSpan _checkInterval = TimeSpan.FromHours(24);

    public StoragePurgeBackgroundService(IServiceProvider serviceProvider, ILogger<StoragePurgeBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("🚀 StoragePurgeBackgroundService iniciado.");

        await Task.Delay(TimeSpan.FromSeconds(15), stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await PurgeExpiredTemporaryFoldersAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao executar rotina de expurgo físico de acervos expirados.");
            }

            await Task.Delay(_checkInterval, stoppingToken);
        }
    }

    private async Task PurgeExpiredTemporaryFoldersAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataPathDbContext>();
        var storageProvider = scope.ServiceProvider.GetRequiredService<IStorageProvider>();

        var now = DateTime.UtcNow;

        // Buscar pastas PrivateTemporary expiradas
        var expiredFolders = await db.SlideFolders
            .Include(f => f.SlideFiles)
            .Where(f => f.Policy == StoragePolicyType.PrivateTemporary && f.ExpiresAt.HasValue && f.ExpiresAt.Value <= now)
            .ToListAsync(cancellationToken);

        if (expiredFolders.Count == 0) return;

        _logger.LogInformation("🧹 Encontradas {Count} pastas com política PrivateTemporary expiradas para expurgo físico.", expiredFolders.Count);

        foreach (var folder in expiredFolders)
        {
            foreach (var slide in folder.SlideFiles)
            {
                try
                {
                    // Exclusão física no QNAP NAS / Storage local
                    await storageProvider.DeleteFileAsync(slide.StoragePath);

                    // Registro imutável de auditoria
                    db.AuditLogs.Add(new AuditLog
                    {
                        Id = Guid.NewGuid(),
                        Action = "PHYSICAL_PURGE",
                        EntityName = nameof(SlideFile),
                        EntityId = slide.Id.ToString(),
                        Details = $"Lâmina [{slide.OriginalFileName} | SHA-256: {slide.FileHash ?? "N/A"}] excluída fisicamente por expiração da política PrivateTemporary.",
                        IpAddress = "127.0.0.1",
                        UserAgent = "System Background Worker (StoragePurgeBackgroundService)",
                        Timestamp = DateTime.UtcNow
                    });

                    _logger.LogInformation("🔥 Lâmina {FileName} (Hash: {Hash}) excluída fisicamente.", slide.OriginalFileName, slide.FileHash);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Falha ao remover arquivo físico da lâmina {SlideId} em {StoragePath}", slide.Id, slide.StoragePath);
                }
            }

            db.SlideFiles.RemoveRange(folder.SlideFiles);
            db.SlideFolders.Remove(folder);
        }

        await db.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("✅ Expurgo físico concluído com sucesso.");
    }
}
