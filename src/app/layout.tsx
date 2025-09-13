import { Inter } from 'next/font/google';
import { CRMProvider } from '@/lib/context';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CRM - Sistema de Gestão de Relacionamento',
  description: 'Sistema completo para gestão de clientes, leads e vendas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <CRMProvider>
          {children}
        </CRMProvider>
      </body>
    </html>
  );
}