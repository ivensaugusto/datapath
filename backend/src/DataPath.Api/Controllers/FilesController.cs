using DataPath.Core.Interfaces;
using DataPath.Infrastructure.Persistence;
using DataPath.Infrastructure.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataPath.Api.Controllers;

/// <summary>
/// Controller responsável pela transmissão em stream de arquivos WSI e validação de links temporários compartilhados.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class FilesController : ControllerBase
{
    private readonly DataPathDbContext _db;
    private readonly IStorageProvider _storageProvider;
    private readonly ILogger<FilesController> _logger;

    public FilesController(DataPathDbContext db, IStorageProvider storageProvider, ILogger<FilesController> logger)
    {
        _db = db;
        _storageProvider = storageProvider;
        _logger = logger;
    }

    /// <summary>
    /// Download/Stream de lâmina WSI para usuários autenticados.
    /// </summary>
    [HttpGet("download/{slideId:guid}")]
    [Authorize]
    public async Task<IActionResult> DownloadSlide(Guid slideId)
    {
        var slide = await _db.SlideFiles
            .Include(s => s.BiopsyCase)
                .ThenInclude(c => c.Opinions)
            .Include(s => s.SlideFolder)
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == slideId);

        if (slide == null)
            return NotFound(new { Message = "Lâmina não encontrada." });

        // Trava Multi-Tenant e Permissões de Caso
        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        Guid.TryParse(userIdStr, out var userId);
        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value ?? string.Empty;
        var partnerInstStr = User.FindFirst("partner_institution_id")?.Value;
        Guid? partnerInstId = Guid.TryParse(partnerInstStr, out var pId) ? pId : null;

        if (role != "Admin" && role != "LabOperator" && slide.SlideFolder?.Policy != Core.Enums.StoragePolicyType.PublicRepository)
        {
            bool hasAccess = slide.BiopsyCase.CreatedByUserId == userId ||
                             slide.BiopsyCase.AssignedDoctorId == userId ||
                             (slide.BiopsyCase.PartnerInstitutionId != null && slide.BiopsyCase.PartnerInstitutionId == partnerInstId) ||
                             slide.BiopsyCase.Opinions.Any(o => o.IssuedByUserId == userId);

            if (!hasAccess)
            {
                return StatusCode(403, new { Message = "Segurança LGPD/Tenant: Você não possui permissão para visualizar ou baixar as lâminas deste acervo." });
            }
        }

        var stream = await _storageProvider.GetFileStreamAsync(slide.StoragePath);
        if (stream == null)
            return NotFound(new { Message = "Arquivo não encontrado no armazenamento." });

        return File(stream, slide.ContentType, slide.OriginalFileName, enableRangeProcessing: true);
    }

    /// <summary>
    /// Acesso via Link Temporário Assinado para médicos patologistas remotos em 2ª opinião (permite streaming de WSI).
    /// </summary>
    [HttpGet("shared/{encodedPath}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSharedSlide(string encodedPath, [FromQuery] long exp, [FromQuery] string token)
    {
        if (!LocalFileSystemDriver.ValidateShareToken(encodedPath, exp, token, out var filePath))
        {
            _logger.LogWarning("Tentativa de acesso com link compartilhado inválido ou expirado. Path={Path}", encodedPath);
            return Unauthorized(new { Message = "Link de compartilhamento inválido ou expirado." });
        }

        var stream = await _storageProvider.GetFileStreamAsync(filePath);
        if (stream == null)
            return NotFound(new { Message = "Arquivo indisponível no armazenamento." });

        var contentType = filePath.EndsWith(".svs") ? "image/x-aperio-svs" : "application/octet-stream";
        var fileName = Path.GetFileName(filePath);

        return File(stream, contentType, fileName, enableRangeProcessing: true);
    }
}
