using System.Security.Claims;
using DataPath.Core.DTOs;
using DataPath.Core.Entities;
using DataPath.Core.Enums;
using DataPath.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataPath.Api.Controllers;

/// <summary>
/// Controller para Emissão, Assinatura e Download de Pareceres Médicos de 2ª Opinião (Laudos WSI).
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OpinionsController : ControllerBase
{
    private readonly DataPathDbContext _db;
    private readonly ILogger<OpinionsController> _logger;

    public OpinionsController(DataPathDbContext db, ILogger<OpinionsController> logger)
    {
        _db = db;
        _logger = logger;
    }

    /// <summary>
    /// Emite um novo parecer clínico para um Caso Clínico específico. Altera o status do caso para 'InReview' ou 'Laudado'.
    /// </summary>
    [HttpPost("cases/{caseId:guid}")]
    [Authorize(Policy = AuthPolicies.DoctorOrAdmin)]
    public async Task<IActionResult> CreateOpinion(Guid caseId, [FromBody] CreateClinicalOpinionDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var biopsyCase = await _db.BiopsyCases.FindAsync(caseId);
        if (biopsyCase == null)
            return NotFound(new { Message = "Caso clínico não encontrado." });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var opinion = new ClinicalOpinion
        {
            Id = Guid.NewGuid(),
            BiopsyCaseId = caseId,
            IssuedByUserId = userId,
            DiagnosticImpression = dto.DiagnosticImpression,
            MicroscopicDescription = dto.MicroscopicDescription,
            AdditionalComments = dto.AdditionalComments,
            PriorityLevel = dto.PriorityLevel ?? "Normal",
            IsSigned = false,
            CreatedAt = DateTime.UtcNow
        };

        _db.ClinicalOpinions.Add(opinion);

        // Atualizar status do caso para 'InReview'
        biopsyCase.Status = CaseStatus.InReview;
        biopsyCase.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        _logger.LogInformation("Parecer registrado para o caso {CaseCode} pelo médico {UserId}.", biopsyCase.InternalCaseCode, userId);

        return Ok(new
        {
            Message = "Parecer médico registrado com sucesso.",
            OpinionId = opinion.Id
        });
    }

    /// <summary>
    /// Assina digitalmente um parecer médico, concluindo o laudo e alterando o status do caso para 'Laudado'.
    /// </summary>
    [HttpPost("{opinionId:guid}/sign")]
    [Authorize(Policy = AuthPolicies.DoctorOrAdmin)]
    public async Task<IActionResult> SignOpinion(Guid opinionId)
    {
        var opinion = await _db.ClinicalOpinions
            .Include(o => o.BiopsyCase)
            .FirstOrDefaultAsync(o => o.Id == opinionId);

        if (opinion == null)
            return NotFound(new { Message = "Parecer clínico não encontrado." });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        if (opinion.IssuedByUserId != userId && !User.IsInRole("Admin"))
            return Forbid();

        opinion.IsSigned = true;
        opinion.SignedAt = DateTime.UtcNow;

        // Alterar o status do caso clínico para 'Laudado'
        opinion.BiopsyCase.Status = CaseStatus.Laudado;
        opinion.BiopsyCase.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        _logger.LogInformation("Parecer {OpinionId} assinado pelo médico {UserId}. Caso {CaseCode} marcado como Laudado.", opinionId, userId, opinion.BiopsyCase.InternalCaseCode);

        return Ok(new
        {
            Message = "Parecer assinado com sucesso. O caso clínico foi concluído como Laudado.",
            SignedAt = opinion.SignedAt
        });
    }

    /// <summary>
    /// Gera o relatório em HTML/PDF compilado do Laudo de Segunda Opinião.
    /// </summary>
    [HttpGet("cases/{caseId:guid}/report")]
    public async Task<IActionResult> GetReportHtml(Guid caseId)
    {
        var biopsyCase = await _db.BiopsyCases
            .Include(c => c.CreatedByUser)
            .Include(c => c.SlideFiles)
            .Include(c => c.Opinions)
                .ThenInclude(o => o.IssuedByUser)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == caseId);

        if (biopsyCase == null)
            return NotFound(new { Message = "Caso clínico não encontrado." });

        var latestOpinion = biopsyCase.Opinions.OrderByDescending(o => o.CreatedAt).FirstOrDefault();

        var html = $@"
<!DOCTYPE html>
<html lang=""pt-BR"">
<head>
    <meta charset=""UTF-8"">
    <title>Laudo de Segunda Opinião - {biopsyCase.InternalCaseCode}</title>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #1e293b; background: #fff; }}
        .header {{ border-bottom: 3px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }}
        .logo {{ font-size: 24px; font-weight: bold; color: #2563eb; letter-spacing: -0.5px; }}
        .badge {{ background: #e0e7ff; color: #3730a3; padding: 4px 12px; border-radius: 9999px; font-size: 14px; font-weight: 600; }}
        .section {{ margin-bottom: 24px; background: #f8fafc; padding: 16px 20px; border-radius: 8px; border-left: 4px solid #3b82f6; }}
        .section-title {{ font-size: 14px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }}
        .field-group {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px; }}
        .field-label {{ font-size: 12px; font-weight: 600; color: #475569; }}
        .field-value {{ font-size: 14px; font-weight: 500; color: #0f172a; }}
        .impression {{ background: #eff6ff; border: 1px solid #bfdbfe; font-size: 15px; font-weight: 600; color: #1e40af; padding: 16px; border-radius: 8px; line-height: 1.6; }}
        .footer {{ margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 12px; color: #94a3b8; }}
        .lgpd-notice {{ font-size: 11px; color: #64748b; margin-top: 12px; text-align: center; background: #f1f5f9; padding: 8px; border-radius: 4px; }}
    </style>
</head>
<body>
    <div class=""header"">
        <div class=""logo"">dataPATH <span style=""font-size:14px; font-weight:normal; color:#64748b;"">| Digital Pathology Mini-PACS</span></div>
        <div class=""badge"">LAUDO DE SEGUNDA OPINIÃO</div>
    </div>

    <div class=""section"">
        <div class=""section-title"">Identificação Anonimizada do Caso (LGPD)</div>
        <div class=""field-group"">
            <div><span class=""field-label"">CÓDIGO DO CASO:</span> <span class=""field-value"">{biopsyCase.InternalCaseCode}</span></div>
            <div><span class=""field-label"">SÍTIO / ÓRGÃO:</span> <span class=""field-value"">{biopsyCase.OrganSite}</span></div>
            <div><span class=""field-label"">COLORAÇÃO:</span> <span class=""field-value"">{biopsyCase.StainingType}</span></div>
            <div><span class=""field-label"">STATUS:</span> <span class=""field-value"">{biopsyCase.Status}</span></div>
            <div><span class=""field-label"">SEXO BIOLÓGICO:</span> <span class=""field-value"">{biopsyCase.PatientBiologicalSex ?? "Não informado"}</span></div>
            <div><span class=""field-label"">IDADE À BIÓPSIA:</span> <span class=""field-value"">{(biopsyCase.PatientAgeAtBiopsy.HasValue ? $"{biopsyCase.PatientAgeAtBiopsy} anos" : "Não informada")}</span></div>
        </div>
    </div>

    <div class=""section"">
        <div class=""section-title"">Resumo Clínico / Anamnese</div>
        <div class=""field-value"" style=""line-height:1.6;"">{biopsyCase.ClinicalSummary}</div>
    </div>

    {(latestOpinion != null ? $@"
    <div class=""section"" style=""border-left-color: #10b981;"">
        <div class=""section-title"" style=""color: #047857;"">Parecer Diagnóstico (Segunda Opinião)</div>
        <div class=""impression"">{latestOpinion.DiagnosticImpression}</div>

        {(string.IsNullOrEmpty(latestOpinion.MicroscopicDescription) ? "" : $@"
        <div style=""margin-top: 16px;"">
            <div class=""field-label"">DESCRIÇÃO MICROSCÓPICA:</div>
            <div class=""field-value"" style=""margin-top: 4px; line-height: 1.6;"">{latestOpinion.MicroscopicDescription}</div>
        </div>")}

        {(string.IsNullOrEmpty(latestOpinion.AdditionalComments) ? "" : $@"
        <div style=""margin-top: 12px;"">
            <div class=""field-label"">OBSERVAÇÕES COMPLEMENTARES:</div>
            <div class=""field-value"" style=""margin-top: 4px;"">{latestOpinion.AdditionalComments}</div>
        </div>")}

        <div style=""margin-top: 20px; padding-top: 12px; border-top: 1px dashed #cbd5e1; display:flex; justify-content:space-between;"">
            <div><span class=""field-label"">PATOLOGISTA RESPONSÁVEL:</span> <span class=""field-value"">{latestOpinion.IssuedByUser.FullName} ({latestOpinion.IssuedByUser.Specialty})</span></div>
            <div><span class=""field-label"">ASSINADO DIGITALMENTE:</span> <span class=""field-value"">{(latestOpinion.IsSigned ? $"Sim ({latestOpinion.SignedAt:dd/MM/yyyy HH:mm} UTC)" : "Pendente")}</span></div>
        </div>
    </div>
    " : @"
    <div class=""section"" style=""border-left-color: #f59e0b;"">
        <div class=""section-title"" style=""color: #b45309;"">Status do Parecer</div>
        <div class=""field-value"">Nenhum parecer emitido até o momento para este caso.</div>
    </div>
    ")}

    <div class=""lgpd-notice"">
        🔒 Documento em conformidade rigorosa com a LGPD (Lei nº 13.709/2018). Dados do paciente devidamente pseudonimizados.
    </div>

    <div class=""footer"">
        Plataforma dataPATH — Emissão de Segundas Opiniões em Patologia Digital WSI • Relatório Gerado em {DateTime.UtcNow:dd/MM/yyyy HH:mm:ss} UTC
    </div>
</body>
</html>
";

        return Content(html, "text/html");
    }
}
