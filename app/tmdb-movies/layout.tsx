'use client';

import React from 'react';

export default function TMDBLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-10 pb-10">
      {children}
    </div>
  );
} 