import { Suspense } from 'react';
import { OrbitApp } from '@/components/orbit-app';

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <OrbitApp />
    </Suspense>
  );
}
