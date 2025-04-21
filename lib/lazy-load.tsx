"use client";

import dynamic from "next/dynamic";
import { ComponentType, Suspense } from "react";

interface DynamicImportOptions {
  ssr?: boolean;
  loading?: ComponentType;
}

export function lazyLoad<T = any>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  options: DynamicImportOptions = { ssr: false }
) {
  const { ssr = false, loading: LoadingComponent } = options;
  
  const LazyComponent = dynamic(importFunc, {
    loading: LoadingComponent,
    ssr,
  });

  // Create a wrapper component to handle suspense
  const WrappedComponent = (props: T) => (
    <Suspense fallback={LoadingComponent ? <LoadingComponent /> : <DefaultLoading />}>
      <LazyComponent {...props} />
    </Suspense>
  );

  return WrappedComponent;
}

function DefaultLoading() {
  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
} 