'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCRM } from '@/lib/context';
import { formatCurrency } from '@/lib/data';
import { pipelineConfig } from '@/lib/data';

export function PipelineChart() {
  const { oportunidades } = useCRM();
  
  // Agrupar oportunidades por estágio
  const oportunidadesPorEstagio = Object.entries(pipelineConfig.estagios).reduce((acc, [estagio, config]) => {
    const ops = oportunidades.filter(op => op.estagio === estagio);
    const configData = config as { nome: string; cor: string; ordem: number };
    acc[estagio] = {
      nome: configData.nome,
      cor: configData.cor,
      quantidade: ops.length,
      valor: ops.reduce((sum, op) => sum + op.valor, 0),
      oportunidades: ops
    };
    return acc;
  }, {} as Record<string, { nome: string; cor: string; quantidade: number; valor: number; oportunidades: typeof oportunidades }>);

  const valorTotal = Object.values(oportunidadesPorEstagio).reduce(
    (total: number, estagio) => total + estagio.valor, 0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🏆</span>
          <span>Pipeline de Vendas</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Total do Pipeline: {formatCurrency(valorTotal)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(oportunidadesPorEstagio)
            .filter(([, data]) => data.quantidade > 0)
            .map(([estagio, data]) => {
              const percentual = valorTotal > 0 ? (data.valor / valorTotal) * 100 : 0;
              
              return (
                <div key={estagio} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${data.cor}`} />
                      <span className="text-sm font-medium text-gray-900">
                        {data.nome}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({data.quantidade} {data.quantidade === 1 ? 'oportunidade' : 'oportunidades'})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(data.valor)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {percentual.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Barra de progresso */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${data.cor} transition-all duration-300`}
                      style={{ width: `${percentual}%` }}
                    />
                  </div>
                  
                  {/* Lista de oportunidades */}
                  {data.oportunidades.length > 0 && (
                    <div className="ml-6 space-y-1">
                      {data.oportunidades.slice(0, 3).map((op) => (
                        <div key={op.id} className="text-xs text-gray-600 flex items-center justify-between">
                          <span className="truncate">{op.titulo}</span>
                          <span className="ml-2 font-medium">{formatCurrency(op.valor)}</span>
                        </div>
                      ))}
                      {data.oportunidades.length > 3 && (
                        <div className="text-xs text-gray-500 ml-2">
                          +{data.oportunidades.length - 3} mais...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
        
        {Object.values(oportunidadesPorEstagio).every((data) => data.quantidade === 0) && (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma oportunidade no pipeline</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}