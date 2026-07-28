using DataPath.Core.DTOs;

namespace DataPath.Core.Interfaces;

/// <summary>
/// Contrato do serviço de autenticação.
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Autentica o usuário e retorna o token JWT.
    /// </summary>
    Task<LoginResponseDto?> AuthenticateAsync(LoginRequestDto request);

    /// <summary>
    /// Gera o hash BCrypt de uma senha em texto plano.
    /// </summary>
    string HashPassword(string plainPassword);

    /// <summary>
    /// Verifica se a senha em texto plano corresponde ao hash.
    /// </summary>
    bool VerifyPassword(string plainPassword, string passwordHash);
}
