using Microsoft.AspNetCore.Mvc;

namespace DataPath.Api.Controllers;

/// <summary>
/// Health check endpoint para verificar se a API está operacional.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    /// <summary>
    /// Verifica se a API está respondendo.
    /// </summary>
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            Status = "Healthy",
            Service = "dataPATH API",
            Version = "1.0.0-mvp",
            Timestamp = DateTime.UtcNow
        });
    }
}
