'use client'

import { useLanguage } from '../contexts/LanguageContext';

export function useTranslation() {
  const { t, language, changeLanguage, mounted } = useLanguage();
  
  return { t, language, changeLanguage, mounted };
}

// Hook para componentes que necesitan traducción automática
export function useAutoTranslate() {
  const { t } = useLanguage();
  
  // Función que puede envolver automáticamente texto
  const autoTranslate = (text) => {
    if (typeof text !== 'string') return text;
    return t(text);
  };
  
  return autoTranslate;
}
