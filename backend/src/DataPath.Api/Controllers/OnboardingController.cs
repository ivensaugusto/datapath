using System.Security.Claims;
using System.Text.Json;
using DataPath.Core.DTOs;
using DataPath.Core.Entities;
using DataPath.Core.Enums;
using DataPath.Core.Interfaces;
using DataPath.Infrastructure.Auth;
using DataPath.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataPath.Api.Controllers;

/// <summary>
/// Controller para captação nativa de parceiros/pesquisadores e gestão do fluxo de onboarding e ordens de trabalho.
/// </summary>
[ApiController]
[Route("api/v1/onboarding")]
public class OnboardingController : ControllerBase
{
    private readonly DataPathDbContext _db;
    private readonly IStorageProvider _storageProvider;
    private readonly IAuthService _authService;
    private readonly ILogger<OnboardingController> _logger;

    public OnboardingController(
        DataPathDbContext db,
        IStorageProvider storageProvider,
        IAuthService authService,
        ILogger<OnboardingController> logger)
    {
        _db = db;
        _storageProvider = storageProvider;
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Form Público Nativo: Submissão de solicitação de acesso a equipamentos e onboarding.
    /// </summary>
    [HttpPost("apply")]
    [AllowAnonymous]
    [RequestSizeLimit(50_000_000)] // Máx 50 MB total
    public async Task<IActionResult> ApplyForAccess([FromForm] CreateEquipmentAccessRequestDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var pdfPaths = new List<string>();

        if (dto.EthicsFiles != null && dto.EthicsFiles.Count > 0)
        {
            if (dto.EthicsFiles.Count > 5)
                return BadRequest(new { Message = "Permitido no máximo 5 arquivos de comprovação CEP/CEUA." });

            foreach (var file in dto.EthicsFiles)
            {
                if (file.Length > 10 * 1024 * 1024)
                    return BadRequest(new { Message = $"O arquivo {file.FileName} excede o limite máximo de 10 MB." });

                var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (ext != ".pdf")
                    return BadRequest(new { Message = $"Apenas arquivos em formato PDF são aceitos. Arquivo inválido: {file.FileName}" });

                var folderPath = $"onboarding/{DateTime.UtcNow:yyyy-MM}";
                var fileName = $"ethics_{Guid.NewGuid():N}_{file.FileName}";
                using var stream = file.OpenReadStream();
                var savedPath = await _storageProvider.SaveFileAsync(stream, fileName, folderPath);
                pdfPaths.Add(savedPath);
            }
        }

        var request = new EquipmentAccessRequest
        {
            Id = Guid.NewGuid(),
            FullName = dto.FullName,
            Email = dto.Email,
            Phone = dto.Phone,
            InstitutionAndDepartment = dto.InstitutionAndDepartment,
            Modality = dto.Modality,
            ResearchTitle = dto.ResearchTitle,
            HasEthicsApproval = dto.HasEthicsApproval,
            EthicsDocumentPathsJson = JsonSerializer.Serialize(pdfPaths),
            RequestScanner3DHistech = dto.RequestScanner3DHistech,
            RequestPcrRealTime7500 = dto.RequestPcrRealTime7500,
            RequestedStoragePolicy = dto.RequestedStoragePolicy,
            Status = EquipmentRequestStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        _db.EquipmentAccessRequests.Add(request);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Nova solicitação de onboarding enviada por {Name} ({Email}) - {Institution}", request.FullName, request.Email, request.InstitutionAndDepartment);

        return Ok(new
        {
            Message = "Solicitação de cadastro e uso de equipamentos recebida com sucesso! Nossa equipe técnica analisará a documentação e enviará o acesso por e-mail.",
            RequestId = request.Id
        });
    }

    /// <summary>
    /// Lista todas as solicitações de onboarding (Admin / LabOperator).
    /// </summary>
    [HttpGet("requests")]
    [Authorize(Policy = AuthPolicies.LabOperatorOrAdmin)]
    public async Task<IActionResult> GetRequests(
        [FromQuery] string? status,
        [FromQuery] string? equipment,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _db.EquipmentAccessRequests
            .Include(r => r.ReviewedByUser)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<EquipmentRequestStatus>(status, true, out var parsedStatus))
        {
            query = query.Where(r => r.Status == parsedStatus);
        }

        if (!string.IsNullOrWhiteSpace(equipment))
        {
            if (equipment.Equals("scanner", StringComparison.OrdinalIgnoreCase))
                query = query.Where(r => r.RequestScanner3DHistech);
            else if (equipment.Equals("pcr", StringComparison.OrdinalIgnoreCase))
                query = query.Where(r => r.RequestPcrRealTime7500);
        }

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var items = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new EquipmentAccessRequestDto
            {
                Id = r.Id,
                FullName = r.FullName,
                Email = r.Email,
                Phone = r.Phone,
                InstitutionAndDepartment = r.InstitutionAndDepartment,
                Modality = r.Modality.ToString(),
                ResearchTitle = r.ResearchTitle,
                HasEthicsApproval = r.HasEthicsApproval,
                EthicsDocumentsCount = JsonSerializer.Deserialize<List<string>>(r.EthicsDocumentPathsJson ?? "[]")!.Count,
                RequestScanner3DHistech = r.RequestScanner3DHistech,
                RequestPcrRealTime7500 = r.RequestPcrRealTime7500,
                RequestedStoragePolicy = r.RequestedStoragePolicy.ToString(),
                Status = r.Status.ToString(),
                ReviewNotes = r.ReviewNotes,
                CreatedAt = r.CreatedAt,
                ReviewedAt = r.ReviewedAt,
                ReviewedByUserName = r.ReviewedByUser != null ? r.ReviewedByUser.FullName : null
            })
            .ToListAsync();

        return Ok(new
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            CurrentPage = page,
            PageSize = pageSize,
            Items = items
        });
    }

    /// <summary>
    /// Stream de visualização de PDF do CEP/CEUA sem baixar localmente.
    /// </summary>
    [HttpGet("requests/{id:guid}/documents/{index:int}")]
    [Authorize(Policy = AuthPolicies.LabOperatorOrAdmin)]
    public async Task<IActionResult> GetDocumentStream(Guid id, int index)
    {
        var request = await _db.EquipmentAccessRequests.FindAsync(id);
        if (request == null)
            return NotFound(new { Message = "Solicitação não encontrada." });

        var paths = JsonSerializer.Deserialize<List<string>>(request.EthicsDocumentPathsJson ?? "[]");
        if (paths == null || index < 0 || index >= paths.Count)
            return NotFound(new { Message = "Documento em PDF não encontrado." });

        var path = paths[index];
        var stream = await _storageProvider.GetFileStreamAsync(path);
        if (stream == null)
            return NotFound(new { Message = "Arquivo indisponível no armazenamento." });

        return File(stream, "application/pdf", Path.GetFileName(path));
    }

    /// <summary>
    /// Ação "Aprovar e Gerar Ordem de Trabalho" (Transação Única).
    /// </summary>
    [HttpPost("requests/{id:guid}/approve")]
    [Authorize(Policy = AuthPolicies.LabOperatorOrAdmin)]
    public async Task<IActionResult> ApproveRequest(Guid id, [FromBody] ApproveOnboardingRequestDto dto)
    {
        var request = await _db.EquipmentAccessRequests.FindAsync(id);
        if (request == null)
            return NotFound(new { Message = "Solicitação não encontrada." });

        if (request.Status == EquipmentRequestStatus.Approved)
            return BadRequest(new { Message = "Esta solicitação já foi aprovada." });

        var reviewerIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        Guid.TryParse(reviewerIdStr, out var reviewerId);

        using var transaction = await _db.Database.BeginTransactionAsync();
        try
        {
            // 1. Atualizar solicitação
            request.Status = EquipmentRequestStatus.Approved;
            request.ReviewNotes = dto.ReviewNotes;
            request.ReviewedAt = DateTime.UtcNow;
            request.ReviewedByUserId = reviewerId;

            // 2. Criar Tenant / PartnerInstitution
            var instName = string.IsNullOrWhiteSpace(request.InstitutionAndDepartment) ? "Instituição Parceira" : request.InstitutionAndDepartment;
            var tenant = new PartnerInstitution
            {
                Id = Guid.NewGuid(),
                CorporateName = instName,
                TradeName = instName.Split('-')[0].Trim(),
                DocumentNumber = "ISENTO-" + Guid.NewGuid().ToString("N")[..8].ToUpper(),
                ContactEmail = request.Email,
                ContactPhone = request.Phone,
                Type = dto.InstitutionType,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            _db.PartnerInstitutions.Add(tenant);

            // 3. Criar Conta de Usuário (se não existir por email)
            var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            User user;
            if (existingUser == null)
            {
                var defaultPasswordHash = _authService.HashPassword("DataPath@2026");
                user = new User
                {
                    Id = Guid.NewGuid(),
                    FullName = request.FullName,
                    Email = request.Email,
                    PasswordHash = defaultPasswordHash,
                    Role = dto.AssignedUserRole,
                    PartnerInstitutionId = tenant.Id,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };
                _db.Users.Add(user);
            }
            else
            {
                user = existingUser;
                user.PartnerInstitutionId = tenant.Id;
            }

            // 4. Gerar Ordem de Trabalho de Digitalização
            var currentYear = DateTime.UtcNow.Year;
            var ordersCount = await _db.DigitizationOrders.CountAsync(o => o.OrderCode.StartsWith($"ORD-{currentYear}"));
            var orderCode = $"ORD-{currentYear}-{(ordersCount + 1):D4}";
            var researchTitleSafe = string.IsNullOrWhiteSpace(request.ResearchTitle) ? "Geral" : request.ResearchTitle;

            var order = new DigitizationOrder
            {
                Id = Guid.NewGuid(),
                OrderCode = orderCode,
                PartnerInstitutionId = tenant.Id,
                EquipmentAccessRequestId = request.Id,
                ExpectedSlidesCount = dto.ExpectedSlidesCount,
                DigitizedSlidesCount = 0,
                Status = DigitizationOrderStatus.Received,
                TechnicalNotes = $"Solicitação aprovada em {DateTime.UtcNow:dd/MM/yyyy HH:mm}. Título da Pesquisa: {researchTitleSafe}",
                RequestedAt = DateTime.UtcNow
            };
            _db.DigitizationOrders.Add(order);

            // 5. Criar Pasta de Acervo Inicial (SlideFolder)
            var folder = new SlideFolder
            {
                Id = Guid.NewGuid(),
                FolderName = $"Acervo — {researchTitleSafe[..Math.Min(30, researchTitleSafe.Length)]}",
                OwnerUserId = user.Id,
                PartnerInstitutionId = tenant.Id,
                Policy = request.RequestedStoragePolicy,
                RetentionDays = request.RequestedStoragePolicy == StoragePolicyType.PrivateTemporary ? 30 : null,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = request.RequestedStoragePolicy == StoragePolicyType.PrivateTemporary ? DateTime.UtcNow.AddDays(30) : null,
                ShareToken = Guid.NewGuid().ToString("N")
            };
            _db.SlideFolders.Add(folder);

            await _db.SaveChangesAsync();
            await transaction.CommitAsync();

            _logger.LogInformation("Solicitação de onboarding {RequestId} aprovada com sucesso. Ordem gerada: {OrderCode}", request.Id, orderCode);

            return Ok(new
            {
                Message = "Solicitação aprovada com sucesso! Conta de usuário, Instituição Parceira e Ordem de Digitalização geradas.",
                OrderCode = orderCode,
                PartnerInstitutionId = tenant.Id,
                UserId = user.Id
            });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Erro ao processar aprovação da solicitação {RequestId}", id);
            return StatusCode(500, new { Message = "Erro interno ao aprovar solicitação." });
        }
    }

    /// <summary>
    /// Rejeita a solicitação de onboarding com notas de revisão.
    /// </summary>
    [HttpPost("requests/{id:guid}/reject")]
    [Authorize(Policy = AuthPolicies.LabOperatorOrAdmin)]
    public async Task<IActionResult> RejectRequest(Guid id, [FromBody] RejectOnboardingRequestDto dto)
    {
        var request = await _db.EquipmentAccessRequests.FindAsync(id);
        if (request == null)
            return NotFound(new { Message = "Solicitação não encontrada." });

        var reviewerIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        Guid.TryParse(reviewerIdStr, out var reviewerId);

        request.Status = EquipmentRequestStatus.Rejected;
        request.ReviewNotes = dto.ReviewNotes;
        request.ReviewedAt = DateTime.UtcNow;
        request.ReviewedByUserId = reviewerId;

        await _db.SaveChangesAsync();

        _logger.LogInformation("Solicitação de onboarding {RequestId} rejeitada. Motivo: {Notes}", id, dto.ReviewNotes);

        return Ok(new { Message = "Solicitação rejeitada com sucesso." });
    }
}
