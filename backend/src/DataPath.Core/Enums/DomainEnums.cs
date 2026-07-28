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

/// <summary>
/// Tipo de instituição parceira (Tenant/Inquilino).
/// </summary>
public enum PartnerInstitutionType
{
    AcademicResearch = 0,
    ClinicalLab = 1,
    Hospital = 2,
    IndependentPathologist = 3
}

/// <summary>
/// Status da Ordem de Serviço de Digitalização de Lâminas.
/// </summary>
public enum DigitizationOrderStatus
{
    Received = 0,
    Scanning = 1,
    Completed = 2,
    Delivered = 3
}

/// <summary>
/// Política de retenção e privacidade de acervo de lâminas WSI.
/// </summary>
public enum StoragePolicyType
{
    PrivateTemporary = 0,
    PrivatePersistent = 1,
    PublicRepository = 2
}

/// <summary>
/// Modalidade acadêmica ou clínica do solicitante.
/// </summary>
public enum EquipmentModality
{
    IniciacaoCientifica = 0,
    Mestrado = 1,
    Doutorado = 2,
    PosDoc = 3,
    ParceiroClinico = 4,
    Outro = 5
}

/// <summary>
/// Status da solicitação de acesso a equipamentos e onboarding.
/// </summary>
public enum EquipmentRequestStatus
{
    Pending = 0,
    Approved = 1,
    Rejected = 2
}

