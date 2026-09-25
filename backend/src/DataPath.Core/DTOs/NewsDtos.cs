using System;
using System.ComponentModel.DataAnnotations;

namespace DataPath.Core.DTOs;

public class CreateNewsDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Summary { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;
}

public class UpdateNewsDto : CreateNewsDto
{
    public bool IsActive { get; set; }
}

public class NewsResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? CoverImageUrl { get; set; }
    public DateTime PublishedAt { get; set; }
    public bool IsActive { get; set; }
    public Guid CreatedByUserId { get; set; }
    public string? AuthorName { get; set; }
}
