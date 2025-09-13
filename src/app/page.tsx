'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/Sidebar';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { AtividadesRecentes } from '@/components/dashboard/AtividadesRecentes';
import { PipelineChart } from '@/components/dashboard/PipelineChart';
import { TarefasPendentes } from '@/components/dashboard/TarefasPendentes';
import { useCRM } from '@/lib/context';
import { formatCurrency } from '@/lib/data';

export default function Dashboard() {
  const { metrics } = useCRM();

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Visão geral do seu sistema de CRM - {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Vendas do Mês"
            value={formatCurrency(metrics.vendas.total)}
            subtitle={`Meta: ${formatCurrency(metrics.vendas.meta)}`}
            change={metrics.vendas.crescimento}
            trend="up"
            icon="💰"
          />
          
          <MetricsCard
            title="Leads Novos"
            value={metrics.leads.novos}
            subtitle={`${metrics.leads.qualificados} qualificados`}
            change={metrics.leads.taxaConversao}
            trend="up"
            icon="🎯"
          />
          
          <MetricsCard
            title="Pipeline Ativo"
            value={formatCurrency(metrics.oportunidades.valorPipeline)}
            subtitle={`${metrics.oportunidades.ativas} oportunidades`}
            change={12.5}
            trend="up"
            icon="🏆"
          />
          
          <MetricsCard
            title="Taxa de Conclusão"
            value={`${metrics.tarefas.taxa}%`}
            subtitle={`${metrics.tarefas.pendentes} pendentes`}
            change={-2.3}
            trend={metrics.tarefas.vencidas > 5 ? 'down' : 'neutral'}
            icon="✅"
          />
        </div>

        {/* Métricas secundárias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Total de Clientes"
            value={metrics.clientes.total}
            subtitle={`${metrics.clientes.ativos} ativos`}
            icon="👥"
          />
          
          <MetricsCard
            title="Valor Médio"
            value={formatCurrency(metrics.oportunidades.valorMedio)}
            subtitle="Por oportunidade"
            icon="📊"
          />
          
          <MetricsCard
            title="Ciclo de Vendas"
            value={`${metrics.oportunidades.cicloMedio} dias`}
            subtitle="Tempo médio"
            icon="⏱️"
          />
          
          <MetricsCard
            title="Conversão de Leads"
            value={`${metrics.leads.taxaConversao}%`}
            subtitle={`${metrics.leads.convertidos}/${metrics.leads.novos + metrics.leads.qualificados} convertidos`}
            icon="🔄"
          />
        </div>

        {/* Seção principal com gráficos e atividades */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Pipeline de vendas */}
          <div className="lg:col-span-2">
            <PipelineChart />
          </div>
          
          {/* Atividades recentes */}
          <div>
            <AtividadesRecentes />
          </div>
        </div>

        {/* Tarefas pendentes */}
        <div className="mb-8">
          <TarefasPendentes />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="text-2xl mb-2">➕</div>
              <div className="text-sm font-medium text-gray-900">Novo Cliente</div>
            </button>
            
            <button className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm font-medium text-gray-900">Adicionar Lead</div>
            </button>
            
            <button className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-sm font-medium text-gray-900">Nova Oportunidade</div>
            </button>
            
            <button className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="text-2xl mb-2">✅</div>
              <div className="text-sm font-medium text-gray-900">Criar Tarefa</div>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}