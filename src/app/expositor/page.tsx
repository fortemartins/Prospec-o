'use client';

import { ExpositorForm } from '@/components/forms/expositor-form';
import { AppHeader } from '@/components/app-header';

export default function ExpositorPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Novo Expositor" showBack />
      <ExpositorForm />
    </div>
  );
}
