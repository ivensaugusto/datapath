using DataPath.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataPath.Infrastructure.Persistence;

/// <summary>
/// DbContext principal do dataPATH.
/// Configuração via Fluent API para máximo controle sobre o schema PostgreSQL.
/// </summary>
public class DataPathDbContext : DbContext
{
    public DataPathDbContext(DbContextOptions<DataPathDbContext> options) : base(options)
    {
    }

    // ── DbSets ───────────────────────────────────────────────────
    public DbSet<User> Users => Set<User>();
    public DbSet<BiopsyCase> BiopsyCases => Set<BiopsyCase>();
    public DbSet<SlideFile> SlideFiles => Set<SlideFile>();
    public DbSet<ClinicalOpinion> ClinicalOpinions => Set<ClinicalOpinion>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<PartnerInstitution> PartnerInstitutions => Set<PartnerInstitution>();
    public DbSet<DigitizationOrder> DigitizationOrders => Set<DigitizationOrder>();
    public DbSet<SlideFolder> SlideFolders => Set<SlideFolder>();
    public DbSet<EquipmentAccessRequest> EquipmentAccessRequests => Set<EquipmentAccessRequest>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── PartnerInstitution ───────────────────────────────────
        modelBuilder.Entity<PartnerInstitution>(entity =>
        {
            entity.ToTable("partner_institutions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

            entity.Property(e => e.CorporateName)
                .IsRequired()
                .HasMaxLength(250);

            entity.Property(e => e.TradeName)
                .IsRequired()
                .HasMaxLength(250);

            entity.Property(e => e.DocumentNumber)
                .IsRequired()
                .HasMaxLength(30);
            entity.HasIndex(e => e.DocumentNumber);

            entity.Property(e => e.ContactEmail)
                .IsRequired()
                .HasMaxLength(254);

            entity.Property(e => e.ContactPhone)
                .HasMaxLength(50);

            entity.Property(e => e.Type)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(50);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("NOW()");
        });

        // ── User ─────────────────────────────────────────────────
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(254);
            entity.HasIndex(e => e.Email).IsUnique();

            entity.Property(e => e.PasswordHash)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(e => e.Role)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(50);

            entity.Property(e => e.ProfessionalRegistration)
                .HasMaxLength(50);

            entity.Property(e => e.Specialty)
                .HasMaxLength(100);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("NOW()");

            // FK: User → PartnerInstitution (Multi-Tenant)
            entity.HasOne(e => e.PartnerInstitution)
                .WithMany(p => p.Users)
                .HasForeignKey(e => e.PartnerInstitutionId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ── SlideFolder ──────────────────────────────────────────
        modelBuilder.Entity<SlideFolder>(entity =>
        {
            entity.ToTable("slide_folders");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

            entity.Property(e => e.FolderName)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Policy)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(50);

            entity.Property(e => e.ShareToken)
                .IsRequired()
                .HasMaxLength(100);
            entity.HasIndex(e => e.ShareToken).IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("NOW()");

            // FK: SlideFolder → OwnerUser
            entity.HasOne(e => e.OwnerUser)
                .WithMany(u => u.OwnedSlideFolders)
                .HasForeignKey(e => e.OwnerUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // FK: SlideFolder → PartnerInstitution
            entity.HasOne(e => e.PartnerInstitution)
                .WithMany(p => p.SlideFolders)
                .HasForeignKey(e => e.PartnerInstitutionId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ── BiopsyCase ───────────────────────────────────────────
        modelBuilder.Entity<BiopsyCase>(entity =>
        {
            entity.ToTable("biopsy_cases");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

            entity.Property(e => e.InternalCaseCode)
                .IsRequired()
                .HasMaxLength(50);
            entity.HasIndex(e => e.InternalCaseCode).IsUnique();

            entity.Property(e => e.OrganSite)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.StainingType)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.ClinicalSummary)
                .IsRequired()
                .HasMaxLength(4000);

            entity.Property(e => e.Status)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(50)
                .HasDefaultValue(Core.Enums.CaseStatus.Pending);

            entity.Property(e => e.PatientBiologicalSex)
                .HasMaxLength(10);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("NOW()");

            // FK: Caso → Operador que criou
            entity.HasOne(e => e.CreatedByUser)
                .WithMany(u => u.CreatedCases)
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // FK: Caso → PartnerInstitution (Multi-Tenant)
            entity.HasOne(e => e.PartnerInstitution)
                .WithMany(p => p.BiopsyCases)
                .HasForeignKey(e => e.PartnerInstitutionId)
                .OnDelete(DeleteBehavior.SetNull);

            // FK: Caso → Médico Atribuído
            entity.HasOne(e => e.AssignedDoctor)
                .WithMany()
                .HasForeignKey(e => e.AssignedDoctorId)
                .OnDelete(DeleteBehavior.SetNull);

            // FK: Caso → SlideFolder
            entity.HasOne(e => e.SlideFolder)
                .WithMany(f => f.BiopsyCases)
                .HasForeignKey(e => e.SlideFolderId)
                .OnDelete(DeleteBehavior.SetNull);

            // Índices compostos para filtros do Dashboard
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.OrganSite);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.PartnerInstitutionId);
        });

        // ── SlideFile ────────────────────────────────────────────
        modelBuilder.Entity<SlideFile>(entity =>
        {
            entity.ToTable("slide_files");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

            entity.Property(e => e.OriginalFileName)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(e => e.StoragePath)
                .IsRequired()
                .HasMaxLength(1000);

            entity.Property(e => e.ContentType)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.FileHash)
                .HasMaxLength(128);

            entity.Property(e => e.TemporaryShareLink)
                .HasMaxLength(2000);

            entity.Property(e => e.UploadedAt)
                .HasDefaultValueSql("NOW()");

            // FK: Arquivo → Caso
            entity.HasOne(e => e.BiopsyCase)
                .WithMany(c => c.SlideFiles)
                .HasForeignKey(e => e.BiopsyCaseId)
                .OnDelete(DeleteBehavior.Cascade);

            // FK: Arquivo → SlideFolder
            entity.HasOne(e => e.SlideFolder)
                .WithMany(f => f.SlideFiles)
                .HasForeignKey(e => e.SlideFolderId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ── ClinicalOpinion ──────────────────────────────────────
        modelBuilder.Entity<ClinicalOpinion>(entity =>
        {
            entity.ToTable("clinical_opinions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

            entity.Property(e => e.DiagnosticImpression)
                .IsRequired()
                .HasMaxLength(4000);

            entity.Property(e => e.MicroscopicDescription)
                .HasMaxLength(4000);

            entity.Property(e => e.AdditionalComments)
                .HasMaxLength(2000);

            entity.Property(e => e.PriorityLevel)
                .HasMaxLength(50);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("NOW()");

            // FK: Parecer → Caso
            entity.HasOne(e => e.BiopsyCase)
                .WithMany(c => c.Opinions)
                .HasForeignKey(e => e.BiopsyCaseId)
                .OnDelete(DeleteBehavior.Cascade);

            // FK: Parecer → Médico especialista
            entity.HasOne(e => e.IssuedByUser)
                .WithMany(u => u.IssuedOpinions)
                .HasForeignKey(e => e.IssuedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ── EquipmentAccessRequest ────────────────────────────────
        modelBuilder.Entity<EquipmentAccessRequest>(entity =>
        {
            entity.ToTable("equipment_access_requests");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(254);

            entity.Property(e => e.Phone)
                .HasMaxLength(50);

            entity.Property(e => e.InstitutionAndDepartment)
                .IsRequired()
                .HasMaxLength(250);

            entity.Property(e => e.Modality)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(50);

            entity.Property(e => e.ResearchTitle)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(e => e.EthicsDocumentPathsJson)
                .HasMaxLength(4000);

            entity.Property(e => e.RequestedStoragePolicy)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(50);

            entity.Property(e => e.Status)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(50)
                .HasDefaultValue(Core.Enums.EquipmentRequestStatus.Pending);

            entity.Property(e => e.ReviewNotes)
                .HasMaxLength(2000);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("NOW()");

            // FK: Solicitacao → Avaliador
            entity.HasOne(e => e.ReviewedByUser)
                .WithMany()
                .HasForeignKey(e => e.ReviewedByUserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ── DigitizationOrder ────────────────────────────────────
        modelBuilder.Entity<DigitizationOrder>(entity =>
        {
            entity.ToTable("digitization_orders");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

            entity.Property(e => e.OrderCode)
                .IsRequired()
                .HasMaxLength(50);
            entity.HasIndex(e => e.OrderCode).IsUnique();

            entity.Property(e => e.Status)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(50)
                .HasDefaultValue(Core.Enums.DigitizationOrderStatus.Received);

            entity.Property(e => e.TechnicalNotes)
                .HasMaxLength(2000);

            entity.Property(e => e.RequestedAt)
                .HasDefaultValueSql("NOW()");

            // FK: Ordem → PartnerInstitution
            entity.HasOne(e => e.PartnerInstitution)
                .WithMany(p => p.DigitizationOrders)
                .HasForeignKey(e => e.PartnerInstitutionId)
                .OnDelete(DeleteBehavior.Cascade);

            // FK: Ordem → EquipmentAccessRequest
            entity.HasOne(e => e.EquipmentAccessRequest)
                .WithMany(r => r.DigitizationOrders)
                .HasForeignKey(e => e.EquipmentAccessRequestId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ── AuditLog ─────────────────────────────────────────────
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.ToTable("audit_logs");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

            entity.Property(e => e.Action)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.EntityName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.EntityId)
                .HasMaxLength(100);

            entity.Property(e => e.Details)
                .HasMaxLength(2000);

            entity.Property(e => e.IpAddress)
                .IsRequired()
                .HasMaxLength(45); // IPv6 max length

            entity.Property(e => e.UserAgent)
                .HasMaxLength(500);

            entity.Property(e => e.Timestamp)
                .HasDefaultValueSql("NOW()");

            // FK: Log → Usuário (opcional para ações de sistema)
            entity.HasOne(e => e.User)
                .WithMany(u => u.AuditLogs)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Índices para consultas de auditoria
            entity.HasIndex(e => e.Timestamp);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => new { e.EntityName, e.EntityId });
        });
    }

}
