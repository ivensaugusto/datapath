namespace DataPath.Api;

/// <summary>
/// Constantes de políticas de autorização RBAC.
/// Usadas com [Authorize(Policy = "...")] nos Controllers.
/// </summary>
public static class AuthPolicies
{
    /// <summary>
    /// Apenas Admin tem acesso.
    /// </summary>
    public const string AdminOnly = "AdminOnly";

    /// <summary>
    /// LabOperator ou Admin (CRUD completo de casos).
    /// </summary>
    public const string LabOperatorOrAdmin = "LabOperatorOrAdmin";

    /// <summary>
    /// SpecialistDoctor, LabOperator ou Admin (leitura de casos + emissão de parecer).
    /// </summary>
    public const string AnyAuthenticated = "AnyAuthenticated";

    /// <summary>
    /// Apenas SpecialistDoctor ou Admin (emissão de pareceres).
    /// </summary>
    public const string DoctorOrAdmin = "DoctorOrAdmin";
}
