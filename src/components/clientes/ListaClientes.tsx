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
import { Cliente } from '@/lib/types';

interface ListaClientesProps {
  onClienteSelecionado?: (cliente: Cliente) => void;
  onNovoCliente?: () => void;
}

export function ListaClientes({ onClienteSelecionado, onNovoCliente }: ListaClientesProps) {
  const { clientes } = useCRM();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroOrigem, setFiltroOrigem] = useState<string>('todos');

  // Filtrar e buscar clientes
  const clientesFiltrados = useMemo(() => {
    return clientes.filter(cliente => {
      const matchBusca = !busca || 
        cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
        cliente.email.toLowerCase().includes(busca.toLowerCase()) ||
        cliente.empresa.toLowerCase().includes(busca.toLowerCase());
      
      const matchStatus = filtroStatus === 'todos' || cliente.status === filtroStatus;
      const matchOrigem = filtroOrigem === 'todos' || cliente.origem === filtroOrigem;
      
      return matchBusca && matchStatus && matchOrigem;
    });
  }, [clientes, busca, filtroStatus, filtroOrigem]);

  // Estatísticas dos clientes filtrados
  const estatisticas = useMemo(() => {
    return {
      total: clientesFiltrados.length,
      ativos: clientesFiltrados.filter(c => c.status === 'ativo').length,
      prospectos: clientesFiltrados.filter(c => c.status === 'prospecto').length,
      valorTotal: clientesFiltrados.reduce((sum, c) => sum + c.valorTotal, 0)
    };
  }, [clientesFiltrados]);

  // Obter origens únicas
  const origensUnicas = Array.from(new Set(clientes.map(c => c.origem)));

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>👥</span>
                <span>Gestão de Clientes</span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {estatisticas.total} clientes encontrados
              </p>
            </div>
            {onNovoCliente && (
              <Button onClick={onNovoCliente} className="bg-blue-600 hover:bg-blue-700">
                ➕ Novo Cliente
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Buscar por nome, email ou empresa..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full"
            />
            
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="prospecto">Prospecto</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filtroOrigem} onValueChange={setFiltroOrigem}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as origens</SelectItem>
                {origensUnicas.map(origem => (
                  <SelectItem key={origem} value={origem}>
                    {(origem as string).charAt(0).toUpperCase() + (origem as string).slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Total</div>
              <div className="text-xl font-bold text-blue-900">{estatisticas.total}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Ativos</div>
              <div className="text-xl font-bold text-green-900">{estatisticas.ativos}</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-sm text-yellow-600 font-medium">Prospectos</div>
              <div className="text-xl font-bold text-yellow-900">{estatisticas.prospectos}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Valor Total</div>
              <div className="text-xl font-bold text-purple-900">{formatCurrency(estatisticas.valorTotal)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de clientes */}
      <div className="space-y-4">
        {clientesFiltrados.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente encontrado</h3>
              <p className="text-gray-600">
                {busca || filtroStatus !== 'todos' || filtroOrigem !== 'todos' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece adicionando seu primeiro cliente'
                }
              </p>
              {onNovoCliente && !busca && filtroStatus === 'todos' && filtroOrigem === 'todos' && (
                <Button onClick={onNovoCliente} className="mt-4">
                  ➕ Adicionar Primeiro Cliente
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          clientesFiltrados.map((cliente) => (
            <Card 
              key={cliente.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onClienteSelecionado?.(cliente)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {cliente.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{cliente.nome}</h3>
                        <p className="text-sm text-gray-600">{cliente.cargo} • {cliente.empresa}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Contato</p>
                        <p className="text-sm text-gray-900">{cliente.email}</p>
                        <p className="text-sm text-gray-900">{cliente.telefone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Valor Total</p>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(cliente.valorTotal)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Último Contato</p>
                        <p className="text-sm text-gray-900">{formatDate(cliente.dataUltimoContato)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(cliente.status)}>
                        {cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {cliente.origem}
                      </Badge>
                      <div className="flex flex-wrap gap-1">
                        {cliente.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {cliente.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{cliente.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Cliente desde</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(cliente.dataCadastro)}</p>
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