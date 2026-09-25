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
    /// Equipe Técnica ou Admin (CRUD de casos e onboarding).
    /// </summary>
    public const string TechTeamOrAdmin = "TechTeamOrAdmin";
    public const string LabOperatorOrAdmin = TechTeamOrAdmin;

    /// <summary>
    /// Usuário, Equipe Técnica ou Admin.
    /// </summary>
    public const string AnyAuthenticated = "AnyAuthenticated";

    /// <summary>
    /// Usuário ou Admin (emissão de pareceres e análises).
    /// </summary>
    public const string UserOrAdmin = "UserOrAdmin";
    public const string DoctorOrAdmin = UserOrAdmin;
}
