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
import { Lead } from '@/lib/types';

interface FormularioLeadProps {
  lead?: Lead;
  onSalvar?: () => void;
  onCancelar?: () => void;
}

export function FormularioLead({ lead, onSalvar, onCancelar }: FormularioLeadProps) {
  const { adicionarLead, editarLead, usuarios } = useCRM();
  const isEdicao = !!lead;

  const [formData, setFormData] = useState({
    nome: lead?.nome || '',
    email: lead?.email || '',
    telefone: lead?.telefone || '',
    empresa: lead?.empresa || '',
    cargo: lead?.cargo || '',
    origem: lead?.origem || 'website',
    status: lead?.status || 'novo',
    score: lead?.score || 50,
    interesseNivel: lead?.interesseNivel || 'medio',
    valorPotencial: lead?.valorPotencial || 0,
    responsavel: lead?.responsavel || '',
    proximoContato: lead?.proximoContato || '',
    observacoes: lead?.observacoes || ''
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
      const leadData = {
        ...formData,
        dataCaptura: lead?.dataCaptura || new Date().toISOString().split('T')[0],
        dataUltimoContato: isEdicao ? new Date().toISOString().split('T')[0] : undefined
      };

      if (isEdicao && lead) {
        editarLead(lead.id, leadData);
      } else {
        adicionarLead(leadData);
      }

      onSalvar?.();
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Baixo';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{isEdicao ? '✏️' : '➕'}</span>
          <span>{isEdicao ? 'Editar Lead' : 'Novo Lead'}</span>
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
                <Label htmlFor="empresa">Empresa</Label>
                <Input
                  id="empresa"
                  value={formData.empresa}
                  onChange={(e) => handleChange('empresa', e.target.value)}
                  placeholder="Nome da empresa"
                />
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
                <Label htmlFor="valorPotencial">Valor Potencial (R$)</Label>
                <Input
                  id="valorPotencial"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.valorPotencial}
                  onChange={(e) => handleChange('valorPotencial', parseFloat(e.target.value) || 0)}
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>

          {/* Qualificação e Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Qualificação e Status</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novo">Novo</SelectItem>
                    <SelectItem value="contactado">Contactado</SelectItem>
                    <SelectItem value="qualificado">Qualificado</SelectItem>
                    <SelectItem value="desqualificado">Desqualificado</SelectItem>
                    <SelectItem value="convertido">Convertido</SelectItem>
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

              <div>
                <Label htmlFor="interesseNivel">Nível de Interesse</Label>
                <Select value={formData.interesseNivel} onValueChange={(value) => handleChange('interesseNivel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixo">Baixo</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="alto">Alto</SelectItem>
                  </SelectContent>
                </Select>
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

            {/* Score do Lead */}
            <div>
              <Label htmlFor="score">
                Score do Lead: 
                <span className={`ml-2 font-semibold ${getScoreColor(formData.score)}`}>
                  {formData.score} - {getScoreLabel(formData.score)}
                </span>
              </Label>
              <div className="mt-2">
                <Slider
                  value={[formData.score]}
                  onValueChange={(value) => handleChange('score', value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 - Sem interesse</span>
                  <span>50 - Interesse médio</span>
                  <span>100 - Muito interessado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Agendamentos e Observações */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Agendamentos e Observações</h3>
            
            <div>
              <Label htmlFor="proximoContato">Próximo Contato</Label>
              <Input
                id="proximoContato"
                type="date"
                value={formData.proximoContato}
                onChange={(e) => handleChange('proximoContato', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-sm text-gray-500 mt-1">
                Data para próxima ação de follow-up
              </p>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
                placeholder="Notas importantes sobre o lead, conversas anteriores, interesses específicos..."
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
              {isLoading ? 'Salvando...' : (isEdicao ? 'Atualizar Lead' : 'Criar Lead')}
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