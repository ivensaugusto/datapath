using System;
using System.ComponentModel.DataAnnotations;

namespace DataPath.Core.Entities;

public class NewsArticle
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(500)]
    public string Summary { get; set; } = string.Empty;
    
    [Required]
    public string Content { get; set; } = string.Empty;
    
    public string? CoverImageUrl { get; set; }
    
    public DateTime PublishedAt { get; set; }
    
    public bool IsActive { get; set; }
    
    public Guid CreatedByUserId { get; set; }
    public User? CreatedByUser { get; set; }
}
