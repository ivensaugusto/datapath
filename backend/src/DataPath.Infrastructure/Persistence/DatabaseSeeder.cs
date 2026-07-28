using DataPath.Core.Entities;
using DataPath.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DataPath.Infrastructure.Persistence;

/// <summary>
/// Seed de dados inicial para desenvolvimento e testes.
/// Cria: 1 usuário Admin, 1 LabOperator, 1 SpecialistDoctor,
/// 2 casos clínicos fake com lâminas e 1 parecer de exemplo.
/// Idempotente — verifica se os dados já existem antes de inserir.
/// </summary>
public static class DatabaseSeeder
{
    // IDs fixos para facilitar testes e referências cruzadas
    private static readonly Guid AdminId = Guid.Parse("a1000000-0000-0000-0000-000000000001");
    private static readonly Guid OperatorId = Guid.Parse("a2000000-0000-0000-0000-000000000002");
    private static readonly Guid DoctorId = Guid.Parse("a3000000-0000-0000-0000-000000000003");
    private static readonly Guid Case1Id = Guid.Parse("c1000000-0000-0000-0000-000000000001");
    private static readonly Guid Case2Id = Guid.Parse("c2000000-0000-0000-0000-000000000002");
    private static readonly Guid Slide1Id = Guid.Parse("d1000000-0000-0000-0000-000000000001");
    private static readonly Guid Slide2Id = Guid.Parse("d2000000-0000-0000-0000-000000000002");
    private static readonly Guid Slide3Id = Guid.Parse("d3000000-0000-0000-0000-000000000003");
    private static readonly Guid Opinion1Id = Guid.Parse("e1000000-0000-0000-0000-000000000001");

    public static async Task SeedAsync(DataPathDbContext db, ILogger logger)
    {
        // ── Verificar se já existe seed ──────────────────────────
        if (await db.Users.AnyAsync())
        {
            logger.LogInformation("🌱 Seed ignorado — banco já contém dados.");
            return;
        }

        logger.LogInformation("🌱 Iniciando seed de dados...");

        // Senha padrão para todos em dev: "DataPath@2026"
        // Gerar hash BCrypt dinamicamente (work factor 12)
        var defaultPasswordHash = BCrypt.Net.BCrypt.HashPassword("DataPath@2026", workFactor: 12);

        var admin = new User
        {
            Id = AdminId,
            FullName = "Administrador dataPATH",
            Email = "admin@datapath.local",
            PasswordHash = defaultPasswordHash,
            Role = UserRole.Admin,
            ProfessionalRegistration = null,
            Specialty = null,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var labOperator = new User
        {
            Id = OperatorId,
            FullName = "Maria Silva — Técnica de Laboratório",
            Email = "maria.silva@datapath.local",
            PasswordHash = defaultPasswordHash,
            Role = UserRole.LabOperator,
            ProfessionalRegistration = "CRBM-12345",
            Specialty = "Histotecnologia",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var specialist = new User
        {
            Id = DoctorId,
            FullName = "Dr. Carlos Mendes — Patologista",
            Email = "carlos.mendes@datapath.local",
            PasswordHash = defaultPasswordHash,
            Role = UserRole.SpecialistDoctor,
            ProfessionalRegistration = "CRM-SP 654321",
            Specialty = "Dermatopatologia",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        db.Users.AddRange(admin, labOperator, specialist);

        // ── Caso Clínico 1 — Pele (Pendente) ────────────────────
        var case1 = new BiopsyCase
        {
            Id = Case1Id,
            InternalCaseCode = "DP-2026-0001",
            OrganSite = "Pele",
            StainingType = "HE",
            ClinicalSummary = "Paciente do sexo feminino, 45 anos. Lesão pigmentada em dorso com bordas " +
                              "irregulares e crescimento recente. Hipótese clínica: melanoma vs nevo atípico. " +
                              "Biópsia excisional realizada para avaliação histopatológica.",
            Status = CaseStatus.Pending,
            PatientBiologicalSex = "F",
            PatientAgeAtBiopsy = 45,
            CreatedAt = DateTime.UtcNow.AddDays(-3),
            CreatedByUserId = OperatorId
        };

        var case2 = new BiopsyCase
        {
            Id = Case2Id,
            InternalCaseCode = "DP-2026-0002",
            OrganSite = "Mama",
            StainingType = "Imuno-histoquímica",
            ClinicalSummary = "Paciente do sexo feminino, 62 anos. Nódulo palpável em quadrante superior " +
                              "externo da mama esquerda, identificado em mamografia de rastreamento (BI-RADS 4B). " +
                              "Core biopsy realizada. Solicita-se avaliação para classificação histológica e " +
                              "painel imuno-histoquímico (RE, RP, HER2, Ki-67).",
            Status = CaseStatus.InReview,
            PatientBiologicalSex = "F",
            PatientAgeAtBiopsy = 62,
            CreatedAt = DateTime.UtcNow.AddDays(-7),
            CreatedByUserId = OperatorId
        };

        db.BiopsyCases.AddRange(case1, case2);

        // ── Lâminas WSI (arquivos simulados) ─────────────────────
        var slide1 = new SlideFile
        {
            Id = Slide1Id,
            OriginalFileName = "DP-2026-0001_HE_01.svs",
            StoragePath = "/app/storage/cases/DP-2026-0001/DP-2026-0001_HE_01.svs",
            FileSizeBytes = 1_073_741_824, // ~1 GB (tamanho típico de WSI)
            ContentType = "image/x-aperio-svs",
            FileHash = "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
            UploadedAt = DateTime.UtcNow.AddDays(-3),
            BiopsyCaseId = Case1Id
        };

        var slide2 = new SlideFile
        {
            Id = Slide2Id,
            OriginalFileName = "DP-2026-0002_IHQ_RE_01.svs",
            StoragePath = "/app/storage/cases/DP-2026-0002/DP-2026-0002_IHQ_RE_01.svs",
            FileSizeBytes = 856_000_000,
            ContentType = "image/x-aperio-svs",
            FileHash = "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3",
            UploadedAt = DateTime.UtcNow.AddDays(-7),
            BiopsyCaseId = Case2Id
        };

        var slide3 = new SlideFile
        {
            Id = Slide3Id,
            OriginalFileName = "DP-2026-0002_IHQ_HER2_02.svs",
            StoragePath = "/app/storage/cases/DP-2026-0002/DP-2026-0002_IHQ_HER2_02.svs",
            FileSizeBytes = 920_000_000,
            ContentType = "image/x-aperio-svs",
            FileHash = "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
            UploadedAt = DateTime.UtcNow.AddDays(-7),
            BiopsyCaseId = Case2Id
        };

        db.SlideFiles.AddRange(slide1, slide2, slide3);

        // ── Parecer (Caso 2 — Em revisão) ────────────────────────
        var opinion1 = new ClinicalOpinion
        {
            Id = Opinion1Id,
            DiagnosticImpression = "Carcinoma ductal invasivo, grau histológico II (Nottingham). " +
                                   "Padrão tubular/cribriforme predominante. Índice mitótico moderado.",
            MicroscopicDescription = "Fragmentos de parênquima mamário exibindo proliferação neoplásica " +
                                     "de células epiteliais com formação tubular parcial, pleomorfismo nuclear " +
                                     "moderado e figuras de mitose identificáveis (8/10 CGA). Estroma desmoplásico " +
                                     "circundante. Ausência de invasão angiolinfática nos cortes examinados.",
            AdditionalComments = "Recomenda-se complementação com painel imuno-histoquímico (RE, RP, HER2, Ki-67) " +
                                 "para definição de subtipo molecular e orientação terapêutica.",
            PriorityLevel = "Urgente",
            IsSigned = false,
            CreatedAt = DateTime.UtcNow.AddDays(-2),
            BiopsyCaseId = Case2Id,
            IssuedByUserId = DoctorId
        };

        db.ClinicalOpinions.Add(opinion1);

        // ── Salvar tudo ──────────────────────────────────────────
        await db.SaveChangesAsync();

        logger.LogInformation("🌱 Seed concluído com sucesso!");
        logger.LogInformation("   → 3 usuários: admin@datapath.local / maria.silva@datapath.local / carlos.mendes@datapath.local");
        logger.LogInformation("   → 2 casos clínicos: DP-2026-0001 (Pele/HE) e DP-2026-0002 (Mama/Imuno)");
        logger.LogInformation("   → 3 lâminas WSI simuladas");
        logger.LogInformation("   → 1 parecer clínico de exemplo");
        logger.LogInformation("   → Senha padrão para todos: DataPath@2026");
    }
}
