using DataPath.Core.DTOs;
using DataPath.Core.Entities;
using DataPath.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DataPath.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewsController : ControllerBase
{
    private readonly DataPathDbContext _db;
    private readonly ILogger<NewsController> _logger;

    public NewsController(DataPathDbContext db, ILogger<NewsController> logger)
    {
        _db = db;
        _logger = logger;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllNews([FromQuery] bool includeInactive = false)
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        var isAdminOrTech = role == "Admin" || role == "TechTeam";

        var query = _db.NewsArticles
            .Include(n => n.CreatedByUser)
            .AsNoTracking();

        if (!includeInactive || !isAdminOrTech)
        {
            query = query.Where(n => n.IsActive);
        }

        var news = await query
            .OrderByDescending(n => n.PublishedAt)
            .Select(n => new NewsResponseDto
            {
                Id = n.Id,
                Title = n.Title,
                Summary = n.Summary,
                Content = n.Content,
                CoverImageUrl = n.CoverImageUrl,
                PublishedAt = n.PublishedAt,
                IsActive = n.IsActive,
                CreatedByUserId = n.CreatedByUserId,
                AuthorName = n.CreatedByUser != null ? n.CreatedByUser.FullName : "Redação DigiPath"
            })
            .ToListAsync();

        return Ok(news);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetNewsById(Guid id)
    {
        var news = await _db.NewsArticles
            .Include(n => n.CreatedByUser)
            .AsNoTracking()
            .FirstOrDefaultAsync(n => n.Id == id);

        if (news == null) return NotFound();

        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        var isAdminOrTech = role == "Admin" || role == "TechTeam";

        if (!news.IsActive && !isAdminOrTech) return NotFound();

        var dto = new NewsResponseDto
        {
            Id = news.Id,
            Title = news.Title,
            Summary = news.Summary,
            Content = news.Content,
            CoverImageUrl = news.CoverImageUrl,
            PublishedAt = news.PublishedAt,
            IsActive = news.IsActive,
            CreatedByUserId = news.CreatedByUserId,
            AuthorName = news.CreatedByUser != null ? news.CreatedByUser.FullName : "Redação DigiPath"
        };

        return Ok(dto);
    }

    [HttpPost]
    [Authorize(Policy = AuthPolicies.TechTeamOrAdmin)]
    public async Task<IActionResult> CreateNews([FromBody] CreateNewsDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId)) return Unauthorized();

        var article = new NewsArticle
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Summary = dto.Summary,
            Content = dto.Content,
            PublishedAt = DateTime.UtcNow,
            IsActive = true,
            CreatedByUserId = userId
        };

        _db.NewsArticles.Add(article);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetNewsById), new { id = article.Id }, article);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = AuthPolicies.TechTeamOrAdmin)]
    public async Task<IActionResult> UpdateNews(Guid id, [FromBody] UpdateNewsDto dto)
    {
        var article = await _db.NewsArticles.FindAsync(id);
        if (article == null) return NotFound();

        article.Title = dto.Title;
        article.Summary = dto.Summary;
        article.Content = dto.Content;
        article.IsActive = dto.IsActive;

        await _db.SaveChangesAsync();
        return Ok(article);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = AuthPolicies.TechTeamOrAdmin)]
    public async Task<IActionResult> DeleteNews(Guid id)
    {
        var article = await _db.NewsArticles.FindAsync(id);
        if (article == null) return NotFound();

        _db.NewsArticles.Remove(article);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id:guid}/upload-image")]
    [Authorize(Policy = AuthPolicies.TechTeamOrAdmin)]
    public async Task<IActionResult> UploadCoverImage(Guid id, IFormFile file, [FromServices] DataPath.Core.Interfaces.IStorageProvider storageProvider)
    {
        if (file == null || file.Length == 0) return BadRequest("Arquivo inválido.");

        var allowedExtensions = new[] { ".png", ".jpg", ".jpeg", ".webp", ".avif" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension)) return BadRequest("Formato de imagem não permitido.");

        var article = await _db.NewsArticles.FindAsync(id);
        if (article == null) return NotFound();

        var folderPath = "news-covers";
        using (var stream = file.OpenReadStream())
        {
            var storagePath = await storageProvider.SaveFileAsync(stream, file.FileName, folderPath);
            var shareLink = await storageProvider.GenerateTemporaryShareLinkAsync(storagePath, 365); // link duradouro para capas
            
            article.CoverImageUrl = shareLink;
            await _db.SaveChangesAsync();
            
            return Ok(new { CoverImageUrl = shareLink });
        }
    }
}
