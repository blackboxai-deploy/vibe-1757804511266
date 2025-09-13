import { Cliente, Lead, Oportunidade, Tarefa, Atividade, Usuario, DashboardMetrics, PipelineConfig } from './types';

// Dados simulados realistas para o CRM

export const usuarios: Usuario[] = [
  {
    id: '1',
    nome: 'Raphael Gomes',
    email: 'raphael@empresa.com',
    role: 'admin',
    telefone: '(11) 99999-1111',
    meta: { mensal: 50000, trimestral: 150000, anual: 600000 }
  },
  {
    id: '2',
    nome: 'Ana Santos',
    email: 'ana@empresa.com',
    role: 'vendedor',
    telefone: '(11) 99999-2222',
    meta: { mensal: 30000, trimestral: 90000, anual: 360000 }
  },
  {
    id: '3',
    nome: 'Pedro Oliveira',
    email: 'pedro@empresa.com',
    role: 'vendedor',
    telefone: '(11) 99999-3333',
    meta: { mensal: 25000, trimestral: 75000, anual: 300000 }
  }
];

export const clientes: Cliente[] = [
  {
    id: '1',
    nome: 'João da Silva',
    email: 'joao@techinova.com',
    telefone: '(11) 98765-4321',
    empresa: 'TechInova Solutions',
    cargo: 'CEO',
    endereco: {
      rua: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567'
    },
    status: 'ativo',
    valorTotal: 150000,
    dataUltimoContato: '2024-01-15',
    dataCadastro: '2023-06-10',
    origem: 'linkedin',
    tags: ['enterprise', 'tecnologia', 'priority'],
    observacoes: 'Cliente muito receptivo, interessado em soluções de longo prazo.'
  },
  {
    id: '2',
    nome: 'Maria Fernanda',
    email: 'maria@inovacorp.com.br',
    telefone: '(11) 97654-3210',
    empresa: 'InovaCorp',
    cargo: 'Diretora de TI',
    endereco: {
      rua: 'Av. Paulista, 1000',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-100'
    },
    status: 'ativo',
    valorTotal: 85000,
    dataUltimoContato: '2024-01-12',
    dataCadastro: '2023-09-15',
    origem: 'website',
    tags: ['mid-market', 'tecnologia'],
    observacoes: 'Precisa de aprovação do board para valores acima de 50k.'
  },
  {
    id: '3',
    nome: 'Roberto Costa',
    email: 'roberto@alphatech.com',
    telefone: '(21) 96543-2109',
    empresa: 'Alpha Tech',
    cargo: 'CTO',
    endereco: {
      rua: 'Rua do Porto, 456',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '20040-020'
    },
    status: 'prospecto',
    valorTotal: 0,
    dataUltimoContato: '2024-01-10',
    dataCadastro: '2024-01-05',
    origem: 'indicacao',
    tags: ['startup', 'hot-lead'],
    observacoes: 'Startup em crescimento, potencial para negócios futuros.'
  }
];

export const leads: Lead[] = [
  {
    id: '1',
    nome: 'Carlos Mendes',
    email: 'carlos@startup123.com',
    telefone: '(11) 95432-1098',
    empresa: 'Startup123',
    cargo: 'Founder',
    origem: 'website',
    status: 'qualificado',
    score: 85,
    interesseNivel: 'alto',
    valorPotencial: 75000,
    dataCaptura: '2024-01-10',
    dataUltimoContato: '2024-01-14',
    proximoContato: '2024-01-18',
    responsavel: 'Ana Santos',
    observacoes: 'Demonstrou muito interesse, quer agendar demo.'
  },
  {
    id: '2',
    nome: 'Patricia Lima',
    email: 'patricia@consultoria.com',
    telefone: '(11) 94321-0987',
    empresa: 'Lima Consultoria',
    cargo: 'Diretora',
    origem: 'linkedin',
    status: 'novo',
    score: 60,
    interesseNivel: 'medio',
    valorPotencial: 40000,
    dataCaptura: '2024-01-13',
    responsavel: 'Pedro Oliveira',
    observacoes: 'Precisa entender melhor nossa solução.'
  },
  {
    id: '3',
    nome: 'Fernando Rocha',
    email: 'fernando@techcorp.com',
    telefone: '(11) 93210-9876',
    empresa: 'TechCorp',
    cargo: 'VP Vendas',
    origem: 'evento',
    status: 'contactado',
    score: 75,
    interesseNivel: 'alto',
    valorPotencial: 120000,
    dataCaptura: '2024-01-08',
    dataUltimoContato: '2024-01-12',
    proximoContato: '2024-01-16',
    responsavel: 'Raphael Gomes',
    observacoes: 'Conheceu nossa solução no evento, muito interessado.'
  }
];

export const oportunidades: Oportunidade[] = [
  {
    id: '1',
    clienteId: '1',
    titulo: 'Implementação Sistema ERP',
    descricao: 'Projeto de implementação completa do sistema ERP para toda a empresa',
    valor: 150000,
    probabilidade: 80,
    estagio: 'negociacao',
    dataInicio: '2023-12-01',
    dataFechamentoPrevista: '2024-02-15',
    responsavel: 'Raphael Gomes',
    origem: 'linkedin',
    concorrentes: ['Concorrente A', 'Concorrente B'],
    proximaAcao: 'Apresentar proposta final',
    dataProximaAcao: '2024-01-20',
    observacoes: 'Cliente muito interessado, apenas ajustando detalhes contratuais.'
  },
  {
    id: '2',
    clienteId: '2',
    leadId: '1',
    titulo: 'Software de Gestão',
    descricao: 'Sistema de gestão customizado para startup',
    valor: 75000,
    probabilidade: 60,
    estagio: 'proposta',
    dataInicio: '2024-01-10',
    dataFechamentoPrevista: '2024-02-28',
    responsavel: 'Ana Santos',
    origem: 'website',
    proximaAcao: 'Aguardar retorno da proposta',
    dataProximaAcao: '2024-01-25',
    observacoes: 'Proposta enviada, aguardando aprovação do board.'
  },
  {
    id: '3',
    clienteId: '3',
    titulo: 'Consultoria Tech',
    descricao: 'Serviços de consultoria em transformação digital',
    valor: 45000,
    probabilidade: 40,
    estagio: 'qualificacao',
    dataInicio: '2024-01-05',
    dataFechamentoPrevista: '2024-03-15',
    responsavel: 'Pedro Oliveira',
    origem: 'indicacao',
    proximaAcao: 'Agendar reunião de qualificação',
    dataProximaAcao: '2024-01-18',
    observacoes: 'Ainda definindo escopo do projeto.'
  }
];

export const tarefas: Tarefa[] = [
  {
    id: '1',
    titulo: 'Ligar para Carlos Mendes',
    descricao: 'Follow-up após demonstração do produto',
    tipo: 'ligacao',
    prioridade: 'alta',
    status: 'pendente',
    dataVencimento: '2024-01-18',
    dataCriacao: '2024-01-15',
    responsavel: 'Ana Santos',
    leadId: '1',
    tempoEstimado: 30,
    observacoes: 'Verificar se tem dúvidas sobre implementação.'
  },
  {
    id: '2',
    titulo: 'Enviar proposta TechInova',
    descricao: 'Enviar proposta comercial final com desconto aprovado',
    tipo: 'email',
    prioridade: 'urgente',
    status: 'em-andamento',
    dataVencimento: '2024-01-20',
    dataCriacao: '2024-01-16',
    responsavel: 'Carlos Silva',
    clienteId: '1',
    oportunidadeId: '1',
    tempoEstimado: 60
  },
  {
    id: '3',
    titulo: 'Reunião com InovaCorp',
    descricao: 'Apresentação da roadmap do produto',
    tipo: 'reuniao',
    prioridade: 'media',
    status: 'pendente',
    dataVencimento: '2024-01-22',
    dataCriacao: '2024-01-14',
    responsavel: 'Pedro Oliveira',
    clienteId: '2',
    tempoEstimado: 90
  },
  {
    id: '4',
    titulo: 'Follow-up Patricia Lima',
    descricao: 'Verificar interesse após envio de material',
    tipo: 'email',
    prioridade: 'baixa',
    status: 'concluida',
    dataVencimento: '2024-01-16',
    dataCriacao: '2024-01-13',
    dataConclusao: '2024-01-16',
    responsavel: 'Pedro Oliveira',
    leadId: '2',
    resultado: 'Lead interessado, agendou call para próxima semana',
    tempoEstimado: 15
  }
];

export const atividades: Atividade[] = [
  {
    id: '1',
    tipo: 'cliente_criado',
    titulo: 'Novo Cliente: TechInova Solutions',
    descricao: 'João da Silva foi adicionado como cliente',
    data: '2024-01-15T10:30:00Z',
    usuario: 'Raphael Gomes',
    clienteId: '1'
  },
  {
    id: '2',
    tipo: 'oportunidade_criada',
    titulo: 'Nova Oportunidade: Implementação Sistema ERP',
    descricao: 'Oportunidade de R$ 150.000 criada para TechInova',
    data: '2024-01-15T14:20:00Z',
    usuario: 'Raphael Gomes',
    oportunidadeId: '1'
  },
  {
    id: '3',
    tipo: 'lead_criado',
    titulo: 'Novo Lead: Carlos Mendes',
    descricao: 'Lead qualificado capturado via website',
    data: '2024-01-14T16:45:00Z',
    usuario: 'Ana Santos',
    leadId: '1'
  },
  {
    id: '4',
    tipo: 'tarefa_criada',
    titulo: 'Tarefa Criada: Ligar para Carlos Mendes',
    descricao: 'Follow-up agendado para próxima quinta-feira',
    data: '2024-01-14T09:15:00Z',
    usuario: 'Ana Santos',
    tarefaId: '1'
  },
  {
    id: '5',
    tipo: 'email_enviado',
    titulo: 'Email Enviado para InovaCorp',
    descricao: 'Material comercial enviado para Maria Fernanda',
    data: '2024-01-13T11:30:00Z',
    usuario: 'Pedro Oliveira',
    clienteId: '2'
  }
];

export const dashboardMetrics: DashboardMetrics = {
  vendas: {
    total: 285000,
    meta: 350000,
    crescimento: 15.2,
    periodo: 'Janeiro 2024'
  },
  leads: {
    novos: 23,
    qualificados: 8,
    convertidos: 3,
    taxaConversao: 13.0
  },
  oportunidades: {
    ativas: 12,
    valorPipeline: 850000,
    valorMedio: 70833,
    cicloMedio: 45
  },
  clientes: {
    total: 156,
    ativos: 142,
    novos: 8,
    churn: 2.1
  },
  tarefas: {
    pendentes: 18,
    vencidas: 3,
    concluidas: 45,
    taxa: 85.7
  }
};

export const pipelineConfig: PipelineConfig = {
  estagios: {
    prospeccao: {
      nome: 'Prospecção',
      cor: 'bg-gray-500',
      ordem: 1
    },
    qualificacao: {
      nome: 'Qualificação',
      cor: 'bg-blue-500',
      ordem: 2
    },
    proposta: {
      nome: 'Proposta',
      cor: 'bg-yellow-500',
      ordem: 3
    },
    negociacao: {
      nome: 'Negociação',
      cor: 'bg-orange-500',
      ordem: 4
    },
    fechamento: {
      nome: 'Fechamento',
      cor: 'bg-purple-500',
      ordem: 5
    },
    ganho: {
      nome: 'Ganho',
      cor: 'bg-green-500',
      ordem: 6
    },
    perdido: {
      nome: 'Perdido',
      cor: 'bg-red-500',
      ordem: 7
    }
  }
};

// Funções auxiliares para manipulação de dados
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('pt-BR');
};

export const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    // Status Cliente
    'ativo': 'bg-green-100 text-green-800',
    'inativo': 'bg-gray-100 text-gray-800',
    'prospecto': 'bg-blue-100 text-blue-800',
    
    // Status Lead
    'novo': 'bg-blue-100 text-blue-800',
    'contactado': 'bg-yellow-100 text-yellow-800',
    'qualificado': 'bg-green-100 text-green-800',
    'desqualificado': 'bg-red-100 text-red-800',
    'convertido': 'bg-purple-100 text-purple-800',
    
    // Status Tarefa
    'pendente': 'bg-yellow-100 text-yellow-800',
    'em-andamento': 'bg-blue-100 text-blue-800',
    'concluida': 'bg-green-100 text-green-800',
    'cancelada': 'bg-red-100 text-red-800',
    
    // Prioridade
    'baixa': 'bg-gray-100 text-gray-800',
    'media': 'bg-yellow-100 text-yellow-800',
    'alta': 'bg-orange-100 text-orange-800',
    'urgente': 'bg-red-100 text-red-800',
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
};