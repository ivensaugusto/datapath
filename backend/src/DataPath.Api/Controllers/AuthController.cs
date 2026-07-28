using DataPath.Core.DTOs;
using DataPath.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DataPath.Api.Controllers;

/// <summary>
/// Controller de autenticação — login e dados do usuário logado.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Realiza login e retorna o token JWT.
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _authService.AuthenticateAsync(request);

        if (result == null)
            return Unauthorized(new { Message = "E-mail ou senha inválidos." });

        return Ok(result);
    }

    /// <summary>
    /// Retorna os dados do usuário autenticado (requer token JWT válido).
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                     ?? User.FindFirst("sub")?.Value;
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
                    ?? User.FindFirst("email")?.Value;
        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        var name = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;

        return Ok(new UserInfoDto
        {
            Id = Guid.TryParse(userId, out var id) ? id : Guid.Empty,
            Email = email ?? "",
            FullName = name ?? "",
            Role = role ?? ""
        });
    }
}
