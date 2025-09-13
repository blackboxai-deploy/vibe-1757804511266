'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCRM } from '@/lib/context';
import { formatDate, getStatusColor } from '@/lib/data';
import { Tarefa } from '@/lib/types';

interface ListaTarefasProps {
  onTarefaSelecionada?: (tarefa: Tarefa) => void;
  onNovaTarefa?: () => void;
}

export function ListaTarefas({ onTarefaSelecionada, onNovaTarefa }: ListaTarefasProps) {
  const { tarefas, clientes, leads, oportunidades, concluirTarefa, removerTarefa } = useCRM();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroResponsavel, setFiltroResponsavel] = useState<string>('todos');

  // Filtrar tarefas
  const tarefasFiltradas = useMemo(() => {
    return tarefas.filter(tarefa => {
      const matchBusca = !busca || 
        tarefa.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        (tarefa.descricao && tarefa.descricao.toLowerCase().includes(busca.toLowerCase()));
      
      const matchStatus = filtroStatus === 'todos' || tarefa.status === filtroStatus;
      const matchPrioridade = filtroPrioridade === 'todos' || tarefa.prioridade === filtroPrioridade;
      const matchTipo = filtroTipo === 'todos' || tarefa.tipo === filtroTipo;
      const matchResponsavel = filtroResponsavel === 'todos' || tarefa.responsavel === filtroResponsavel;
      
      return matchBusca && matchStatus && matchPrioridade && matchTipo && matchResponsavel;
    });
  }, [tarefas, busca, filtroStatus, filtroPrioridade, filtroTipo, filtroResponsavel]);

  // Ordenar tarefas por prioridade e data
  const tarefasOrdenadas = useMemo(() => {
    return tarefasFiltradas.sort((a, b) => {
      // Primeiro por status (pendentes primeiro)
      if (a.status !== b.status) {
        if (a.status === 'pendente') return -1;
        if (b.status === 'pendente') return 1;
      }
      
      // Depois por prioridade
      const prioridades = { 'urgente': 4, 'alta': 3, 'media': 2, 'baixa': 1 };
      const prioridadeA = prioridades[a.prioridade as keyof typeof prioridades] || 0;
      const prioridadeB = prioridades[b.prioridade as keyof typeof prioridades] || 0;
      
      if (prioridadeA !== prioridadeB) {
        return prioridadeB - prioridadeA;
      }
      
      // Por último por data de vencimento
      return new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime();
    });
  }, [tarefasFiltradas]);

  // Estatísticas
  const estatisticas = useMemo(() => {
    const agora = new Date();
    const vencidas = tarefasFiltradas.filter(t => 
      t.status === 'pendente' && new Date(t.dataVencimento) < agora
    ).length;
    
    return {
      total: tarefasFiltradas.length,
      pendentes: tarefasFiltradas.filter(t => t.status === 'pendente').length,
      emAndamento: tarefasFiltradas.filter(t => t.status === 'em-andamento').length,
      concluidas: tarefasFiltradas.filter(t => t.status === 'concluida').length,
      vencidas,
      hoje: tarefasFiltradas.filter(t => 
        t.status === 'pendente' && t.dataVencimento === new Date().toISOString().split('T')[0]
      ).length
    };
  }, [tarefasFiltradas]);

  const getTipoIcon = (tipo: string) => {
    const icons: { [key: string]: string } = {
      'ligacao': '📞',
      'email': '📧',
      'reuniao': '👥',
      'apresentacao': '📊',
      'follow-up': '🔄',
      'proposta': '📋',
      'outro': '📝'
    };
    return icons[tipo] || '📝';
  };

  const getPrioridadeColor = (prioridade: string) => {
    const colors: { [key: string]: string } = {
      'baixa': 'bg-gray-100 text-gray-800',
      'media': 'bg-yellow-100 text-yellow-800',
      'alta': 'bg-orange-100 text-orange-800',
      'urgente': 'bg-red-100 text-red-800'
    };
    return colors[prioridade] || 'bg-gray-100 text-gray-800';
  };

  const isVencida = (dataVencimento: string) => {
    return new Date(dataVencimento) < new Date();
  };

  const isHoje = (dataVencimento: string) => {
    return dataVencimento === new Date().toISOString().split('T')[0];
  };

  const getRelacionadoNome = (tarefa: Tarefa) => {
    if (tarefa.clienteId) {
      const cliente = clientes.find(c => c.id === tarefa.clienteId);
      return cliente ? `Cliente: ${cliente.nome}` : 'Cliente não encontrado';
    }
    if (tarefa.leadId) {
      const lead = leads.find(l => l.id === tarefa.leadId);
      return lead ? `Lead: ${lead.nome}` : 'Lead não encontrado';
    }
    if (tarefa.oportunidadeId) {
      const oportunidade = oportunidades.find(o => o.id === tarefa.oportunidadeId);
      return oportunidade ? `Oportunidade: ${oportunidade.titulo}` : 'Oportunidade não encontrada';
    }
    return null;
  };

  const handleRemoverTarefa = (tarefaId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('Tem certeza que deseja remover esta tarefa?')) {
      removerTarefa(tarefaId);
    }
  };

  const responsaveis = Array.from(new Set(tarefas.map(t => t.responsavel)));

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>✅</span>
                <span>Gestão de Tarefas</span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {estatisticas.total} tarefas encontradas
              </p>
            </div>
            {onNovaTarefa && (
              <Button onClick={onNovaTarefa} className="bg-blue-600 hover:bg-blue-700">
                ➕ Nova Tarefa
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <Input
              placeholder="Buscar tarefas..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full"
            />
            
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em-andamento">Em Andamento</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filtroPrioridade} onValueChange={setFiltroPrioridade}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as prioridades</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="ligacao">Ligação</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="reuniao">Reunião</SelectItem>
                <SelectItem value="apresentacao">Apresentação</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="proposta">Proposta</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroResponsavel} onValueChange={setFiltroResponsavel}>
              <SelectTrigger>
                <SelectValue placeholder="Responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os responsáveis</SelectItem>
                {responsaveis.map(responsavel => (
                  <SelectItem key={responsavel} value={responsavel}>
                    {responsavel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Total</div>
              <div className="text-xl font-bold text-blue-900">{estatisticas.total}</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-sm text-yellow-600 font-medium">Pendentes</div>
              <div className="text-xl font-bold text-yellow-900">{estatisticas.pendentes}</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Em Andamento</div>
              <div className="text-xl font-bold text-blue-900">{estatisticas.emAndamento}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Concluídas</div>
              <div className="text-xl font-bold text-green-900">{estatisticas.concluidas}</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-sm text-red-600 font-medium">Vencidas</div>
              <div className="text-xl font-bold text-red-900">{estatisticas.vencidas}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Hoje</div>
              <div className="text-xl font-bold text-purple-900">{estatisticas.hoje}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de tarefas */}
      <div className="space-y-4">
        {tarefasOrdenadas.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">✅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
              <p className="text-gray-600">
                {busca || filtroStatus !== 'todos' || filtroPrioridade !== 'todos' || filtroTipo !== 'todos'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando sua primeira tarefa'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          tarefasOrdenadas.map((tarefa) => (
            <Card 
              key={tarefa.id} 
              className={`hover:shadow-md transition-shadow cursor-pointer ${
                isVencida(tarefa.dataVencimento) && tarefa.status === 'pendente' 
                  ? 'border-l-4 border-l-red-500' 
                  : isHoje(tarefa.dataVencimento) && tarefa.status === 'pendente'
                  ? 'border-l-4 border-l-yellow-500'
                  : ''
              }`}
              onClick={() => onTarefaSelecionada?.(tarefa)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 pt-1">
                    <Checkbox 
                      checked={tarefa.status === 'concluida'}
                      onCheckedChange={() => {
                        if (tarefa.status !== 'concluida') {
                          concluirTarefa(tarefa.id);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-xl">{getTipoIcon(tarefa.tipo)}</span>
                          <h3 className={`text-lg font-semibold ${
                            tarefa.status === 'concluida' 
                              ? 'line-through text-gray-500' 
                              : 'text-gray-900'
                          }`}>
                            {tarefa.titulo}
                          </h3>
                          <Badge className={getPrioridadeColor(tarefa.prioridade)}>
                            {tarefa.prioridade}
                          </Badge>
                          <Badge className={getStatusColor(tarefa.status)}>
                            {tarefa.status.replace('-', ' ').charAt(0).toUpperCase() + tarefa.status.slice(1)}
                          </Badge>
                        </div>
                        
                        {tarefa.descricao && (
                          <p className="text-sm text-gray-600 mb-2">{tarefa.descricao}</p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <span>📅</span>
                            <span className={
                              isVencida(tarefa.dataVencimento) && tarefa.status === 'pendente'
                                ? 'text-red-600 font-medium'
                                : isHoje(tarefa.dataVencimento) && tarefa.status === 'pendente'
                                ? 'text-yellow-600 font-medium'
                                : ''
                            }>
                              {formatDate(tarefa.dataVencimento)}
                              {isVencida(tarefa.dataVencimento) && tarefa.status === 'pendente' && ' (Vencida)'}
                              {isHoje(tarefa.dataVencimento) && tarefa.status === 'pendente' && ' (Hoje)'}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <span>👤</span>
                            <span>{tarefa.responsavel}</span>
                          </div>
                          
                          {tarefa.tempoEstimado && (
                            <div className="flex items-center space-x-1">
                              <span>⏱️</span>
                              <span>{tarefa.tempoEstimado}min</span>
                            </div>
                          )}
                          
                          {getRelacionadoNome(tarefa) && (
                            <div className="flex items-center space-x-1">
                              <span>🔗</span>
                              <span>{getRelacionadoNome(tarefa)}</span>
                            </div>
                          )}
                        </div>
                        
                        {tarefa.resultado && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-800">
                              <strong>Resultado:</strong> {tarefa.resultado}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTarefaSelecionada?.(tarefa);
                          }}
                        >
                          ✏️
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleRemoverTarefa(tarefa.id, e)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}