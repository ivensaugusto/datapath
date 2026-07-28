using DataPath.Core.Enums;
using DataPath.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace DataPath.Infrastructure.BackgroundServices;

/// <summary>
/// BackgroundService que executa tarefas periódicas de manutenção e governança LGPD:
/// 1. Verifica casos inativos há mais de 30 dias e atualiza o status para 'ReadyForArchive'.
/// 2. Invalida links de compartilhamento WSI temporários cuja data de expiração expirou.
/// </summary>
public class CaseRetentionBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<CaseRetentionBackgroundService> _logger;
    private readonly TimeSpan _checkInterval = TimeSpan.FromHours(24);

    public CaseRetentionBackgroundService(IServiceProvider serviceProvider, ILogger<CaseRetentionBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("🚀 CaseRetentionBackgroundService iniciado.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessCaseRetentionAndArchivingAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao executar rotina de retenção de casos no background.");
            }

            await Task.Delay(_checkInterval, stoppingToken);
        }
    }

    private async Task ProcessCaseRetentionAndArchivingAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataPathDbContext>();

        var cutoffDate = DateTime.UtcNow.AddDays(-30);

        // 1. Arquivar casos concluídos/laudados inativos > 30 dias
        var expiredCases = await db.BiopsyCases
            .Where(c => c.Status == CaseStatus.Laudado && c.UpdatedAt.HasValue && c.UpdatedAt.Value < cutoffDate)
            .ToListAsync(cancellationToken);

        if (expiredCases.Count > 0)
        {
            foreach (var c in expiredCases)
            {
                c.Status = CaseStatus.ReadyForArchive;
            }

            await db.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("📦 {Count} casos marcados como 'ReadyForArchive' por retenção de 30 dias.", expiredCases.Count);
        }

        // 2. Limpar links temporários expirados
        var now = DateTime.UtcNow;
        var expiredSlides = await db.SlideFiles
            .Where(s => s.ShareLinkExpiresAt.HasValue && s.ShareLinkExpiresAt.Value < now && s.TemporaryShareLink != null)
            .ToListAsync(cancellationToken);

        if (expiredSlides.Count > 0)
        {
            foreach (var slide in expiredSlides)
            {
                slide.TemporaryShareLink = null;
                slide.ShareLinkExpiresAt = null;
            }

            await db.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("🔒 {Count} links de compartilhamento temporários expirados foram revogados.", expiredSlides.Count);
        }
    }
}
