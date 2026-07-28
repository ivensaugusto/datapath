using System.ComponentModel.DataAnnotations;

namespace DataPath.Core.DTOs;

/// <summary>
/// Requisição de login.
/// </summary>
public class LoginRequestDto
{
    [Required(ErrorMessage = "E-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "E-mail inválido.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Senha é obrigatória.")]
    [MinLength(8, ErrorMessage = "Senha deve ter no mínimo 8 caracteres.")]
    public string Password { get; set; } = string.Empty;
}

/// <summary>
/// Resposta de login com token JWT.
/// </summary>
public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserInfoDto User { get; set; } = null!;
}

/// <summary>
/// Dados públicos do usuário logado (sem PasswordHash).
/// </summary>
public class UserInfoDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? ProfessionalRegistration { get; set; }
    public string? Specialty { get; set; }
}
