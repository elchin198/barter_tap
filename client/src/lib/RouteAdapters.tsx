import React from 'react';
import { RouteComponentProps } from 'wouter';
import NotFound from '@/pages/not-found';

// Route adapter for NotFound component to handle URL params from wouter
export function NotFoundAdapter(props: RouteComponentProps) {
  return <NotFound />;
}