"use client";

import { Suspense } from 'react';
import TrackingPage from './TrackingPage';

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TrackingPage />
    </Suspense>
  );
}

