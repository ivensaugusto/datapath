using DataPath.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataPath.Api.Controllers;

/// <summary>
/// Controller de Logs de Auditoria LGPD — Acesso restrito a Administradores.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = AuthPolicies.AdminOnly)]
public class AuditLogsController : ControllerBase
{
    private readonly DataPathDbContext _db;

    public AuditLogsController(DataPathDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Consulta paginada dos logs de auditoria LGPD com filtros por Ação, Entidade e Usuário.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAuditLogs(
        [FromQuery] string? action,
        [FromQuery] string? entityName,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _db.AuditLogs
            .Include(a => a.User)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(action))
        {
            query = query.Where(a => a.Action.ToLower() == action.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(entityName))
        {
            query = query.Where(a => a.EntityName.ToLower() == entityName.ToLower());
        }

        var totalItems = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var logs = await query
            .OrderByDescending(a => a.Timestamp)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new
            {
                a.Id,
                a.Action,
                a.EntityName,
                a.EntityId,
                a.Details,
                a.IpAddress,
                a.UserAgent,
                a.Timestamp,
                UserName = a.User != null ? a.User.FullName : "Anônimo / Sistema",
                UserEmail = a.User != null ? a.User.Email : null
            })
            .ToListAsync();

        return Ok(new
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            CurrentPage = page,
            PageSize = pageSize,
            Items = logs
        });
    }
}
