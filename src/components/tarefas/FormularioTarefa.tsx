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
import { Tarefa } from '@/lib/types';

interface FormularioTarefaProps {
  tarefa?: Tarefa;
  onSalvar?: () => void;
  onCancelar?: () => void;
}

export function FormularioTarefa({ tarefa, onSalvar, onCancelar }: FormularioTarefaProps) {
  const { adicionarTarefa, editarTarefa, clientes, leads, oportunidades, usuarios } = useCRM();
  const isEdicao = !!tarefa;

  const [formData, setFormData] = useState({
    titulo: tarefa?.titulo || '',
    descricao: tarefa?.descricao || '',
    tipo: tarefa?.tipo || 'ligacao',
    prioridade: tarefa?.prioridade || 'media',
    status: tarefa?.status || 'pendente',
    dataVencimento: tarefa?.dataVencimento || '',
    responsavel: tarefa?.responsavel || '',
    clienteId: tarefa?.clienteId || '',
    leadId: tarefa?.leadId || '',
    oportunidadeId: tarefa?.oportunidadeId || '',
    tempoEstimado: tarefa?.tempoEstimado || 30,
    observacoes: tarefa?.observacoes || ''
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    if (!formData.dataVencimento) {
      newErrors.dataVencimento = 'Data de vencimento é obrigatória';
    }

    if (!formData.responsavel) {
      newErrors.responsavel = 'Responsável é obrigatório';
    }

    // Validar que apenas um relacionamento foi selecionado
    const relacionamentos = [formData.clienteId, formData.leadId, formData.oportunidadeId].filter(id => id);
    if (relacionamentos.length > 1) {
      newErrors.relacionamento = 'Selecione apenas um relacionamento (cliente, lead ou oportunidade)';
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
      const tarefaData = {
        ...formData,
        dataCriacao: tarefa?.dataCriacao || new Date().toISOString().split('T')[0],
        clienteId: formData.clienteId || undefined,
        leadId: formData.leadId || undefined,
        oportunidadeId: formData.oportunidadeId || undefined
      };

      if (isEdicao && tarefa) {
        editarTarefa(tarefa.id, tarefaData);
      } else {
        adicionarTarefa(tarefaData);
      }

      onSalvar?.();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{isEdicao ? '✏️' : '➕'}</span>
          <span>{isEdicao ? 'Editar Tarefa' : 'Nova Tarefa'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="titulo">Título da Tarefa *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleChange('titulo', e.target.value)}
                  placeholder="Ex: Ligar para cliente sobre proposta"
                  className={errors.titulo ? 'border-red-500' : ''}
                />
                {errors.titulo && <p className="text-sm text-red-600 mt-1">{errors.titulo}</p>}
              </div>

              <div>
                <Label htmlFor="tipo">Tipo de Tarefa</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleChange('tipo', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ligacao">📞 Ligação</SelectItem>
                    <SelectItem value="email">📧 Email</SelectItem>
                    <SelectItem value="reuniao">👥 Reunião</SelectItem>
                    <SelectItem value="apresentacao">📊 Apresentação</SelectItem>
                    <SelectItem value="follow-up">🔄 Follow-up</SelectItem>
                    <SelectItem value="proposta">📋 Proposta</SelectItem>
                    <SelectItem value="outro">📝 Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select value={formData.prioridade} onValueChange={(value) => handleChange('prioridade', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">🟢 Baixa</SelectItem>
                    <SelectItem value="media">🟡 Média</SelectItem>
                    <SelectItem value="alta">🟠 Alta</SelectItem>
                    <SelectItem value="urgente">🔴 Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isEdicao && (
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="em-andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="tempoEstimado">Tempo Estimado (minutos)</Label>
                <Input
                  id="tempoEstimado"
                  type="number"
                  min="5"
                  step="5"
                  value={formData.tempoEstimado}
                  onChange={(e) => handleChange('tempoEstimado', parseInt(e.target.value) || 30)}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleChange('descricao', e.target.value)}
                  placeholder="Descreva os detalhes da tarefa..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Data e Responsável */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Data e Responsável</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataVencimento">Data de Vencimento *</Label>
                <Input
                  id="dataVencimento"
                  type="date"
                  value={formData.dataVencimento}
                  onChange={(e) => handleChange('dataVencimento', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={errors.dataVencimento ? 'border-red-500' : ''}
                />
                {errors.dataVencimento && <p className="text-sm text-red-600 mt-1">{errors.dataVencimento}</p>}
              </div>

              <div>
                <Label htmlFor="responsavel">Responsável *</Label>
                <Select value={formData.responsavel} onValueChange={(value) => handleChange('responsavel', value)}>
                  <SelectTrigger className={errors.responsavel ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecionar responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map(usuario => (
                      <SelectItem key={usuario.id} value={usuario.nome}>
                        {usuario.nome} - {usuario.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.responsavel && <p className="text-sm text-red-600 mt-1">{errors.responsavel}</p>}
              </div>
            </div>
          </div>

          {/* Relacionamentos */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Relacionamentos (Opcional)</h3>
            <p className="text-sm text-gray-600">
              Vincule esta tarefa a um cliente, lead ou oportunidade específica.
            </p>
            
            {errors.relacionamento && (
              <p className="text-sm text-red-600">{errors.relacionamento}</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="clienteId">Cliente</Label>
                <Select 
                  value={formData.clienteId} 
                  onValueChange={(value) => {
                    handleChange('clienteId', value);
                    if (value) {
                      handleChange('leadId', '');
                      handleChange('oportunidadeId', '');
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum cliente</SelectItem>
                    {clientes.map(cliente => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome} - {cliente.empresa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="leadId">Lead</Label>
                <Select 
                  value={formData.leadId} 
                  onValueChange={(value) => {
                    handleChange('leadId', value);
                    if (value) {
                      handleChange('clienteId', '');
                      handleChange('oportunidadeId', '');
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar lead" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum lead</SelectItem>
                    {leads.map(lead => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.nome} - {lead.empresa || 'Sem empresa'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="oportunidadeId">Oportunidade</Label>
                <Select 
                  value={formData.oportunidadeId} 
                  onValueChange={(value) => {
                    handleChange('oportunidadeId', value);
                    if (value) {
                      handleChange('clienteId', '');
                      handleChange('leadId', '');
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar oportunidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma oportunidade</SelectItem>
                    {oportunidades.map(oportunidade => (
                      <SelectItem key={oportunidade.id} value={oportunidade.id}>
                        {oportunidade.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Observações Adicionais</h3>
            
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
                placeholder="Notas importantes, contexto adicional, pontos de atenção..."
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
              {isLoading ? 'Salvando...' : (isEdicao ? 'Atualizar Tarefa' : 'Criar Tarefa')}
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