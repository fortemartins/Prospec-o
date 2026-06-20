'use client';

import { FornecedorForm } from '@/components/forms/fornecedor-form';
import { AppHeader } from '@/components/app-header';

export default function FornecedorPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Novo Fornecedor" showBack />
      <FornecedorForm />
    </div>
  );
}
