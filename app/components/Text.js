'use client'

import { useTranslation } from '../hooks/useTranslation';

// Componente que traduce automáticamente cualquier texto
export default function Text({ children, ...props }) {
  const { t } = useTranslation();
  
  if (typeof children === 'string') {
    return <span {...props}>{t(children)}</span>;
  }
  
  return <span {...props}>{children}</span>;
}

// Versión para títulos
export function Title({ children, level = 1, ...props }) {
  const { t } = useTranslation();
  const Tag = `h${level}`;
  
  return <Tag {...props}>{typeof children === 'string' ? t(children) : children}</Tag>;
}

// Versión para botones
export function Button({ children, ...props }) {
  const { t } = useTranslation();
  
  return (
    <button {...props}>
      {typeof children === 'string' ? t(children) : children}
    </button>
  );
}
