'use client'

import { createContext, useContext, useState, useEffect } from 'react';

// Diccionarios de traducción
const translations = {
  es: {
    // Navegación
    'Inicio': 'Inicio',
    'La Cámara': 'La Cámara',
    'Capítulos Regionales': 'Capítulos Regionales',
    'Directorio': 'Directorio',
    'Noticias': 'Noticias',
    'Afiliarse': 'Afiliarse',
    'Acceder': 'Acceder',
    
    // Dashboard
    'CPV Admin': 'CPV Admin',
    'Gestión de Usuarios': 'Gestión de Usuarios',
    'Administra los usuarios del sistema': 'Administra los usuarios del sistema',
    'Lista de Usuarios': 'Lista de Usuarios',
    'Nuevo Usuario': 'Nuevo Usuario',
    'Actualizar': 'Actualizar',
    'Usuarios': 'Usuarios',
    'Eventos': 'Eventos',
    'Empresas': 'Empresas',
    'Slides': 'Slides',
    'Cerrar Sesión': 'Cerrar Sesión',
    
    // Formularios
    'Nombre': 'Nombre',
    'Apellido': 'Apellido',
    'Email': 'Email',
    'Contraseña': 'Contraseña',
    'Rol': 'Rol',
    'Estado': 'Estado',
    'Acciones': 'Acciones',
    
    // Mensajes
    '¿Olvidaste tu contraseña?': '¿Olvidaste tu contraseña?',
    'Recuperar Contraseña': 'Recuperar Contraseña',
    'Iniciar Sesión': 'Iniciar Sesión',
    
    // Footer
    'Últimas Publicaciones': 'Últimas Publicaciones',
    'Acceso Rápido': 'Acceso Rápido',
    'La Cámara Petrolera de Venezuela es la organización empresarial venezolana que agrupa y representa al sector productivo de la industria de los hidrocarburos.': 'La Cámara Petrolera de Venezuela es la organización empresarial venezolana que agrupa y representa al sector productivo de la industria de los hidrocarburos.'
  },
  
  en: {
    // Navegación
    'Inicio': 'Home',
    'La Cámara': 'The Chamber',
    'Capítulos Regionales': 'Regional Chapters',
    'Directorio': 'Directory',
    'Noticias': 'News',
    'Afiliarse': 'Join',
    'Acceder': 'Login',
    
    // Dashboard
    'CPV Admin': 'CPV Admin',
    'Gestión de Usuarios': 'User Management',
    'Administra los usuarios del sistema': 'Manage system users',
    'Lista de Usuarios': 'User List',
    'Nuevo Usuario': 'New User',
    'Actualizar': 'Update',
    'Usuarios': 'Users',
    'Eventos': 'Events',
    'Empresas': 'Companies',
    'Slides': 'Slides',
    'Cerrar Sesión': 'Logout',
    
    // Formularios
    'Nombre': 'Name',
    'Apellido': 'Last Name',
    'Email': 'Email',
    'Contraseña': 'Password',
    'Rol': 'Role',
    'Estado': 'State',
    'Acciones': 'Actions',
    
    // Mensajes
    '¿Olvidaste tu contraseña?': 'Forgot your password?',
    'Recuperar Contraseña': 'Reset Password',
    'Iniciar Sesión': 'Sign In',
    
    // Footer
    'Últimas Publicaciones': 'Latest Publications',
    'Acceso Rápido': 'Quick Access',
    'La Cámara Petrolera de Venezuela es la organización empresarial venezolana que agrupa y representa al sector productivo de la industria de los hidrocarburos.': 'The Venezuelan Petroleum Chamber is the Venezuelan business organization that groups and represents the productive sector of the hydrocarbon industry.'
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Cargar idioma desde localStorage
    const savedLanguage = localStorage.getItem('language') || 'es';
    setLanguage(savedLanguage);
    setMounted(true);
  }, []);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key) => {
    if (!mounted) return key; // Durante SSR, retornar la key original
    return translations[language]?.[key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    mounted
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
