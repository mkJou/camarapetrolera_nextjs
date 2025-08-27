'use client'

import { useTranslation } from '../hooks/useTranslation';

export default function LanguageSelector({ className = "" }) {
  const { language, changeLanguage, mounted } = useTranslation();

  if (!mounted) return null; // Evitar hidration mismatch

  return (
    <div className={`language-selector ${className}`}>
      <select 
        value={language} 
        onChange={(e) => changeLanguage(e.target.value)}
        style={{
          padding: '5px 10px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          backgroundColor: 'white',
          fontSize: '14px',
          cursor: 'pointer'
        }}
      >
        <option value="es">🇪🇸 Español</option>
        <option value="en">🇺🇸 English</option>
      </select>
    </div>
  );
}
