'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/Sidebar';
import { ListaOportunidades } from '@/components/oportunidades/ListaOportunidades';
import { FormularioOportunidade } from '@/components/oportunidades/FormularioOportunidade';
import { Oportunidade } from '@/lib/types';

type ViewMode = 'lista' | 'novo' | 'editar';

export default function OportunidadesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('lista');
  const [oportunidadeSelecionada, setOportunidadeSelecionada] = useState<Oportunidade | null>(null);

  const handleNovaOportunidade = () => {
    setOportunidadeSelecionada(null);
    setViewMode('novo');
  };

  const handleEditarOportunidade = (oportunidade: Oportunidade) => {
    setOportunidadeSelecionada(oportunidade);
    setViewMode('editar');
  };

  const handleVoltarLista = () => {
    setOportunidadeSelecionada(null);
    setViewMode('lista');
  };

  const handleSalvarOportunidade = () => {
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
              Oportunidades
            </button>
            {viewMode === 'novo' && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-medium">Nova Oportunidade</span>
              </>
            )}
            {viewMode === 'editar' && oportunidadeSelecionada && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-medium">{oportunidadeSelecionada.titulo}</span>
              </>
            )}
          </nav>
        </div>

        {/* Conteúdo */}
        {viewMode === 'lista' && (
          <ListaOportunidades
            onOportunidadeSelecionada={handleEditarOportunidade}
            onNovaOportunidade={handleNovaOportunidade}
          />
        )}

        {viewMode === 'novo' && (
          <FormularioOportunidade
            onSalvar={handleSalvarOportunidade}
            onCancelar={handleVoltarLista}
          />
        )}

        {viewMode === 'editar' && oportunidadeSelecionada && (
          <FormularioOportunidade
            oportunidade={oportunidadeSelecionada}
            onSalvar={handleSalvarOportunidade}
            onCancelar={handleVoltarLista}
          />
        )}
      </div>
    </MainLayout>
  );
}