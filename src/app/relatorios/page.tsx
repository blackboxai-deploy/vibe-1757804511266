'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/Sidebar';
import { RelatorioVendas } from '@/components/relatorios/RelatorioVendas';

export default function RelatoriosPage() {
  return (
    <MainLayout>
      <div className="p-8">
        <RelatorioVendas />
      </div>
    </MainLayout>
  );
}