'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/Sidebar';
import { ListaLeads } from '@/components/leads/ListaLeads';
import { FormularioLead } from '@/components/leads/FormularioLead';
import { Lead } from '@/lib/types';

type ViewMode = 'lista' | 'novo' | 'editar';

export default function LeadsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('lista');
  const [leadSelecionado, setLeadSelecionado] = useState<Lead | null>(null);

  const handleNovoLead = () => {
    setLeadSelecionado(null);
    setViewMode('novo');
  };

  const handleEditarLead = (lead: Lead) => {
    setLeadSelecionado(lead);
    setViewMode('editar');
  };

  const handleVoltarLista = () => {
    setLeadSelecionado(null);
    setViewMode('lista');
  };

  const handleSalvarLead = () => {
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
              Leads
            </button>
            {viewMode === 'novo' && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-medium">Novo Lead</span>
              </>
            )}
            {viewMode === 'editar' && leadSelecionado && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-medium">{leadSelecionado.nome}</span>
              </>
            )}
          </nav>
        </div>

        {/* Conteúdo */}
        {viewMode === 'lista' && (
          <ListaLeads
            onLeadSelecionado={handleEditarLead}
            onNovoLead={handleNovoLead}
          />
        )}

        {viewMode === 'novo' && (
          <FormularioLead
            onSalvar={handleSalvarLead}
            onCancelar={handleVoltarLista}
          />
        )}

        {viewMode === 'editar' && leadSelecionado && (
          <FormularioLead
            lead={leadSelecionado}
            onSalvar={handleSalvarLead}
            onCancelar={handleVoltarLista}
          />
        )}
      </div>
    </MainLayout>
  );
}