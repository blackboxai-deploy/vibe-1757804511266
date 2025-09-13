'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCRM } from '@/lib/context';
import { formatDate } from '@/lib/data';

export function TarefasPendentes() {
  const { tarefas, concluirTarefa } = useCRM();
  
  // Filtrar tarefas pendentes e ordenar por data de vencimento
  const tarefasPendentes = tarefas
    .filter(tarefa => tarefa.status === 'pendente')
    .sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime())
    .slice(0, 5);

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

  const handleConcluirTarefa = (tarefaId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    concluirTarefa(tarefaId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>✅</span>
            <span>Tarefas Pendentes</span>
          </div>
          <Badge variant="secondary">
            {tarefasPendentes.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tarefasPendentes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>🎉 Nenhuma tarefa pendente!</p>
              <p className="text-sm">Você está em dia!</p>
            </div>
          ) : (
            tarefasPendentes.map((tarefa) => (
              <div 
                key={tarefa.id}
                className={`p-3 rounded-lg border transition-colors hover:bg-gray-50 cursor-pointer ${
                  isVencida(tarefa.dataVencimento) ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getTipoIcon(tarefa.tipo)}</span>
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {tarefa.titulo}
                      </h4>
                      <Badge 
                        variant="outline"
                        className={getPrioridadeColor(tarefa.prioridade)}
                      >
                        {tarefa.prioridade}
                      </Badge>
                    </div>
                    
                    {tarefa.descricao && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {tarefa.descricao}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>📅 {formatDate(tarefa.dataVencimento)}</span>
                        <span>👤 {tarefa.responsavel}</span>
                        {tarefa.tempoEstimado && (
                          <span>⏱️ {tarefa.tempoEstimado}min</span>
                        )}
                      </div>
                      
                      {isVencida(tarefa.dataVencimento) && (
                        <Badge variant="destructive" className="text-xs">
                          Vencida
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => handleConcluirTarefa(tarefa.id, e)}
                    className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors flex items-center justify-center"
                    title="Marcar como concluída"
                  >
                    <span className="text-xs text-gray-400 hover:text-green-600">✓</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {tarefasPendentes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Ver todas as tarefas →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}