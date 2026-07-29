export type TicketStatus = "Pendente" | "Em Atendimento" | "Aguardando Usuário" | "Concluído";

export interface Ticket {
  id: string;
  assunto: string;
  status: TicketStatus;
  abertura: string; // ISO
  prazo: string; // ISO
  solicitante: string;
  setor: string;
}

const h = (n: number) => new Date(Date.now() + n * 3600_000).toISOString();

export const tickets: Ticket[] = [
  { id: "#10482", assunto: "Impressora do setor Fiscal sem conexão de rede", status: "Pendente", abertura: h(-3), prazo: h(-1), solicitante: "Marina Duarte", setor: "Fiscal" },
  { id: "#10481", assunto: "Solicitação de acesso ao ERP - novo colaborador", status: "Em Atendimento", abertura: h(-6), prazo: h(4), solicitante: "Rafael Andrade", setor: "RH" },
  { id: "#10480", assunto: "Notebook não inicializa após atualização", status: "Pendente", abertura: h(-9), prazo: h(2), solicitante: "Camila Rocha", setor: "Comercial" },
  { id: "#10479", assunto: "VPN instável no home office", status: "Aguardando Usuário", abertura: h(-14), prazo: h(10), solicitante: "Bruno Teixeira", setor: "Engenharia" },
  { id: "#10478", assunto: "Troca de toner - recepção", status: "Concluído", abertura: h(-20), prazo: h(-4), solicitante: "Patrícia Lima", setor: "Administrativo" },
  { id: "#10477", assunto: "Erro 500 no portal de notas fiscais", status: "Em Atendimento", abertura: h(-22), prazo: h(-2), solicitante: "Diego Marques", setor: "Financeiro" },
  { id: "#10476", assunto: "Criação de caixa de e-mail corporativa", status: "Pendente", abertura: h(-26), prazo: h(22), solicitante: "Letícia Souza", setor: "RH" },
  { id: "#10475", assunto: "Backup do servidor de arquivos falhou", status: "Em Atendimento", abertura: h(-30), prazo: h(1), solicitante: "Infra Monitoramento", setor: "TI" },
  { id: "#10474", assunto: "Reset de senha do Active Directory", status: "Concluído", abertura: h(-34), prazo: h(-10), solicitante: "Gustavo Pinho", setor: "Operações" },
  { id: "#10473", assunto: "Monitor com falha de imagem - sala 204", status: "Aguardando Usuário", abertura: h(-40), prazo: h(8), solicitante: "Ana Beatriz", setor: "Jurídico" },
  { id: "#10472", assunto: "Licença Office expirada em 4 estações", status: "Pendente", abertura: h(-44), prazo: h(-6), solicitante: "Sérgio Vasques", setor: "Compras" },
  { id: "#10471", assunto: "Configuração de leitor de código de barras", status: "Concluído", abertura: h(-50), prazo: h(-24), solicitante: "Estoque Central", setor: "Logística" },
];

export const isAtrasado = (t: Ticket) => t.status !== "Concluído" && new Date(t.prazo).getTime() <= Date.now();

export const horasRestantes = (t: Ticket) => (new Date(t.prazo).getTime() - Date.now()) / 3600_000;

export const fmt = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
