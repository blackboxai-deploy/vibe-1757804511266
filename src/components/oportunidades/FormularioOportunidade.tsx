'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCRM } from '@/lib/context';
import { Oportunidade } from '@/lib/types';
import { pipelineConfig } from '@/lib/data';

interface FormularioOportunidadeProps {
  oportunidade?: Oportunidade;
  onSalvar?: () => void;
  onCancelar?: () => void;
}

export function FormularioOportunidade({ oportunidade, onSalvar, onCancelar }: FormularioOportunidadeProps) {
  const { adicionarOportunidade, editarOportunidade, clientes, usuarios } = useCRM();
  const isEdicao = !!oportunidade;

  const [formData, setFormData] = useState({
    titulo: oportunidade?.titulo || '',
    descricao: oportunidade?.descricao || '',
    clienteId: oportunidade?.clienteId || '',
    valor: oportunidade?.valor || 0,
    probabilidade: oportunidade?.probabilidade || 50,
    estagio: oportunidade?.estagio || 'prospeccao',
    dataFechamentoPrevista: oportunidade?.dataFechamentoPrevista || '',
    responsavel: oportunidade?.responsavel || '',
    origem: oportunidade?.origem || 'website',
    concorrentes: oportunidade?.concorrentes?.join(', ') || '',
    proximaAcao: oportunidade?.proximaAcao || '',
    dataProximaAcao: oportunidade?.dataProximaAcao || '',
    observacoes: oportunidade?.observacoes || ''
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

    if (!formData.clienteId) {
      newErrors.clienteId = 'Cliente é obrigatório';
    }

    if (!formData.valor || formData.valor <= 0) {
      newErrors.valor = 'Valor deve ser maior que zero';
    }

    if (!formData.dataFechamentoPrevista) {
      newErrors.dataFechamentoPrevista = 'Data de fechamento é obrigatória';
    }

    if (!formData.responsavel) {
      newErrors.responsavel = 'Responsável é obrigatório';
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
      const oportunidadeData = {
        ...formData,
        concorrentes: formData.concorrentes.split(',').map(c => c.trim()).filter(c => c),
        dataInicio: oportunidade?.dataInicio || new Date().toISOString().split('T')[0]
      };

      if (isEdicao && oportunidade) {
        editarOportunidade(oportunidade.id, oportunidadeData);
      } else {
        adicionarOportunidade(oportunidadeData);
      }

      onSalvar?.();
    } catch (error) {
      console.error('Erro ao salvar oportunidade:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProbabilidadeColor = (probabilidade: number) => {
    if (probabilidade >= 80) return 'text-green-600';
    if (probabilidade >= 60) return 'text-yellow-600';
    if (probabilidade >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProbabilidadeLabel = (probabilidade: number) => {
    if (probabilidade >= 80) return 'Muito Alta';
    if (probabilidade >= 60) return 'Alta';
    if (probabilidade >= 40) return 'Média';
    return 'Baixa';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{isEdicao ? '✏️' : '➕'}</span>
          <span>{isEdicao ? 'Editar Oportunidade' : 'Nova Oportunidade'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="titulo">Título da Oportunidade *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleChange('titulo', e.target.value)}
                  placeholder="Ex: Implementação do sistema ERP"
                  className={errors.titulo ? 'border-red-500' : ''}
                />
                {errors.titulo && <p className="text-sm text-red-600 mt-1">{errors.titulo}</p>}
              </div>

              <div>
                <Label htmlFor="clienteId">Cliente *</Label>
                <Select value={formData.clienteId} onValueChange={(value) => handleChange('clienteId', value)}>
                  <SelectTrigger className={errors.clienteId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map(cliente => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome} - {cliente.empresa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.clienteId && <p className="text-sm text-red-600 mt-1">{errors.clienteId}</p>}
              </div>

              <div>
                <Label htmlFor="valor">Valor (R$) *</Label>
                <Input
                  id="valor"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => handleChange('valor', parseFloat(e.target.value) || 0)}
                  placeholder="0,00"
                  className={errors.valor ? 'border-red-500' : ''}
                />
                {errors.valor && <p className="text-sm text-red-600 mt-1">{errors.valor}</p>}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleChange('descricao', e.target.value)}
                  placeholder="Descreva a oportunidade, necessidades do cliente, etc."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Status e Estágio */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Status e Estágio</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estagio">Estágio</Label>
                <Select value={formData.estagio} onValueChange={(value) => handleChange('estagio', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(pipelineConfig.estagios).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {(config as { nome: string; cor: string; ordem: number }).nome}
                      </SelectItem>
                    ))}
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

            {/* Probabilidade */}
            <div>
              <Label htmlFor="probabilidade">
                Probabilidade de Fechamento: 
                <span className={`ml-2 font-semibold ${getProbabilidadeColor(formData.probabilidade)}`}>
                  {formData.probabilidade}% - {getProbabilidadeLabel(formData.probabilidade)}
                </span>
              </Label>
              <div className="mt-2">
                <Slider
                  value={[formData.probabilidade]}
                  onValueChange={(value) => handleChange('probabilidade', value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0% - Improvável</span>
                  <span>50% - Possível</span>
                  <span>100% - Garantido</span>
                </div>
              </div>
            </div>
          </div>

          {/* Datas e Responsável */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Datas e Responsável</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataFechamentoPrevista">Data de Fechamento Prevista *</Label>
                <Input
                  id="dataFechamentoPrevista"
                  type="date"
                  value={formData.dataFechamentoPrevista}
                  onChange={(e) => handleChange('dataFechamentoPrevista', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={errors.dataFechamentoPrevista ? 'border-red-500' : ''}
                />
                {errors.dataFechamentoPrevista && <p className="text-sm text-red-600 mt-1">{errors.dataFechamentoPrevista}</p>}
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

              <div>
                <Label htmlFor="dataProximaAcao">Data da Próxima Ação</Label>
                <Input
                  id="dataProximaAcao"
                  type="date"
                  value={formData.dataProximaAcao}
                  onChange={(e) => handleChange('dataProximaAcao', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="proximaAcao">Descrição da Próxima Ação</Label>
                <Input
                  id="proximaAcao"
                  value={formData.proximaAcao}
                  onChange={(e) => handleChange('proximaAcao', e.target.value)}
                  placeholder="Ex: Enviar proposta comercial"
                />
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Informações Adicionais</h3>
            
            <div>
              <Label htmlFor="concorrentes">Concorrentes</Label>
              <Input
                id="concorrentes"
                value={formData.concorrentes}
                onChange={(e) => handleChange('concorrentes', e.target.value)}
                placeholder="Separe os concorrentes por vírgula"
              />
              <p className="text-sm text-gray-500 mt-1">
                Liste os principais concorrentes desta oportunidade
              </p>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
                placeholder="Notas importantes sobre a oportunidade, histórico de conversas, pontos de atenção..."
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
              {isLoading ? 'Salvando...' : (isEdicao ? 'Atualizar Oportunidade' : 'Criar Oportunidade')}
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