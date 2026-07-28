namespace DataPath.Core.Enums;

/// <summary>
/// Status do laudo do caso clínico.
/// </summary>
public enum CaseStatus
{
    Pending = 0,
    InReview = 1,
    Laudado = 2,
    Reported = 2,
    ReadyForArchive = 3
}

/// <summary>
/// Perfis de acesso (RBAC) do sistema.
/// </summary>
public enum UserRole
{
    LabOperator = 0,
    SpecialistDoctor = 1,
    Admin = 2
}

/// <summary>
/// Tipo de driver de armazenamento configurado.
/// </summary>
public enum StorageDriverType
{
    Local = 0,
    Qnap = 1
}
