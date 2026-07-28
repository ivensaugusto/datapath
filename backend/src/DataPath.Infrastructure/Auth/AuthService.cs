using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DataPath.Core.DTOs;
using DataPath.Core.Interfaces;
using DataPath.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace DataPath.Infrastructure.Auth;

/// <summary>
/// Serviço de autenticação com JWT + BCrypt.
/// </summary>
public class AuthService : IAuthService
{
    private readonly DataPathDbContext _db;
    private readonly IConfiguration _config;
    private readonly ILogger<AuthService> _logger;

    public AuthService(DataPathDbContext db, IConfiguration config, ILogger<AuthService> logger)
    {
        _db = db;
        _config = config;
        _logger = logger;
    }

    public async Task<LoginResponseDto?> AuthenticateAsync(LoginRequestDto request)
    {
        // Buscar usuário pelo e-mail
        var user = await _db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);

        if (user == null)
        {
            _logger.LogWarning("Login falhou: e-mail não encontrado — {Email}", request.Email);
            return null;
        }

        // Verificar senha com BCrypt
        if (!VerifyPassword(request.Password, user.PasswordHash))
        {
            _logger.LogWarning("Login falhou: senha incorreta — {Email}", request.Email);
            return null;
        }

        // Atualizar LastLoginAt
        var tracked = await _db.Users.FindAsync(user.Id);
        if (tracked != null)
        {
            tracked.LastLoginAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }

        // Gerar JWT
        var token = GenerateJwtToken(user.Id, user.Email, user.Role.ToString(), user.FullName, user.PartnerInstitutionId);
        var expirationMinutes = int.Parse(_config["Jwt:ExpirationMinutes"] ?? "480");

        _logger.LogInformation("Login bem-sucedido: {Email} ({Role})", user.Email, user.Role);

        return new LoginResponseDto
        {
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
            User = new UserInfoDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.ToString(),
                ProfessionalRegistration = user.ProfessionalRegistration,
                Specialty = user.Specialty,
                PartnerInstitutionId = user.PartnerInstitutionId
            }
        };
    }

    public string HashPassword(string plainPassword)
    {
        return BCrypt.Net.BCrypt.HashPassword(plainPassword, workFactor: 12);
    }

    public bool VerifyPassword(string plainPassword, string passwordHash)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(plainPassword, passwordHash);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao verificar hash BCrypt.");
            return false;
        }
    }

    // ── Geração do Token JWT ─────────────────────────────────────
    private string GenerateJwtToken(Guid userId, string email, string role, string fullName, Guid? partnerInstitutionId)
    {
        var secretKey = _config["Jwt:SecretKey"]
            ?? throw new InvalidOperationException("Jwt:SecretKey não configurado.");
        var issuer = _config["Jwt:Issuer"] ?? "dataPATH";
        var audience = _config["Jwt:Audience"] ?? "dataPATH-clients";
        var expirationMinutes = int.Parse(_config["Jwt:ExpirationMinutes"] ?? "480");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(ClaimTypes.Role, role),
            new Claim(ClaimTypes.Name, fullName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat,
                DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                ClaimValueTypes.Integer64)
        };

        if (partnerInstitutionId.HasValue)
        {
            claims.Add(new Claim("partner_institution_id", partnerInstitutionId.Value.ToString()));
        }

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
