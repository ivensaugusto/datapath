using System.Security.Claims;
using System.Security.Cryptography;
using DataPath.Core.DTOs;
using DataPath.Core.Entities;
using DataPath.Core.Enums;
using DataPath.Core.Interfaces;
using DataPath.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataPath.Api.Controllers;

/// <summary>
/// Controller principal do Mini-PACS para gestão anonimizada de Casos Clínicos (Biópsias) e Upload de Lâminas WSI.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CasesController : ControllerBase
{
    private readonly DataPathDbContext _db;
    private readonly IStorageProvider _storageProvider;
    private readonly ILogger<CasesController> _logger;

    public CasesController(DataPathDbContext db, IStorageProvider storageProvider, ILogger<CasesController> logger)
    {
        _db = db;
        _storageProvider = storageProvider;
        _logger = logger;
    }

    /// <summary>
    /// Lista todos os Casos Clínicos com suporte a filtros por Órgão, Status, busca textual e paginação.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetCases(
        [FromQuery] string? organSite,
        [FromQuery] string? status,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _db.BiopsyCases
            .Include(c => c.CreatedByUser)
            .Include(c => c.SlideFiles)
            .Include(c => c.Opinions)
            .AsNoTracking()
            .AsQueryable();

        // Filtro por Órgão/Sítio
        if (!string.IsNullOrWhiteSpace(organSite))
        {
            query = query.Where(c => c.OrganSite.ToLower() == organSite.ToLower());
        }

        // Filtro por Status
        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<CaseStatus>(status, true, out var parsedStatus))
        {
            query = query.Where(c => c.Status == parsedStatus);
        }

        // Busca livre (Código do Caso ou Resumo Clínico)
        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            query = query.Where(c => c.InternalCaseCode.ToLower().Contains(s) ||
                                     c.ClinicalSummary.ToLower().Contains(s) ||
                                     c.OrganSite.ToLower().Contains(s));
        }

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var cases = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new BiopsyCaseSummaryDto
            {
                Id = c.Id,
                InternalCaseCode = c.InternalCaseCode,
                OrganSite = c.OrganSite,
                StainingType = c.StainingType,
                Status = c.Status.ToString(),
                SlideCount = c.SlideFiles.Count,
                HasOpinion = c.Opinions.Any(),
                CreatedAt = c.CreatedAt,
                CreatedByUserName = c.CreatedByUser.FullName
            })
            .ToListAsync();

        return Ok(new
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            CurrentPage = page,
            PageSize = pageSize,
            Items = cases
        });
    }

    /// <summary>
    /// Obtém os detalhes completos de um Caso Clínico, incluindo lâminas WSI e pareceres emitidos.
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetCaseById(Guid id)
    {
        var biopsyCase = await _db.BiopsyCases
            .Include(c => c.CreatedByUser)
            .Include(c => c.SlideFiles)
            .Include(c => c.Opinions)
                .ThenInclude(o => o.IssuedByUser)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

        if (biopsyCase == null)
            return NotFound(new { Message = "Caso clínico não encontrado." });

        // Gerar links de compartilhamento temporários atualizados para cada lâmina
        var slideDtos = new List<SlideFileDto>();
        foreach (var slide in biopsyCase.SlideFiles)
        {
            var shareLink = await _storageProvider.GenerateTemporaryShareLinkAsync(slide.StoragePath, 30);
            slideDtos.Add(new SlideFileDto
            {
                Id = slide.Id,
                OriginalFileName = slide.OriginalFileName,
                FileSizeBytes = slide.FileSizeBytes,
                ContentType = slide.ContentType,
                FileHash = slide.FileHash,
                TemporaryShareLink = shareLink,
                ShareLinkExpiresAt = DateTime.UtcNow.AddDays(30),
                UploadedAt = slide.UploadedAt
            });
        }

        var result = new BiopsyCaseDetailDto
        {
            Id = biopsyCase.Id,
            InternalCaseCode = biopsyCase.InternalCaseCode,
            OrganSite = biopsyCase.OrganSite,
            StainingType = biopsyCase.StainingType,
            ClinicalSummary = biopsyCase.ClinicalSummary,
            Status = biopsyCase.Status.ToString(),
            PatientBiologicalSex = biopsyCase.PatientBiologicalSex,
            PatientAgeAtBiopsy = biopsyCase.PatientAgeAtBiopsy,
            CreatedAt = biopsyCase.CreatedAt,
            UpdatedAt = biopsyCase.UpdatedAt,
            CreatedByUserName = biopsyCase.CreatedByUser.FullName,
            SlideFiles = slideDtos,
            Opinions = biopsyCase.Opinions.Select(o => new ClinicalOpinionDto
            {
                Id = o.Id,
                DiagnosticImpression = o.DiagnosticImpression,
                MicroscopicDescription = o.MicroscopicDescription,
                AdditionalComments = o.AdditionalComments,
                PriorityLevel = o.PriorityLevel,
                IsSigned = o.IsSigned,
                CreatedAt = o.CreatedAt,
                SignedAt = o.SignedAt,
                IssuedByUserId = o.IssuedByUserId,
                IssuedByUserName = o.IssuedByUser.FullName,
                IssuedByUserSpecialty = o.IssuedByUser.Specialty
            }).ToList()
        };

        return Ok(result);
    }

    /// <summary>
    /// Cadastra um novo Caso Clínico anonimizado com código gerado automaticamente (DP-YYYY-XXXX).
    /// </summary>
    [HttpPost]
    [Authorize(Policy = AuthPolicies.LabOperatorOrAdmin)]
    public async Task<IActionResult> CreateCase([FromBody] CreateBiopsyCaseDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        // Gerar Código Interno do Caso Sequencial Anonimizado (DP-2026-XXXX)
        var currentYear = DateTime.UtcNow.Year;
        var countThisYear = await _db.BiopsyCases
            .CountAsync(c => c.InternalCaseCode.StartsWith($"DP-{currentYear}"));
        var caseCode = $"DP-{currentYear}-{(countThisYear + 1):D4}";

        var biopsyCase = new BiopsyCase
        {
            Id = Guid.NewGuid(),
            InternalCaseCode = caseCode,
            OrganSite = dto.OrganSite,
            StainingType = dto.StainingType,
            ClinicalSummary = dto.ClinicalSummary,
            PatientBiologicalSex = dto.PatientBiologicalSex,
            PatientAgeAtBiopsy = dto.PatientAgeAtBiopsy,
            Status = CaseStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            CreatedByUserId = userId
        };

        _db.BiopsyCases.Add(biopsyCase);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Caso clínico {CaseCode} criado com sucesso por {UserId}.", caseCode, userId);

        return CreatedAtAction(nameof(GetCaseById), new { id = biopsyCase.Id }, new
        {
            Message = "Caso clínico cadastrado com sucesso.",
            CaseId = biopsyCase.Id,
            InternalCaseCode = caseCode
        });
    }

    /// <summary>
    /// Upload e vínculo de arquivo de Lâmina Histopatológica WSI ao Caso Clínico.
    /// </summary>
    [HttpPost("{id:guid}/slides")]
    [Authorize(Policy = AuthPolicies.LabOperatorOrAdmin)]
    [RequestSizeLimit(2_147_483_648)] // 2 GB máximo por lâmina WSI
    public async Task<IActionResult> UploadSlide(Guid id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { Message = "Selecione um arquivo de lâmina válido." });

        var biopsyCase = await _db.BiopsyCases.FindAsync(id);
        if (biopsyCase == null)
            return NotFound(new { Message = "Caso clínico não encontrado." });

        // Calcular Hash SHA-256 do arquivo para integridade auditável
        string fileHash;
        using (var sha256 = SHA256.Create())
        using (var stream = file.OpenReadStream())
        {
            var hashBytes = await sha256.ComputeHashAsync(stream);
            fileHash = Convert.ToHexString(hashBytes).ToLowerInvariant();
        }

        // Salvar arquivo usando IStorageProvider
        var folderPath = $"cases/{biopsyCase.InternalCaseCode}";
        string storagePath;
        using (var uploadStream = file.OpenReadStream())
        {
            storagePath = await _storageProvider.SaveFileAsync(uploadStream, file.FileName, folderPath);
        }

        // Gerar Link Temporário
        var shareLink = await _storageProvider.GenerateTemporaryShareLinkAsync(storagePath, 30);

        var slideFile = new SlideFile
        {
            Id = Guid.NewGuid(),
            BiopsyCaseId = id,
            OriginalFileName = file.FileName,
            StoragePath = storagePath,
            FileSizeBytes = file.Length,
            ContentType = file.ContentType,
            FileHash = fileHash,
            TemporaryShareLink = shareLink,
            ShareLinkExpiresAt = DateTime.UtcNow.AddDays(30),
            UploadedAt = DateTime.UtcNow
        };

        _db.SlideFiles.Add(slideFile);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Lâmina WSI {FileName} ({Size} bytes) anexada ao caso {CaseCode}.", file.FileName, file.Length, biopsyCase.InternalCaseCode);

        return Ok(new
        {
            Message = "Lâmina WSI anexada com sucesso.",
            Slide = new SlideFileDto
            {
                Id = slideFile.Id,
                OriginalFileName = slideFile.OriginalFileName,
                FileSizeBytes = slideFile.FileSizeBytes,
                ContentType = slideFile.ContentType,
                FileHash = slideFile.FileHash,
                TemporaryShareLink = shareLink,
                ShareLinkExpiresAt = slideFile.ShareLinkExpiresAt,
                UploadedAt = slideFile.UploadedAt
            }
        });
    }

    /// <summary>
    /// Atualiza metadados de um Caso Clínico.
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize(Policy = AuthPolicies.LabOperatorOrAdmin)]
    public async Task<IActionResult> UpdateCase(Guid id, [FromBody] UpdateBiopsyCaseDto dto)
    {
        var biopsyCase = await _db.BiopsyCases.FindAsync(id);
        if (biopsyCase == null)
            return NotFound(new { Message = "Caso clínico não encontrado." });

        biopsyCase.OrganSite = dto.OrganSite;
        biopsyCase.StainingType = dto.StainingType;
        biopsyCase.ClinicalSummary = dto.ClinicalSummary;
        biopsyCase.Status = dto.Status;
        biopsyCase.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { Message = "Caso clínico atualizado com sucesso." });
    }

    /// <summary>
    /// Remove um Caso Clínico e suas lâminas vinculadas.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Policy = AuthPolicies.AdminOnly)]
    public async Task<IActionResult> DeleteCase(Guid id)
    {
        var biopsyCase = await _db.BiopsyCases
            .Include(c => c.SlideFiles)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (biopsyCase == null)
            return NotFound(new { Message = "Caso clínico não encontrado." });

        foreach (var slide in biopsyCase.SlideFiles)
        {
            await _storageProvider.DeleteFileAsync(slide.StoragePath);
        }

        _db.BiopsyCases.Remove(biopsyCase);
        await _db.SaveChangesAsync();

        return Ok(new { Message = "Caso clínico e lâminas associadas removidos com sucesso." });
    }
}
