export type CaseStatus = "Pendente" | "Em Análise" | "Laudado" | "Arquivado";

export type Organ = "Próstata" | "Mama" | "Pulmão" | "Colo do Útero" | "Rins";
export type Stain = "HE" | "Ki-67" | "HER2" | "PAS";

export interface BiopsyCase {
  id: string;
  organ: Organ;
  stain: Stain;
  entryDate: string;
  status: CaseStatus;
  patientCode: string;
  physician: string;
  magnification: string;
  sizeGb: number;
  secondOpinion: boolean;
  anamnese: string;
  notes: { date: string; author: string; text: string }[];
}

export const cases: BiopsyCase[] = [
  {
    id: "PAT-2026-089",
    organ: "Próstata",
    stain: "HE",
    entryDate: "2026-07-28",
    status: "Em Análise",
    patientCode: "ANON-4471",
    physician: "Dra. Helena Vasconcelos",
    magnification: "40x",
    sizeGb: 3.8,
    secondOpinion: true,
    anamnese:
      "Homem, 64 anos, PSA 8,4 ng/mL em elevação progressiva. Biópsia sextante guiada por ultrassom transretal. Suspeita de adenocarcinoma acinar.",
    notes: [
      { date: "28/07 09:12", author: "Dra. Helena", text: "Fragmentos íntegros, boa fixação em formol tamponado." },
      { date: "28/07 14:40", author: "Dr. Otávio", text: "Solicitada 2ª opinião para graduação de Gleason." },
    ],
  },
  {
    id: "PAT-2026-088",
    organ: "Mama",
    stain: "HER2",
    entryDate: "2026-07-27",
    status: "Pendente",
    patientCode: "ANON-4468",
    physician: "Dr. Otávio Ramalho",
    magnification: "20x",
    sizeGb: 2.4,
    secondOpinion: false,
    anamnese:
      "Mulher, 51 anos, nódulo em quadrante superior externo, BI-RADS 4C. Core biopsy com agulha grossa 14G.",
    notes: [{ date: "27/07 08:05", author: "Recepção", text: "Amostra recebida e digitalizada em 20x." }],
  },
  {
    id: "PAT-2026-087",
    organ: "Pulmão",
    stain: "Ki-67",
    entryDate: "2026-07-26",
    status: "Laudado",
    patientCode: "ANON-4460",
    physician: "Dra. Camila Prado",
    magnification: "40x",
    sizeGb: 5.1,
    secondOpinion: false,
    anamnese: "Homem, 70 anos, tabagista, massa em lobo superior direito. Biópsia transbrônquica.",
    notes: [{ date: "26/07 17:20", author: "Dra. Camila", text: "Índice proliferativo elevado (Ki-67 ~45%)." }],
  },
  {
    id: "PAT-2026-086",
    organ: "Colo do Útero",
    stain: "HE",
    entryDate: "2026-07-25",
    status: "Em Análise",
    patientCode: "ANON-4455",
    physician: "Dra. Helena Vasconcelos",
    magnification: "20x",
    sizeGb: 1.9,
    secondOpinion: true,
    anamnese: "Mulher, 38 anos, citologia com HSIL. Conização a frio para avaliação de margens.",
    notes: [{ date: "25/07 11:02", author: "Dra. Helena", text: "Margens endocervicais a confirmar em cortes seriados." }],
  },
  {
    id: "PAT-2026-085",
    organ: "Rins",
    stain: "PAS",
    entryDate: "2026-07-24",
    status: "Arquivado",
    patientCode: "ANON-4449",
    physician: "Dr. Marcelo Bastos",
    magnification: "40x",
    sizeGb: 4.3,
    secondOpinion: false,
    anamnese: "Mulher, 46 anos, proteinúria nefrótica. Biópsia renal percutânea, 18 glomérulos.",
    notes: [{ date: "24/07 15:31", author: "Dr. Marcelo", text: "Membranas basais espessadas, PAS positivo difuso." }],
  },
  {
    id: "PAT-2026-084",
    organ: "Mama",
    stain: "Ki-67",
    entryDate: "2026-07-23",
    status: "Laudado",
    patientCode: "ANON-4441",
    physician: "Dr. Otávio Ramalho",
    magnification: "20x",
    sizeGb: 2.8,
    secondOpinion: true,
    anamnese: "Mulher, 59 anos, carcinoma ductal invasivo previamente diagnosticado. Painel prognóstico.",
    notes: [{ date: "23/07 10:44", author: "Dr. Otávio", text: "Laudo emitido e assinado digitalmente." }],
  },
  {
    id: "PAT-2026-083",
    organ: "Próstata",
    stain: "HE",
    entryDate: "2026-07-22",
    status: "Pendente",
    patientCode: "ANON-4436",
    physician: "Dra. Camila Prado",
    magnification: "40x",
    sizeGb: 3.2,
    secondOpinion: false,
    anamnese: "Homem, 58 anos, rastreamento de rotina com toque retal alterado.",
    notes: [],
  },
  {
    id: "PAT-2026-082",
    organ: "Pulmão",
    stain: "PAS",
    entryDate: "2026-07-21",
    status: "Em Análise",
    patientCode: "ANON-4430",
    physician: "Dr. Marcelo Bastos",
    magnification: "20x",
    sizeGb: 6.0,
    secondOpinion: true,
    anamnese: "Homem, 44 anos, quadro intersticial difuso. Pesquisa de material PAS-positivo alveolar.",
    notes: [],
  },
];

export const organs: Organ[] = ["Próstata", "Mama", "Pulmão", "Colo do Útero", "Rins"];
export const stains: Stain[] = ["HE", "Ki-67", "HER2", "PAS"];
export const caseStatuses: CaseStatus[] = ["Pendente", "Em Análise", "Laudado", "Arquivado"];

export const fmtDate = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

export interface PartnerApplication {
  id: string;
  researcher: string;
  document: string;
  bond: "Iniciação Científica" | "Mestrado" | "Doutorado" | "Pós-Doc";
  institution: string;
  equipment: string;
  cepNumber: string;
  cepValidity: string;
  samples: number;
  species: string;
  submitted: string;
  status: "Em Análise" | "Aprovado" | "Rejeitado";
  quotaUsed: number;
  quotaTotal: number;
}

export const applications: PartnerApplication[] = [
  {
    id: "ONB-2026-041",
    researcher: "Larissa Meneghetti",
    document: "412.889.330-05",
    bond: "Doutorado",
    institution: "UFRGS — Instituto de Ciências Básicas da Saúde",
    equipment: "Scanner de Lâminas 3DHISTECH",
    cepNumber: "CEP 7.884.109",
    cepValidity: "2027-03-30",
    samples: 240,
    species: "Rattus norvegicus",
    submitted: "2026-07-26",
    status: "Em Análise",
    quotaUsed: 0,
    quotaTotal: 300,
  },
  {
    id: "ONB-2026-040",
    researcher: "Thiago Albuquerque",
    document: "18.774.220/0001-63",
    bond: "Pós-Doc",
    institution: "USP — Faculdade de Medicina de Ribeirão Preto",
    equipment: "PCR Real-Time 7500 StepOne",
    cepNumber: "CEUA 221/2026",
    cepValidity: "2026-12-15",
    samples: 96,
    species: "Homo sapiens (amostras anonimizadas)",
    submitted: "2026-07-22",
    status: "Aprovado",
    quotaUsed: 61,
    quotaTotal: 120,
  },
  {
    id: "ONB-2026-039",
    researcher: "Beatriz Nakamura",
    document: "339.104.772-18",
    bond: "Mestrado",
    institution: "UNICAMP — Biologia Celular",
    equipment: "Scanner de Lâminas 3DHISTECH",
    cepNumber: "CEUA 118/2026",
    cepValidity: "2026-09-01",
    samples: 60,
    species: "Mus musculus",
    submitted: "2026-07-19",
    status: "Rejeitado",
    quotaUsed: 0,
    quotaTotal: 60,
  },
  {
    id: "ONB-2026-038",
    researcher: "Rodrigo Sampaio",
    document: "902.331.884-44",
    bond: "Iniciação Científica",
    institution: "UFMG — Departamento de Patologia Geral",
    equipment: "PCR Real-Time 7500 StepOne",
    cepNumber: "CEP 6.552.771",
    cepValidity: "2027-01-20",
    samples: 48,
    species: "Homo sapiens (amostras anonimizadas)",
    submitted: "2026-07-15",
    status: "Aprovado",
    quotaUsed: 12,
    quotaTotal: 80,
  },
];

export interface AuditLog {
  id: string;
  datetime: string;
  user: string;
  profile: "Admin" | "Patologista" | "Pesquisador";
  action: "Acesso a Lâmina" | "Upload WSI" | "Emissão de Laudo" | "Download de PDF" | "Aprovação de Parceiro";
  ip: string;
  resource: string;
}

export const auditLogs: AuditLog[] = [
  { id: "LG-9921", datetime: "29/07/2026 08:14:02", user: "helena.v@datapath.health", profile: "Patologista", action: "Acesso a Lâmina", ip: "189.44.120.11", resource: "#PAT-2026-089" },
  { id: "LG-9920", datetime: "29/07/2026 08:02:47", user: "sistema@datapath.health", profile: "Admin", action: "Upload WSI", ip: "10.0.4.19", resource: "#PAT-2026-089 · 3.8 GB" },
  { id: "LG-9919", datetime: "28/07/2026 19:33:10", user: "otavio.r@datapath.health", profile: "Patologista", action: "Emissão de Laudo", ip: "201.17.88.203", resource: "#PAT-2026-084" },
  { id: "LG-9918", datetime: "28/07/2026 17:20:55", user: "camila.p@datapath.health", profile: "Patologista", action: "Download de PDF", ip: "177.92.14.60", resource: "#PAT-2026-087" },
  { id: "LG-9917", datetime: "28/07/2026 15:05:31", user: "admin@datapath.health", profile: "Admin", action: "Aprovação de Parceiro", ip: "10.0.4.2", resource: "ONB-2026-040" },
  { id: "LG-9916", datetime: "28/07/2026 11:48:09", user: "larissa.m@ufrgs.br", profile: "Pesquisador", action: "Upload WSI", ip: "143.54.2.77", resource: "Lote 12 · 18 lâminas" },
  { id: "LG-9915", datetime: "27/07/2026 22:11:44", user: "marcelo.b@datapath.health", profile: "Patologista", action: "Acesso a Lâmina", ip: "191.30.77.5", resource: "#PAT-2026-085" },
  { id: "LG-9914", datetime: "27/07/2026 16:29:03", user: "otavio.r@datapath.health", profile: "Patologista", action: "Acesso a Lâmina", ip: "201.17.88.203", resource: "#PAT-2026-088" },
];
