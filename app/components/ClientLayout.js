'use client'

import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function ClientLayout({ children }) {
  const [mounted, setMounted] = useState(false);
  const [pathname, setPathname] = useState('');
  
  useEffect(() => {
    setMounted(true);
    // Solo obtener pathname en el cliente
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);
  
  // Durante la hidratación inicial, no mostrar header/footer
  if (!mounted) {
    return (
      <>
        {children}
      </>
    );
  }
  
  const isDashboard = pathname?.startsWith('/dashboard');
  
  return (
    <>
      {!isDashboard && <Header />}
      {children}
    </>
  );
} 