import type { AuthResponse, BiopsyCaseDetail, BiopsyCaseSummary, AuditLog } from '../types/api';

const API_BASE_URL = typeof window !== 'undefined' && window.location.port === '5173'
  ? 'http://localhost:5000/api'
  : '/api';

const getHeaders = () => {
  const token = localStorage.getItem('datapath_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Credenciais inválidas');
    }

    return res.json();
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Não autenticado');
    return res.json();
  },

  async getCases(params?: { organSite?: string; status?: string; search?: string; page?: number }) {
    const query = new URLSearchParams();
    if (params?.organSite) query.append('organSite', params.organSite);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());

    const res = await fetch(`${API_BASE_URL}/cases?${query.toString()}`, {
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error('Erro ao carregar casos clínicos');
    return res.json() as Promise<{
      totalItems: number;
      totalPages: number;
      currentPage: number;
      items: BiopsyCaseSummary[];
    }>;
  },

  async getCaseById(id: string): Promise<BiopsyCaseDetail> {
    const res = await fetch(`${API_BASE_URL}/cases/${id}`, {
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error('Caso não encontrado');
    return res.json();
  },

  async createCase(data: {
    organSite: string;
    stainingType: string;
    clinicalSummary: string;
    patientBiologicalSex?: string;
    patientAgeAtBiopsy?: number;
  }) {
    const res = await fetch(`${API_BASE_URL}/cases`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Erro ao cadastrar caso');
    }

    return res.json();
  },

  async uploadSlide(caseId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('datapath_token');
    const res = await fetch(`${API_BASE_URL}/cases/${caseId}/slides`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Erro ao fazer upload da lâmina WSI');
    }

    return res.json();
  },

  async createOpinion(caseId: string, data: {
    diagnosticImpression: string;
    microscopicDescription?: string;
    additionalComments?: string;
    priorityLevel?: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/opinions/cases/${caseId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Erro ao emitir parecer');
    }

    return res.json();
  },

  async signOpinion(opinionId: string) {
    const res = await fetch(`${API_BASE_URL}/opinions/${opinionId}/sign`, {
      method: 'POST',
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error('Erro ao assinar parecer');
    return res.json();
  },

  async getAuditLogs(page = 1) {
    const res = await fetch(`${API_BASE_URL}/auditlogs?page=${page}`, {
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error('Erro ao carregar logs de auditoria');
    return res.json() as Promise<{
      totalItems: number;
      totalPages: number;
      items: AuditLog[];
    }>;
  },

  getReportUrl(caseId: string) {
    return `${API_BASE_URL}/opinions/cases/${caseId}/report`;
  }
};
