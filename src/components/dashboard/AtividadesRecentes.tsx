'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCRM } from '@/lib/context';
import { formatDateTime } from '@/lib/data';

export function AtividadesRecentes() {
  const { atividades } = useCRM();
  
  // Pegar as 5 atividades mais recentes
  const atividadesRecentes = atividades
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5);

  const getActivityIcon = (tipo: string) => {
    const icons: { [key: string]: string } = {
      'cliente_criado': '👤',
      'lead_criado': '🎯',
      'oportunidade_criada': '💰',
      'tarefa_criada': '✅',
      'ligacao_realizada': '📞',
      'email_enviado': '📧',
      'reuniao_agendada': '📅',
      'proposta_enviada': '📄',
      'negocio_fechado': '🎉',
      'negocio_perdido': '😞'
    };
    return icons[tipo] || '📋';
  };

  const getActivityColor = (tipo: string) => {
    const colors: { [key: string]: string } = {
      'cliente_criado': 'bg-green-100 text-green-800',
      'lead_criado': 'bg-blue-100 text-blue-800',
      'oportunidade_criada': 'bg-yellow-100 text-yellow-800',
      'tarefa_criada': 'bg-purple-100 text-purple-800',
      'ligacao_realizada': 'bg-indigo-100 text-indigo-800',
      'email_enviado': 'bg-cyan-100 text-cyan-800',
      'reuniao_agendada': 'bg-orange-100 text-orange-800',
      'proposta_enviada': 'bg-pink-100 text-pink-800',
      'negocio_fechado': 'bg-green-100 text-green-800',
      'negocio_perdido': 'bg-red-100 text-red-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>📋</span>
          <span>Atividades Recentes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {atividadesRecentes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma atividade recente</p>
            </div>
          ) : (
            atividadesRecentes.map((atividade) => (
              <div 
                key={atividade.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${getActivityColor(atividade.tipo)}`}>
                    {getActivityIcon(atividade.tipo)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {atividade.titulo}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {atividade.descricao}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {atividade.usuario}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDateTime(atividade.data)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {atividadesRecentes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Ver todas as atividades →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}