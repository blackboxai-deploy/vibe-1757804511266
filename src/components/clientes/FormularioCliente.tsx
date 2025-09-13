'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCRM } from '@/lib/context';
import { Cliente } from '@/lib/types';

interface FormularioClienteProps {
  cliente?: Cliente;
  onSalvar?: () => void;
  onCancelar?: () => void;
}

export function FormularioCliente({ cliente, onSalvar, onCancelar }: FormularioClienteProps) {
  const { adicionarCliente, editarCliente } = useCRM();
  const isEdicao = !!cliente;

  const [formData, setFormData] = useState({
    nome: cliente?.nome || '',
    email: cliente?.email || '',
    telefone: cliente?.telefone || '',
    empresa: cliente?.empresa || '',
    cargo: cliente?.cargo || '',
    endereco: {
      rua: cliente?.endereco?.rua || '',
      cidade: cliente?.endereco?.cidade || '',
      estado: cliente?.endereco?.estado || '',
      cep: cliente?.endereco?.cep || ''
    },
    status: cliente?.status || 'prospecto',
    valorTotal: cliente?.valorTotal || 0,
    origem: cliente?.origem || 'website',
    tags: cliente?.tags?.join(', ') || '',
    observacoes: cliente?.observacoes || ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleEnderecoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.empresa.trim()) {
      newErrors.empresa = 'Empresa é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const clienteData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        dataUltimoContato: new Date().toISOString().split('T')[0],
        dataCadastro: cliente?.dataCadastro || new Date().toISOString().split('T')[0]
      };

      if (isEdicao && cliente) {
        editarCliente(cliente.id, clienteData);
      } else {
        adicionarCliente(clienteData);
      }

      onSalvar?.();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{isEdicao ? '✏️' : '➕'}</span>
          <span>{isEdicao ? 'Editar Cliente' : 'Novo Cliente'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  placeholder="Nome completo"
                  className={errors.nome ? 'border-red-500' : ''}
                />
                {errors.nome && <p className="text-sm text-red-600 mt-1">{errors.nome}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@empresa.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  className={errors.telefone ? 'border-red-500' : ''}
                />
                {errors.telefone && <p className="text-sm text-red-600 mt-1">{errors.telefone}</p>}
              </div>

              <div>
                <Label htmlFor="empresa">Empresa *</Label>
                <Input
                  id="empresa"
                  value={formData.empresa}
                  onChange={(e) => handleChange('empresa', e.target.value)}
                  placeholder="Nome da empresa"
                  className={errors.empresa ? 'border-red-500' : ''}
                />
                {errors.empresa && <p className="text-sm text-red-600 mt-1">{errors.empresa}</p>}
              </div>

              <div>
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  value={formData.cargo}
                  onChange={(e) => handleChange('cargo', e.target.value)}
                  placeholder="Ex: CEO, Diretor, etc."
                />
              </div>

              <div>
                <Label htmlFor="valorTotal">Valor Total (R$)</Label>
                <Input
                  id="valorTotal"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.valorTotal}
                  onChange={(e) => handleChange('valorTotal', parseFloat(e.target.value) || 0)}
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>

          {/* Status e Origem */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Status e Origem</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospecto">Prospecto</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="origem">Origem</Label>
                <Select value={formData.origem} onValueChange={(value) => handleChange('origem', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="indicacao">Indicação</SelectItem>
                    <SelectItem value="evento">Evento</SelectItem>
                    <SelectItem value="cold-email">Cold Email</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Endereço</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="rua">Rua</Label>
                <Input
                  id="rua"
                  value={formData.endereco.rua}
                  onChange={(e) => handleEnderecoChange('rua', e.target.value)}
                  placeholder="Rua, número"
                />
              </div>

              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.endereco.cidade}
                  onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                  placeholder="Cidade"
                />
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.endereco.estado}
                  onChange={(e) => handleEnderecoChange('estado', e.target.value)}
                  placeholder="SP"
                />
              </div>

              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.endereco.cep}
                  onChange={(e) => handleEnderecoChange('cep', e.target.value)}
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>

          {/* Tags e Observações */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Informações Adicionais</h3>
            
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="Separe as tags por vírgula (ex: vip, enterprise, priority)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Use tags para categorizar seus clientes
              </p>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
                placeholder="Notas importantes sobre o cliente..."
                rows={4}
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Salvando...' : (isEdicao ? 'Atualizar Cliente' : 'Criar Cliente')}
            </Button>
            
            {onCancelar && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancelar}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}