export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  cargo?: string;
  endereco?: {
    rua: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  status: 'ativo' | 'inativo' | 'prospecto';
  valorTotal: number;
  dataUltimoContato: string;
  dataCadastro: string;
  origem: string;
  tags: string[];
  observacoes?: string;
}

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  cargo?: string;
  origem: 'website' | 'linkedin' | 'indicacao' | 'evento' | 'cold-email' | 'outro';
  status: 'novo' | 'contactado' | 'qualificado' | 'desqualificado' | 'convertido';
  score: number; // 0-100
  interesseNivel: 'baixo' | 'medio' | 'alto';
  valorPotencial: number;
  dataCaptura: string;
  dataUltimoContato?: string;
  proximoContato?: string;
  observacoes?: string;
  responsavel: string;
}

export interface Oportunidade {
  id: string;
  clienteId: string;
  leadId?: string;
  titulo: string;
  descricao: string;
  valor: number;
  probabilidade: number; // 0-100
  estagio: 'prospeccao' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechamento' | 'ganho' | 'perdido';
  dataInicio: string;
  dataFechamentoPrevista: string;
  dataFechamentoReal?: string;
  responsavel: string;
  origem: string;
  concorrentes?: string[];
  proximaAcao?: string;
  dataProximaAcao?: string;
  observacoes?: string;
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: 'ligacao' | 'email' | 'reuniao' | 'apresentacao' | 'follow-up' | 'proposta' | 'outro';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'pendente' | 'em-andamento' | 'concluida' | 'cancelada';
  dataVencimento: string;
  dataCriacao: string;
  dataConclusao?: string;
  responsavel: string;
  clienteId?: string;
  leadId?: string;
  oportunidadeId?: string;
  tempoEstimado?: number; // em minutos
  resultado?: string;
  observacoes?: string;
}

export interface Atividade {
  id: string;
  tipo: 'cliente_criado' | 'lead_criado' | 'oportunidade_criada' | 'tarefa_criada' | 'ligacao_realizada' | 
        'email_enviado' | 'reuniao_agendada' | 'proposta_enviada' | 'negocio_fechado' | 'negocio_perdido';
  titulo: string;
  descricao: string;
  data: string;
  usuario: string;
  clienteId?: string;
  leadId?: string;
  oportunidadeId?: string;
  tarefaId?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'vendedor' | 'manager';
  avatar?: string;
  telefone?: string;
  meta: {
    mensal: number;
    trimestral: number;
    anual: number;
  };
}

export interface DashboardMetrics {
  vendas: {
    total: number;
    meta: number;
    crescimento: number;
    periodo: string;
  };
  leads: {
    novos: number;
    qualificados: number;
    convertidos: number;
    taxaConversao: number;
  };
  oportunidades: {
    ativas: number;
    valorPipeline: number;
    valorMedio: number;
    cicloMedio: number; // em dias
  };
  clientes: {
    total: number;
    ativos: number;
    novos: number;
    churn: number;
  };
  tarefas: {
    pendentes: number;
    vencidas: number;
    concluidas: number;
    taxa: number;
  };
}

export interface Filtros {
  busca?: string;
  status?: string[];
  origem?: string[];
  responsavel?: string[];
  dataInicio?: string;
  dataFim?: string;
  valorMin?: number;
  valorMax?: number;
  tags?: string[];
}

export type EstagioOportunidade = 'prospeccao' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechamento' | 'ganho' | 'perdido';

export interface PipelineConfig {
  estagios: {
    [key in EstagioOportunidade]: {
      nome: string;
      cor: string;
      ordem: number;
    };
  };
}