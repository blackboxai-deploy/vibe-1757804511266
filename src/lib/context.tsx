'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cliente, Lead, Oportunidade, Tarefa, Atividade, Usuario, DashboardMetrics } from './types';
import { 
  clientes as initialClientes, 
  leads as initialLeads, 
  oportunidades as initialOportunidades, 
  tarefas as initialTarefas, 
  atividades as initialAtividades,
  usuarios as initialUsuarios,
  dashboardMetrics as initialMetrics
} from './data';

interface CRMContextType {
  // Dados
  clientes: Cliente[];
  leads: Lead[];
  oportunidades: Oportunidade[];
  tarefas: Tarefa[];
  atividades: Atividade[];
  usuarios: Usuario[];
  metrics: DashboardMetrics;
  
  // Ações Clientes
  adicionarCliente: (cliente: Omit<Cliente, 'id'>) => void;
  editarCliente: (id: string, cliente: Partial<Cliente>) => void;
  removerCliente: (id: string) => void;
  
  // Ações Leads
  adicionarLead: (lead: Omit<Lead, 'id'>) => void;
  editarLead: (id: string, lead: Partial<Lead>) => void;
  removerLead: (id: string) => void;
  converterLeadParaOportunidade: (leadId: string, oportunidade: Omit<Oportunidade, 'id' | 'leadId'>) => void;
  
  // Ações Oportunidades
  adicionarOportunidade: (oportunidade: Omit<Oportunidade, 'id'>) => void;
  editarOportunidade: (id: string, oportunidade: Partial<Oportunidade>) => void;
  removerOportunidade: (id: string) => void;
  moverOportunidade: (id: string, novoEstagio: string) => void;
  
  // Ações Tarefas
  adicionarTarefa: (tarefa: Omit<Tarefa, 'id'>) => void;
  editarTarefa: (id: string, tarefa: Partial<Tarefa>) => void;
  removerTarefa: (id: string) => void;
  concluirTarefa: (id: string, resultado?: string) => void;
  
  // Ações Atividades
  adicionarAtividade: (atividade: Omit<Atividade, 'id'>) => void;
  
  // Utilitários
  atualizarMetrics: () => void;
  exportarDados: () => string;
  importarDados: (dados: string) => boolean;
  limparDados: () => void;
}

const CRMContext = createContext<CRMContextType | null>(null);

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM deve ser usado dentro de CRMProvider');
  }
  return context;
};

const STORAGE_KEY = 'crm-data';

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>(initialOportunidades);
  const [tarefas, setTarefas] = useState<Tarefa[]>(initialTarefas);
  const [atividades, setAtividades] = useState<Atividade[]>(initialAtividades);
  const [usuarios] = useState<Usuario[]>(initialUsuarios);
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics);

  // Atualizar métricas
  const atualizarMetrics = useCallback(() => {
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    
    // Calcular métricas
    const leadsNovos = leads.filter(lead => 
      new Date(lead.dataCaptura) >= inicioMes
    ).length;
    
    const leadsQualificados = leads.filter(lead => lead.status === 'qualificado').length;
    const leadsConvertidos = leads.filter(lead => lead.status === 'convertido').length;
    const taxaConversao = leads.length > 0 ? (leadsConvertidos / leads.length) * 100 : 0;
    
    const oportunidadesAtivas = oportunidades.filter(op => 
      !['ganho', 'perdido'].includes(op.estagio)
    ).length;
    
    const valorPipeline = oportunidades
      .filter(op => !['ganho', 'perdido'].includes(op.estagio))
      .reduce((sum, op) => sum + op.valor, 0);
    
    const valorMedio = oportunidadesAtivas > 0 ? valorPipeline / oportunidadesAtivas : 0;
    
    const tarefasPendentes = tarefas.filter(t => t.status === 'pendente').length;
    const tarefasVencidas = tarefas.filter(t => 
      t.status === 'pendente' && new Date(t.dataVencimento) < agora
    ).length;
    const tarefasConcluidas = tarefas.filter(t => t.status === 'concluida').length;
    const taxaTarefas = tarefas.length > 0 ? (tarefasConcluidas / tarefas.length) * 100 : 0;

    setMetrics({
      vendas: {
        total: oportunidades
          .filter(op => op.estagio === 'ganho')
          .reduce((sum, op) => sum + op.valor, 0),
        meta: 350000,
        crescimento: 15.2,
        periodo: 'Janeiro 2024'
      },
      leads: {
        novos: leadsNovos,
        qualificados: leadsQualificados,
        convertidos: leadsConvertidos,
        taxaConversao: Number(taxaConversao.toFixed(1))
      },
      oportunidades: {
        ativas: oportunidadesAtivas,
        valorPipeline,
        valorMedio: Number(valorMedio.toFixed(0)),
        cicloMedio: 45
      },
      clientes: {
        total: clientes.length,
        ativos: clientes.filter(c => c.status === 'ativo').length,
        novos: clientes.filter(c => 
          new Date(c.dataCadastro) >= inicioMes
        ).length,
        churn: 2.1
      },
      tarefas: {
        pendentes: tarefasPendentes,
        vencidas: tarefasVencidas,
        concluidas: tarefasConcluidas,
        taxa: Number(taxaTarefas.toFixed(1))
      }
    });
  }, [leads, oportunidades, clientes, tarefas]);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.clientes) setClientes(data.clientes);
        if (data.leads) setLeads(data.leads);
        if (data.oportunidades) setOportunidades(data.oportunidades);
        if (data.tarefas) setTarefas(data.tarefas);
        if (data.atividades) setAtividades(data.atividades);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage sempre que houver mudanças
  useEffect(() => {
    const data = {
      clientes,
      leads,
      oportunidades,
      tarefas,
      atividades,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [clientes, leads, oportunidades, tarefas, atividades]);

  // Atualizar métricas quando os dados mudarem
  useEffect(() => {
    atualizarMetrics();
  }, [clientes, leads, oportunidades, tarefas, atualizarMetrics]);

  // Função para gerar IDs únicos
  const gerarId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Função para adicionar atividade
  const adicionarAtividade = (atividade: Omit<Atividade, 'id'>) => {
    const novaAtividade: Atividade = {
      ...atividade,
      id: gerarId()
    };
    setAtividades(prev => [novaAtividade, ...prev]);
  };

  // Ações de Clientes
  const adicionarCliente = (cliente: Omit<Cliente, 'id'>) => {
    const novoCliente: Cliente = {
      ...cliente,
      id: gerarId()
    };
    setClientes(prev => [...prev, novoCliente]);
    adicionarAtividade({
      tipo: 'cliente_criado',
      titulo: `Novo Cliente: ${novoCliente.nome}`,
      descricao: `${novoCliente.nome} foi adicionado como cliente`,
      data: new Date().toISOString(),
      usuario: 'Sistema', // Em um sistema real, viria do usuário logado
      clienteId: novoCliente.id
    });
  };

  const editarCliente = (id: string, dadosAtualizados: Partial<Cliente>) => {
    setClientes(prev => 
      prev.map(cliente => 
        cliente.id === id ? { ...cliente, ...dadosAtualizados } : cliente
      )
    );
  };

  const removerCliente = (id: string) => {
    setClientes(prev => prev.filter(cliente => cliente.id !== id));
    // Remover oportunidades relacionadas
    setOportunidades(prev => prev.filter(oport => oport.clienteId !== id));
    // Remover tarefas relacionadas
    setTarefas(prev => prev.filter(tarefa => tarefa.clienteId !== id));
  };

  // Ações de Leads
  const adicionarLead = (lead: Omit<Lead, 'id'>) => {
    const novoLead: Lead = {
      ...lead,
      id: gerarId()
    };
    setLeads(prev => [...prev, novoLead]);
    adicionarAtividade({
      tipo: 'lead_criado',
      titulo: `Novo Lead: ${novoLead.nome}`,
      descricao: `Lead capturado via ${novoLead.origem}`,
      data: new Date().toISOString(),
      usuario: novoLead.responsavel,
      leadId: novoLead.id
    });
  };

  const editarLead = (id: string, dadosAtualizados: Partial<Lead>) => {
    setLeads(prev => 
      prev.map(lead => 
        lead.id === id ? { ...lead, ...dadosAtualizados } : lead
      )
    );
  };

  const removerLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
    setTarefas(prev => prev.filter(tarefa => tarefa.leadId !== id));
  };

  const converterLeadParaOportunidade = (leadId: string, dadosOportunidade: Omit<Oportunidade, 'id' | 'leadId'>) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    // Criar cliente a partir do lead se não existir
    let clienteId = dadosOportunidade.clienteId;
    if (!clienteId) {
      const novoCliente: Cliente = {
        id: gerarId(),
        nome: lead.nome,
        email: lead.email,
        telefone: lead.telefone,
        empresa: lead.empresa || '',
        cargo: lead.cargo,
        status: 'prospecto',
        valorTotal: 0,
        dataUltimoContato: new Date().toISOString().split('T')[0],
        dataCadastro: new Date().toISOString().split('T')[0],
        origem: lead.origem,
        tags: ['convertido-lead']
      };
      setClientes(prev => [...prev, novoCliente]);
      clienteId = novoCliente.id;
    }

    // Criar oportunidade
    const novaOportunidade: Oportunidade = {
      ...dadosOportunidade,
      id: gerarId(),
      clienteId,
      leadId
    };
    setOportunidades(prev => [...prev, novaOportunidade]);

    // Atualizar status do lead
    editarLead(leadId, { status: 'convertido' });

    adicionarAtividade({
      tipo: 'oportunidade_criada',
      titulo: `Lead Convertido: ${novaOportunidade.titulo}`,
      descricao: `${lead.nome} foi convertido em oportunidade`,
      data: new Date().toISOString(),
      usuario: 'Sistema',
      leadId,
      oportunidadeId: novaOportunidade.id
    });
  };

  // Ações de Oportunidades
  const adicionarOportunidade = (oportunidade: Omit<Oportunidade, 'id'>) => {
    const novaOportunidade: Oportunidade = {
      ...oportunidade,
      id: gerarId()
    };
    setOportunidades(prev => [...prev, novaOportunidade]);
    adicionarAtividade({
      tipo: 'oportunidade_criada',
      titulo: `Nova Oportunidade: ${novaOportunidade.titulo}`,
      descricao: `Oportunidade de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(novaOportunidade.valor)}`,
      data: new Date().toISOString(),
      usuario: novaOportunidade.responsavel,
      oportunidadeId: novaOportunidade.id
    });
  };

  const editarOportunidade = (id: string, dadosAtualizados: Partial<Oportunidade>) => {
    setOportunidades(prev => 
      prev.map(oport => 
        oport.id === id ? { ...oport, ...dadosAtualizados } : oport
      )
    );
  };

  const removerOportunidade = (id: string) => {
    setOportunidades(prev => prev.filter(oport => oport.id !== id));
    setTarefas(prev => prev.filter(tarefa => tarefa.oportunidadeId !== id));
  };

  const moverOportunidade = (id: string, novoEstagio: string) => {
    const oportunidade = oportunidades.find(o => o.id === id);
    if (!oportunidade) return;

    editarOportunidade(id, { estagio: novoEstagio as Oportunidade['estagio'] });
    
    if (novoEstagio === 'ganho') {
      adicionarAtividade({
        tipo: 'negocio_fechado',
        titulo: `Negócio Fechado: ${oportunidade.titulo}`,
        descricao: `Oportunidade fechada com sucesso!`,
        data: new Date().toISOString(),
        usuario: oportunidade.responsavel,
        oportunidadeId: id
      });
    }
  };

  // Ações de Tarefas
  const adicionarTarefa = (tarefa: Omit<Tarefa, 'id'>) => {
    const novaTarefa: Tarefa = {
      ...tarefa,
      id: gerarId()
    };
    setTarefas(prev => [...prev, novaTarefa]);
    adicionarAtividade({
      tipo: 'tarefa_criada',
      titulo: `Tarefa Criada: ${novaTarefa.titulo}`,
      descricao: `Tarefa agendada para ${new Date(novaTarefa.dataVencimento).toLocaleDateString('pt-BR')}`,
      data: new Date().toISOString(),
      usuario: novaTarefa.responsavel,
      tarefaId: novaTarefa.id
    });
  };

  const editarTarefa = (id: string, dadosAtualizados: Partial<Tarefa>) => {
    setTarefas(prev => 
      prev.map(tarefa => 
        tarefa.id === id ? { ...tarefa, ...dadosAtualizados } : tarefa
      )
    );
  };

  const removerTarefa = (id: string) => {
    setTarefas(prev => prev.filter(tarefa => tarefa.id !== id));
  };

  const concluirTarefa = (id: string, resultado?: string) => {
    editarTarefa(id, { 
      status: 'concluida', 
      dataConclusao: new Date().toISOString().split('T')[0],
      resultado 
    });
  };

  // Exportar dados
  const exportarDados = (): string => {
    const dados = {
      clientes,
      leads,
      oportunidades,
      tarefas,
      atividades,
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(dados, null, 2);
  };

  // Importar dados
  const importarDados = (dados: string): boolean => {
    try {
      const parsed = JSON.parse(dados);
      if (parsed.clientes) setClientes(parsed.clientes);
      if (parsed.leads) setLeads(parsed.leads);
      if (parsed.oportunidades) setOportunidades(parsed.oportunidades);
      if (parsed.tarefas) setTarefas(parsed.tarefas);
      if (parsed.atividades) setAtividades(parsed.atividades);
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  };

  // Limpar dados
  const limparDados = () => {
    setClientes([]);
    setLeads([]);
    setOportunidades([]);
    setTarefas([]);
    setAtividades([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value: CRMContextType = {
    // Dados
    clientes,
    leads,
    oportunidades,
    tarefas,
    atividades,
    usuarios,
    metrics,
    
    // Ações
    adicionarCliente,
    editarCliente,
    removerCliente,
    adicionarLead,
    editarLead,
    removerLead,
    converterLeadParaOportunidade,
    adicionarOportunidade,
    editarOportunidade,
    removerOportunidade,
    moverOportunidade,
    adicionarTarefa,
    editarTarefa,
    removerTarefa,
    concluirTarefa,
    adicionarAtividade,
    atualizarMetrics,
    exportarDados,
    importarDados,
    limparDados
  };

  return (
    <CRMContext.Provider value={value}>
      {children}
    </CRMContext.Provider>
  );
};