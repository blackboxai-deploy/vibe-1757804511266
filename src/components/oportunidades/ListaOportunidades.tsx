'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCRM } from '@/lib/context';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/data';
import { pipelineConfig } from '@/lib/data';
import { Oportunidade, EstagioOportunidade } from '@/lib/types';

interface ListaOportunidadesProps {
  onOportunidadeSelecionada?: (oportunidade: Oportunidade) => void;
  onNovaOportunidade?: () => void;
}

export function ListaOportunidades({ onOportunidadeSelecionada, onNovaOportunidade }: ListaOportunidadesProps) {
  const { oportunidades, clientes, moverOportunidade } = useCRM();
  const [busca, setBusca] = useState('');
  const [filtroEstagio, setFiltroEstagio] = useState<string>('todos');
  const [filtroResponsavel, setFiltroResponsavel] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'pipeline' | 'lista'>('pipeline');

  // Filtrar oportunidades
  const oportunidadesFiltradas = useMemo(() => {
    return oportunidades.filter(oportunidade => {
      const cliente = clientes.find(c => c.id === oportunidade.clienteId);
      const matchBusca = !busca || 
        oportunidade.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        oportunidade.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        (cliente && cliente.nome.toLowerCase().includes(busca.toLowerCase()));
      
      const matchEstagio = filtroEstagio === 'todos' || oportunidade.estagio === filtroEstagio;
      const matchResponsavel = filtroResponsavel === 'todos' || oportunidade.responsavel === filtroResponsavel;
      
      return matchBusca && matchEstagio && matchResponsavel;
    });
  }, [oportunidades, clientes, busca, filtroEstagio, filtroResponsavel]);

  // Agrupar por estágio para visualização pipeline
  const oportunidadesPorEstagio = useMemo(() => {
    const grupos: { [key: string]: Oportunidade[] } = {};
    Object.keys(pipelineConfig.estagios).forEach(estagio => {
      grupos[estagio] = oportunidadesFiltradas.filter(op => op.estagio === estagio);
    });
    return grupos;
  }, [oportunidadesFiltradas]);

  // Estatísticas
  const estatisticas = useMemo(() => {
    return {
      total: oportunidadesFiltradas.length,
      valorTotal: oportunidadesFiltradas.reduce((sum, op) => sum + op.valor, 0),
      ativas: oportunidadesFiltradas.filter(op => !['ganho', 'perdido'].includes(op.estagio)).length,
      ganhas: oportunidadesFiltradas.filter(op => op.estagio === 'ganho').length,
      perdidas: oportunidadesFiltradas.filter(op => op.estagio === 'perdido').length
    };
  }, [oportunidadesFiltradas]);

  const handleMoverOportunidade = (oportunidadeId: string, novoEstagio: EstagioOportunidade) => {
    moverOportunidade(oportunidadeId, novoEstagio);
  };

  const getClienteNome = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nome || 'Cliente não encontrado';
  };

  const getEstagioConfig = (estagio: string) => {
    const config = pipelineConfig.estagios[estagio as EstagioOportunidade];
    return config || { nome: estagio, cor: 'bg-gray-500', ordem: 999 };
  };

  const responsaveis = Array.from(new Set(oportunidades.map(op => op.responsavel)));

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>💰</span>
                <span>Pipeline de Vendas</span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {estatisticas.total} oportunidades • {formatCurrency(estatisticas.valorTotal)} em pipeline
              </p>
            </div>
            <div className="flex space-x-2">
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setViewMode('pipeline')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'pipeline' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📊 Pipeline
                </button>
                <button
                  onClick={() => setViewMode('lista')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'lista' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📋 Lista
                </button>
              </div>
              {onNovaOportunidade && (
                <Button onClick={onNovaOportunidade} className="bg-blue-600 hover:bg-blue-700">
                  ➕ Nova Oportunidade
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Buscar oportunidades..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full"
            />
            
            <Select value={filtroEstagio} onValueChange={setFiltroEstagio}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estágio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os estágios</SelectItem>
                {Object.entries(pipelineConfig.estagios).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {(config as { nome: string; cor: string; ordem: number }).nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filtroResponsavel} onValueChange={setFiltroResponsavel}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por responsável" />
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Total</div>
              <div className="text-xl font-bold text-blue-900">{estatisticas.total}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Valor Total</div>
              <div className="text-lg font-bold text-purple-900">{formatCurrency(estatisticas.valorTotal)}</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-sm text-yellow-600 font-medium">Ativas</div>
              <div className="text-xl font-bold text-yellow-900">{estatisticas.ativas}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Ganhas</div>
              <div className="text-xl font-bold text-green-900">{estatisticas.ganhas}</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-sm text-red-600 font-medium">Perdidas</div>
              <div className="text-xl font-bold text-red-900">{estatisticas.perdidas}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualização Pipeline */}
      {viewMode === 'pipeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(pipelineConfig.estagios)
            .sort(([,a], [,b]) => (a as { nome: string; cor: string; ordem: number }).ordem - (b as { nome: string; cor: string; ordem: number }).ordem)
            .map(([estagio, config]) => {
              const configData = config as { nome: string; cor: string; ordem: number };
              const oportunidadesEstagio = oportunidadesPorEstagio[estagio] || [];
              const valorEstagio = oportunidadesEstagio.reduce((sum, op) => sum + op.valor, 0);
              
              return (
                <div key={estagio} className="space-y-4">
                  {/* Header do estágio */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${configData.cor}`} />
                      <h3 className="font-semibold text-gray-900">{configData.nome}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {oportunidadesEstagio.length}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(valorEstagio)}
                    </div>
                  </div>
                  
                  {/* Cards das oportunidades */}
                  <div className="space-y-3">
                    {oportunidadesEstagio.map((oportunidade) => (
                      <Card 
                        key={oportunidade.id} 
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => onOportunidadeSelecionada?.(oportunidade)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                                {oportunidade.titulo}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {getClienteNome(oportunidade.clienteId)}
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">
                                  {formatCurrency(oportunidade.valor)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {oportunidade.probabilidade}%
                                </span>
                              </div>
                              <Progress 
                                value={oportunidade.probabilidade} 
                                className="h-1"
                              />
                            </div>
                            
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>{oportunidade.responsavel}</span>
                              <span>{formatDate(oportunidade.dataFechamentoPrevista)}</span>
                            </div>
                            
                            {/* Actions para mover estágio */}
                            <div className="flex space-x-1 pt-2 border-t border-gray-100">
                              {estagio !== 'prospeccao' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const estagios = Object.keys(pipelineConfig.estagios);
                                    const currentIndex = estagios.indexOf(estagio);
                                    if (currentIndex > 0) {
                                      handleMoverOportunidade(oportunidade.id, estagios[currentIndex - 1] as EstagioOportunidade);
                                    }
                                  }}
                                  className="flex-1 py-1 px-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                                >
                                  ← Voltar
                                </button>
                              )}
                              {estagio !== 'ganho' && estagio !== 'perdido' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const estagios = Object.keys(pipelineConfig.estagios).filter(e => !['perdido'].includes(e));
                                    const currentIndex = estagios.indexOf(estagio);
                                    if (currentIndex < estagios.length - 1) {
                                      handleMoverOportunidade(oportunidade.id, estagios[currentIndex + 1] as EstagioOportunidade);
                                    }
                                  }}
                                  className="flex-1 py-1 px-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                                >
                                  Avançar →
                                </button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {oportunidadesEstagio.length === 0 && (
                      <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                        <p className="text-sm">Nenhuma oportunidade</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Visualização Lista */}
      {viewMode === 'lista' && (
        <div className="space-y-4">
          {oportunidadesFiltradas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 text-4xl mb-4">💰</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma oportunidade encontrada</h3>
                <p className="text-gray-600">
                  {busca || filtroEstagio !== 'todos' || filtroResponsavel !== 'todos'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece adicionando sua primeira oportunidade'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            oportunidadesFiltradas.map((oportunidade) => (
              <Card 
                key={oportunidade.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onOportunidadeSelecionada?.(oportunidade)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">💰</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{oportunidade.titulo}</h3>
                          <p className="text-sm text-gray-600">{getClienteNome(oportunidade.clienteId)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Valor</p>
                          <p className="text-lg font-semibold text-gray-900">{formatCurrency(oportunidade.valor)}</p>
                          <p className="text-xs text-gray-500">Prob: {oportunidade.probabilidade}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Estágio</p>
                          <Badge className={getStatusColor(oportunidade.estagio)}>
                            {getEstagioConfig(oportunidade.estagio).nome}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Fechamento Previsto</p>
                          <p className="text-sm text-gray-900">{formatDate(oportunidade.dataFechamentoPrevista)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Responsável</p>
                          <p className="text-sm text-gray-900">{oportunidade.responsavel}</p>
                        </div>
                      </div>
                      
                      {oportunidade.descricao && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{oportunidade.descricao}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}