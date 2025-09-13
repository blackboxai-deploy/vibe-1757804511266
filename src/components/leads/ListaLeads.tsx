'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCRM } from '@/lib/context';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/data';
import { Lead } from '@/lib/types';

interface ListaLeadsProps {
  onLeadSelecionado?: (lead: Lead) => void;
  onNovoLead?: () => void;
}

export function ListaLeads({ onLeadSelecionado, onNovoLead }: ListaLeadsProps) {
  const { leads, converterLeadParaOportunidade } = useCRM();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroOrigem, setFiltroOrigem] = useState<string>('todos');
  const [filtroInteresse, setFiltroInteresse] = useState<string>('todos');

  // Filtrar e buscar leads
  const leadsFiltrados = useMemo(() => {
    return leads.filter(lead => {
      const matchBusca = !busca || 
        lead.nome.toLowerCase().includes(busca.toLowerCase()) ||
        lead.email.toLowerCase().includes(busca.toLowerCase()) ||
        (lead.empresa && lead.empresa.toLowerCase().includes(busca.toLowerCase()));
      
      const matchStatus = filtroStatus === 'todos' || lead.status === filtroStatus;
      const matchOrigem = filtroOrigem === 'todos' || lead.origem === filtroOrigem;
      const matchInteresse = filtroInteresse === 'todos' || lead.interesseNivel === filtroInteresse;
      
      return matchBusca && matchStatus && matchOrigem && matchInteresse;
    });
  }, [leads, busca, filtroStatus, filtroOrigem, filtroInteresse]);

  // Estatísticas dos leads filtrados
  const estatisticas = useMemo(() => {
    return {
      total: leadsFiltrados.length,
      novos: leadsFiltrados.filter(l => l.status === 'novo').length,
      qualificados: leadsFiltrados.filter(l => l.status === 'qualificado').length,
      convertidos: leadsFiltrados.filter(l => l.status === 'convertido').length,
      valorPotencial: leadsFiltrados.reduce((sum, l) => sum + l.valorPotencial, 0),
      scoreMedia: leadsFiltrados.length > 0 ? Math.round(leadsFiltrados.reduce((sum, l) => sum + l.score, 0) / leadsFiltrados.length) : 0
    };
  }, [leadsFiltrados]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getInteresseColor = (nivel: string) => {
    switch (nivel) {
      case 'alto': return 'bg-green-100 text-green-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'baixo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleConverterLead = (leadId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    // Criar oportunidade básica
    converterLeadParaOportunidade(leadId, {
      clienteId: '', // Será criado automaticamente
      titulo: `Oportunidade - ${lead.nome}`,
      descricao: `Oportunidade convertida do lead ${lead.nome}`,
      valor: lead.valorPotencial,
      probabilidade: 50,
      estagio: 'qualificacao',
      dataInicio: new Date().toISOString().split('T')[0],
      dataFechamentoPrevista: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      responsavel: lead.responsavel,
      origem: lead.origem
    });
  };

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>🎯</span>
                <span>Gestão de Leads</span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {estatisticas.total} leads encontrados
              </p>
            </div>
            {onNovoLead && (
              <Button onClick={onNovoLead} className="bg-blue-600 hover:bg-blue-700">
                ➕ Novo Lead
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="Buscar por nome, email ou empresa..."
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
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="contactado">Contactado</SelectItem>
                <SelectItem value="qualificado">Qualificado</SelectItem>
                <SelectItem value="desqualificado">Desqualificado</SelectItem>
                <SelectItem value="convertido">Convertido</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filtroOrigem} onValueChange={setFiltroOrigem}>
              <SelectTrigger>
                <SelectValue placeholder="Origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as origens</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="indicacao">Indicação</SelectItem>
                <SelectItem value="evento">Evento</SelectItem>
                <SelectItem value="cold-email">Cold Email</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroInteresse} onValueChange={setFiltroInteresse}>
              <SelectTrigger>
                <SelectValue placeholder="Nível de Interesse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os níveis</SelectItem>
                <SelectItem value="alto">Alto</SelectItem>
                <SelectItem value="medio">Médio</SelectItem>
                <SelectItem value="baixo">Baixo</SelectItem>
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
              <div className="text-sm text-yellow-600 font-medium">Novos</div>
              <div className="text-xl font-bold text-yellow-900">{estatisticas.novos}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Qualificados</div>
              <div className="text-xl font-bold text-green-900">{estatisticas.qualificados}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Convertidos</div>
              <div className="text-xl font-bold text-purple-900">{estatisticas.convertidos}</div>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">
              <div className="text-sm text-indigo-600 font-medium">Score Médio</div>
              <div className="text-xl font-bold text-indigo-900">{estatisticas.scoreMedia}</div>
            </div>
            <div className="bg-pink-50 p-3 rounded-lg">
              <div className="text-sm text-pink-600 font-medium">Valor Potencial</div>
              <div className="text-lg font-bold text-pink-900">{formatCurrency(estatisticas.valorPotencial)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de leads */}
      <div className="space-y-4">
        {leadsFiltrados.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum lead encontrado</h3>
              <p className="text-gray-600">
                {busca || filtroStatus !== 'todos' || filtroOrigem !== 'todos' || filtroInteresse !== 'todos'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece adicionando seu primeiro lead'
                }
              </p>
              {onNovoLead && !busca && filtroStatus === 'todos' && filtroOrigem === 'todos' && filtroInteresse === 'todos' && (
                <Button onClick={onNovoLead} className="mt-4">
                  ➕ Adicionar Primeiro Lead
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          leadsFiltrados.map((lead) => (
            <Card 
              key={lead.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onLeadSelecionado?.(lead)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {lead.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">{lead.nome}</h3>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(lead.score)}`}>
                            Score: {lead.score}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {lead.cargo && `${lead.cargo} • `}{lead.empresa || 'Empresa não informada'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Contato</p>
                        <p className="text-sm text-gray-900">{lead.email}</p>
                        <p className="text-sm text-gray-900">{lead.telefone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Valor Potencial</p>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(lead.valorPotencial)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Data Captura</p>
                        <p className="text-sm text-gray-900">{formatDate(lead.dataCaptura)}</p>
                        {lead.dataUltimoContato && (
                          <p className="text-xs text-gray-500">Último: {formatDate(lead.dataUltimoContato)}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Responsável</p>
                        <p className="text-sm text-gray-900">{lead.responsavel}</p>
                        {lead.proximoContato && (
                          <p className="text-xs text-gray-500">Próximo: {formatDate(lead.proximoContato)}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {lead.origem}
                        </Badge>
                        <Badge className={getInteresseColor(lead.interesseNivel)}>
                          Interesse {lead.interesseNivel}
                        </Badge>
                      </div>
                      
                      {lead.status === 'qualificado' && (
                        <Button
                          size="sm"
                          onClick={(e) => handleConverterLead(lead.id, e)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          🔄 Converter
                        </Button>
                      )}
                    </div>
                    
                    {lead.observacoes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{lead.observacoes}</p>
                      </div>
                    )}
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