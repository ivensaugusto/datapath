using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable enable

namespace DataPath.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ── users ────────────────────────────────────────────
            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    FullName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "character varying(254)", maxLength: 254, nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Role = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ProfessionalRegistration = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Specialty = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    LastLoginAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                table: "users",
                column: "Email",
                unique: true);

            // ── biopsy_cases ─────────────────────────────────────
            migrationBuilder.CreateTable(
                name: "biopsy_cases",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    InternalCaseCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    OrganSite = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    StainingType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ClinicalSummary = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Pending"),
                    PatientBiologicalSex = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    PatientAgeAtBiopsy = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_biopsy_cases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_biopsy_cases_users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(name: "IX_biopsy_cases_InternalCaseCode", table: "biopsy_cases", column: "InternalCaseCode", unique: true);
            migrationBuilder.CreateIndex(name: "IX_biopsy_cases_Status", table: "biopsy_cases", column: "Status");
            migrationBuilder.CreateIndex(name: "IX_biopsy_cases_OrganSite", table: "biopsy_cases", column: "OrganSite");
            migrationBuilder.CreateIndex(name: "IX_biopsy_cases_CreatedAt", table: "biopsy_cases", column: "CreatedAt");
            migrationBuilder.CreateIndex(name: "IX_biopsy_cases_CreatedByUserId", table: "biopsy_cases", column: "CreatedByUserId");

            // ── slide_files ──────────────────────────────────────
            migrationBuilder.CreateTable(
                name: "slide_files",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    OriginalFileName = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    StoragePath = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    FileSizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    ContentType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    FileHash = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    TemporaryShareLink = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    ShareLinkExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    BiopsyCaseId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_slide_files", x => x.Id);
                    table.ForeignKey(
                        name: "FK_slide_files_biopsy_cases_BiopsyCaseId",
                        column: x => x.BiopsyCaseId,
                        principalTable: "biopsy_cases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(name: "IX_slide_files_BiopsyCaseId", table: "slide_files", column: "BiopsyCaseId");

            // ── clinical_opinions ────────────────────────────────
            migrationBuilder.CreateTable(
                name: "clinical_opinions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    DiagnosticImpression = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    MicroscopicDescription = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    AdditionalComments = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    PriorityLevel = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    IsSigned = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    SignedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    BiopsyCaseId = table.Column<Guid>(type: "uuid", nullable: false),
                    IssuedByUserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clinical_opinions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_clinical_opinions_biopsy_cases_BiopsyCaseId",
                        column: x => x.BiopsyCaseId,
                        principalTable: "biopsy_cases",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_clinical_opinions_users_IssuedByUserId",
                        column: x => x.IssuedByUserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(name: "IX_clinical_opinions_BiopsyCaseId", table: "clinical_opinions", column: "BiopsyCaseId");
            migrationBuilder.CreateIndex(name: "IX_clinical_opinions_IssuedByUserId", table: "clinical_opinions", column: "IssuedByUserId");

            // ── audit_logs ───────────────────────────────────────
            migrationBuilder.CreateTable(
                name: "audit_logs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Action = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    EntityName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    EntityId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Details = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    IpAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: false),
                    UserAgent = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audit_logs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_audit_logs_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(name: "IX_audit_logs_Timestamp", table: "audit_logs", column: "Timestamp");
            migrationBuilder.CreateIndex(name: "IX_audit_logs_UserId", table: "audit_logs", column: "UserId");
            migrationBuilder.CreateIndex(name: "IX_audit_logs_EntityName_EntityId", table: "audit_logs", columns: new[] { "EntityName", "EntityId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "audit_logs");
            migrationBuilder.DropTable(name: "clinical_opinions");
            migrationBuilder.DropTable(name: "slide_files");
            migrationBuilder.DropTable(name: "biopsy_cases");
            migrationBuilder.DropTable(name: "users");
        }
    }
}
