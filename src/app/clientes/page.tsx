'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/Sidebar';
import { ListaClientes } from '@/components/clientes/ListaClientes';
import { FormularioCliente } from '@/components/clientes/FormularioCliente';
import { Cliente } from '@/lib/types';

type ViewMode = 'lista' | 'novo' | 'editar';

export default function ClientesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('lista');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);

  const handleNovoCliente = () => {
    setClienteSelecionado(null);
    setViewMode('novo');
  };

  const handleEditarCliente = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setViewMode('editar');
  };

  const handleVoltarLista = () => {
    setClienteSelecionado(null);
    setViewMode('lista');
  };

  const handleSalvarCliente = () => {
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
              Clientes
            </button>
            {viewMode === 'novo' && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-medium">Novo Cliente</span>
              </>
            )}
            {viewMode === 'editar' && clienteSelecionado && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-medium">{clienteSelecionado.nome}</span>
              </>
            )}
          </nav>
        </div>

        {/* Conteúdo */}
        {viewMode === 'lista' && (
          <ListaClientes
            onClienteSelecionado={handleEditarCliente}
            onNovoCliente={handleNovoCliente}
          />
        )}

        {viewMode === 'novo' && (
          <FormularioCliente
            onSalvar={handleSalvarCliente}
            onCancelar={handleVoltarLista}
          />
        )}

        {viewMode === 'editar' && clienteSelecionado && (
          <FormularioCliente
            cliente={clienteSelecionado}
            onSalvar={handleSalvarCliente}
            onCancelar={handleVoltarLista}
          />
        )}
      </div>
    </MainLayout>
  );
}