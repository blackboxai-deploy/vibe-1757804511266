'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/Sidebar';
import { ListaTarefas } from '@/components/tarefas/ListaTarefas';
import { FormularioTarefa } from '@/components/tarefas/FormularioTarefa';
import { Tarefa } from '@/lib/types';

type ViewMode = 'lista' | 'novo' | 'editar';

export default function TarefasPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('lista');
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Tarefa | null>(null);

  const handleNovaTarefa = () => {
    setTarefaSelecionada(null);
    setViewMode('novo');
  };

  const handleEditarTarefa = (tarefa: Tarefa) => {
    setTarefaSelecionada(tarefa);
    setViewMode('editar');
  };

  const handleVoltarLista = () => {
    setTarefaSelecionada(null);
    setViewMode('lista');
  };

  const handleSalvarTarefa = () => {
    handleVoltarLista();
  };

  return (
    <MainLayout>
      <div className="p-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex space-x-2 text-sm text-gray-600">
            <button
              onClick={() => setViewMode('lista')}
              className={`hover:text-gray-900 ${viewMode === 'lista' ? 'text-gray-900 font-medium' : ''}`}
            >
              Tarefas
            </button>
            {viewMode === 'novo' && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-medium">Nova Tarefa</span>
              </>
            )}
            {viewMode === 'editar' && tarefaSelecionada && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-medium">{tarefaSelecionada.titulo}</span>
              </>
            )}
          </nav>
        </div>

        {/* Conteúdo */}
        {viewMode === 'lista' && (
          <ListaTarefas
            onTarefaSelecionada={handleEditarTarefa}
            onNovaTarefa={handleNovaTarefa}
          />
        )}

        {viewMode === 'novo' && (
          <FormularioTarefa
            onSalvar={handleSalvarTarefa}
            onCancelar={handleVoltarLista}
          />
        )}

        {viewMode === 'editar' && tarefaSelecionada && (
          <FormularioTarefa
            tarefa={tarefaSelecionada}
            onSalvar={handleSalvarTarefa}
            onCancelar={handleVoltarLista}
          />
        )}
      </div>
    </MainLayout>
  );
}