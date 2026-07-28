using System.Text;
using DataPath.Api;
using DataPath.Api.Middlewares;
using DataPath.Core.Interfaces;
using DataPath.Infrastructure.Auth;
using DataPath.Infrastructure.Persistence;
using DataPath.Infrastructure.Storage;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ── Banco de Dados (PostgreSQL) ──────────────────────────────────
builder.Services.AddDbContext<DataPathDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── Storage Provider (Strategy Pattern via appsettings) ──────────
var storageType = builder.Configuration["Storage:DriverType"] ?? "Local";
if (storageType == "Local")
{
    var basePath = builder.Configuration["Storage:LocalBasePath"] ?? "/app/storage";
    builder.Services.AddScoped<IStorageProvider>(_ => new LocalFileSystemDriver(basePath));
}
else
{
    builder.Services.AddScoped<IStorageProvider, QnapRestApiDriver>();
}

// ── Serviços de Autenticação & Background ─────────────────────────
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddHostedService<DataPath.Infrastructure.BackgroundServices.CaseRetentionBackgroundService>();

// ── JWT Authentication ───────────────────────────────────────────
var jwtSecretKey = builder.Configuration["Jwt:SecretKey"]
    ?? throw new InvalidOperationException("Jwt:SecretKey não configurado no appsettings.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "dataPATH";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "dataPATH-clients";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey)),
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(2)
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AuthPolicies.AdminOnly, policy =>
        policy.RequireRole("Admin"));

    options.AddPolicy(AuthPolicies.LabOperatorOrAdmin, policy =>
        policy.RequireRole("LabOperator", "Admin"));

    options.AddPolicy(AuthPolicies.DoctorOrAdmin, policy =>
        policy.RequireRole("SpecialistDoctor", "Admin"));

    options.AddPolicy(AuthPolicies.AnyAuthenticated, policy =>
        policy.RequireRole("LabOperator", "SpecialistDoctor", "Admin"));
});

// ── CORS (permitir Frontend React em dev) ────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                ?? new[] { "http://localhost:5173" })
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// ── Controllers + Swagger (com suporte JWT) ──────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "dataPATH API",
        Version = "v1",
        Description = "Plataforma de Patologia Digital — Mini-PACS para compartilhamento seguro de WSI"
    });

    // Configurar botão "Authorize" no Swagger para JWT
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Insira o token JWT no formato: Bearer {seu_token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ── Auto-migrate + Seed em Development ───────────────────────────
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<DataPathDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<DataPathDbContext>>();

    db.Database.Migrate();
    app.Logger.LogInformation("✅ Database migrations applied successfully.");

    await DatabaseSeeder.SeedAsync(db, logger);
}

// ── Pipeline HTTP ────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "dataPATH API v1"));
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.UseAuditLog();
app.MapControllers();

app.Run();
