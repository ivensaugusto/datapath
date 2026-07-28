using DataPath.Core.Entities;
using DataPath.Core.Enums;
using DataPath.Infrastructure.Auth;
using DataPath.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace DataPath.Tests;

public class AuthServiceTests
{
    private DataPathDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<DataPathDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new DataPathDbContext(options);
    }

    private IConfiguration GetMockConfiguration()
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            {"Jwt:SecretKey", "SuperSecretKeyForDataPathUnitTesting2026_LGPD_Strict"},
            {"Jwt:Issuer", "dataPATH-Test"},
            {"Jwt:Audience", "dataPATH-Clients-Test"},
            {"Jwt:ExpirationMinutes", "60"}
        };

        return new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();
    }

    [Fact]
    public void HashPassword_And_VerifyPassword_ShouldMatchCorrectly()
    {
        // Arrange
        using var db = GetInMemoryDbContext();
        var logger = new Mock<ILogger<AuthService>>().Object;
        var authService = new AuthService(db, GetMockConfiguration(), logger);
        const string plainPassword = "TestPassword@2026";

        // Act
        var hash = authService.HashPassword(plainPassword);
        var isValid = authService.VerifyPassword(plainPassword, hash);
        var isInvalid = authService.VerifyPassword("WrongPassword", hash);

        // Assert
        Assert.NotNull(hash);
        Assert.True(isValid);
        Assert.False(isInvalid);
    }

    [Fact]
    public async Task AuthenticateAsync_ValidCredentials_ReturnsJwtTokenAndUser()
    {
        // Arrange
        using var db = GetInMemoryDbContext();
        var logger = new Mock<ILogger<AuthService>>().Object;
        var authService = new AuthService(db, GetMockConfiguration(), logger);

        const string password = "SecretPassword123";
        var passwordHash = authService.HashPassword(password);

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "doctor@test.com",
            FullName = "Dr. Test Pathologist",
            PasswordHash = passwordHash,
            Role = UserRole.SpecialistDoctor,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        // Act
        var result = await authService.AuthenticateAsync(new Core.DTOs.LoginRequestDto
        {
            Email = "doctor@test.com",
            Password = password
        });

        // Assert
        Assert.NotNull(result);
        Assert.NotNull(result.Token);
        Assert.Equal("doctor@test.com", result.User.Email);
        Assert.Equal("SpecialistDoctor", result.User.Role);
    }
}
