'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCRM } from '@/lib/context';
import { formatCurrency, formatDate } from '@/lib/data';

export function RelatorioVendas() {
  const { oportunidades, clientes, leads, exportarDados } = useCRM();

  const dadosVendas = useMemo(() => {
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const inicioAno = new Date(agora.getFullYear(), 0, 1);

    // Oportunidades ganhas
    const oportunidadesGanhas = oportunidades.filter(op => op.estagio === 'ganho');
    const oportunidadesPerdidas = oportunidades.filter(op => op.estagio === 'perdido');
    const oportunidadesAtivas = oportunidades.filter(op => !['ganho', 'perdido'].includes(op.estagio));

    // Vendas por período
    const vendasMes = oportunidadesGanhas.filter(op => 
      op.dataFechamentoReal && new Date(op.dataFechamentoReal) >= inicioMes
    );
    const vendasAno = oportunidadesGanhas.filter(op => 
      op.dataFechamentoReal && new Date(op.dataFechamentoReal) >= inicioAno
    );

    // Vendas por responsável
    const vendasPorResponsavel = oportunidadesGanhas.reduce((acc, op) => {
      acc[op.responsavel] = (acc[op.responsavel] || 0) + op.valor;
      return acc;
    }, {} as { [key: string]: number });

    // Pipeline por estágio
    const pipelinePorEstagio = oportunidadesAtivas.reduce((acc, op) => {
      acc[op.estagio] = (acc[op.estagio] || 0) + op.valor;
      return acc;
    }, {} as { [key: string]: number });

    // Taxa de conversão
    const totalLeads = leads.length;
    const leadsConvertidos = leads.filter(lead => lead.status === 'convertido').length;
    const taxaConversaoLeads = totalLeads > 0 ? (leadsConvertidos / totalLeads) * 100 : 0;

    const totalOportunidades = oportunidades.length;
    const oportunidadesFechadas = oportunidadesGanhas.length + oportunidadesPerdidas.length;
    const taxaFechamento = totalOportunidades > 0 ? (oportunidadesFechadas / totalOportunidades) * 100 : 0;
    const taxaSucesso = oportunidadesFechadas > 0 ? (oportunidadesGanhas.length / oportunidadesFechadas) * 100 : 0;

    return {
      vendasMes,
      vendasAno,
      vendasPorResponsavel,
      pipelinePorEstagio,
      taxaConversaoLeads,
      taxaFechamento,
      taxaSucesso,
      valorTotalGanho: oportunidadesGanhas.reduce((sum, op) => sum + op.valor, 0),
      valorTotalPerdido: oportunidadesPerdidas.reduce((sum, op) => sum + op.valor, 0),
      valorPipeline: oportunidadesAtivas.reduce((sum, op) => sum + op.valor, 0),
      ticketMedio: oportunidadesGanhas.length > 0 ? 
        oportunidadesGanhas.reduce((sum, op) => sum + op.valor, 0) / oportunidadesGanhas.length : 0
    };
  }, [oportunidades, leads]);

  const handleExportarDados = () => {
    const dados = exportarDados();
    const blob = new Blob([dados], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crm-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>📈</span>
                <span>Relatórios de Vendas</span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Análise completa de performance e métricas de vendas
              </p>
            </div>
            <Button onClick={handleExportarDados} variant="outline">
              💾 Exportar Dados
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(dadosVendas.valorTotalGanho)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total em Vendas</div>
              <div className="text-xs text-gray-500 mt-2">
                {oportunidades.filter(op => op.estagio === 'ganho').length} oportunidades fechadas
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(dadosVendas.valorPipeline)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Pipeline Ativo</div>
              <div className="text-xs text-gray-500 mt-2">
                {oportunidades.filter(op => !['ganho', 'perdido'].includes(op.estagio)).length} oportunidades ativas
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(dadosVendas.ticketMedio)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Ticket Médio</div>
              <div className="text-xs text-gray-500 mt-2">
                Valor médio por venda
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {dadosVendas.taxaSucesso.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Taxa de Sucesso</div>
              <div className="text-xs text-gray-500 mt-2">
                Oportunidades ganhas vs perdidas
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análise de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance por Responsável</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(dadosVendas.vendasPorResponsavel)
                .sort(([,a], [,b]) => b - a)
                .map(([responsavel, valor]) => (
                <div key={responsavel} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{responsavel}</div>
                    <div className="text-sm text-gray-600">
                      {oportunidades.filter(op => op.responsavel === responsavel && op.estagio === 'ganho').length} vendas
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(valor)}
                  </div>
                </div>
              ))}
              {Object.keys(dadosVendas.vendasPorResponsavel).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma venda registrada ainda
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline por Estágio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(dadosVendas.pipelinePorEstagio)
                .sort(([,a], [,b]) => b - a)
                .map(([estagio, valor]) => (
                <div key={estagio} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 capitalize">
                      {estagio.replace('-', ' ')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {oportunidades.filter(op => op.estagio === estagio).length} oportunidades
                    </div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatCurrency(valor)}
                  </div>
                </div>
              ))}
              {Object.keys(dadosVendas.pipelinePorEstagio).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma oportunidade ativa
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Taxa de Conversão */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversão de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {dadosVendas.taxaConversaoLeads.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 mb-4">
                {leads.filter(l => l.status === 'convertido').length} de {leads.length} leads convertidos
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(dadosVendas.taxaConversaoLeads, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxa de Fechamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {dadosVendas.taxaFechamento.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Oportunidades fechadas vs abertas
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(dadosVendas.taxaFechamento, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxa de Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {dadosVendas.taxaSucesso.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Oportunidades ganhas vs perdidas
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(dadosVendas.taxaSucesso, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendas Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {oportunidades
              .filter(op => op.estagio === 'ganho')
              .sort((a, b) => new Date(b.dataFechamentoReal || b.dataInicio).getTime() - 
                             new Date(a.dataFechamentoReal || a.dataInicio).getTime())
              .slice(0, 10)
              .map((oportunidade) => {
                const cliente = clientes.find(c => c.id === oportunidade.clienteId);
                return (
                  <div key={oportunidade.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{oportunidade.titulo}</div>
                      <div className="text-sm text-gray-600">
                        {cliente?.nome || 'Cliente não encontrado'} • {oportunidade.responsavel}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Fechado em {formatDate(oportunidade.dataFechamentoReal || oportunidade.dataInicio)}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(oportunidade.valor)}
                    </div>
                  </div>
                );
              })}
            {oportunidades.filter(op => op.estagio === 'ganho').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhuma venda registrada ainda
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}