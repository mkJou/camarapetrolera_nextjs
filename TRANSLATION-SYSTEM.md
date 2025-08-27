# 🌍 Sistema de Traducción Automática

Este sistema permite traducir toda la aplicación **sin cambiar las etiquetas HTML existentes**. Solo necesitas agregar las traducciones al diccionario y usar el hook `useTranslation`.

## ✅ **Características:**

- 🔄 **Traducción automática** sin cambiar HTML
- 💾 **Persistencia** en localStorage
- 🚀 **SSR Safe** (evita hydration mismatch)
- 🎯 **Fácil de usar** con hooks y componentes
- 🌐 **Escalable** para múltiples idiomas

## 🚀 **Uso Básico:**

### 1. En cualquier componente:

```jsx
'use client'
import { useTranslation } from '../hooks/useTranslation';

export default function MiComponente() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('Inicio')}</h1>
      <button>{t('Iniciar Sesión')}</button>
      <p>{t('¿Olvidaste tu contraseña?')}</p>
    </div>
  );
}
```

### 2. Con componentes automáticos:

```jsx
import Text, { Title, Button } from '../components/Text';

export default function MiComponente() {
  return (
    <div>
      <Title level={1}>Inicio</Title>
      <Button>Iniciar Sesión</Button>
      <Text>¿Olvidaste tu contraseña?</Text>
    </div>
  );
}
```

### 3. Cambiar idioma programáticamente:

```jsx
const { changeLanguage, language } = useTranslation();

// Cambiar a inglés
changeLanguage('en');

// Obtener idioma actual
console.log(language); // 'es' o 'en'
```

## 📝 **Agregar Nuevas Traducciones:**

Edita el archivo `app/contexts/LanguageContext.js`:

```js
const translations = {
  es: {
    'Mi nuevo texto': 'Mi nuevo texto',
    'Otro mensaje': 'Otro mensaje'
  },
  en: {
    'Mi nuevo texto': 'My new text', 
    'Otro mensaje': 'Another message'
  }
};
```

## 🎯 **Ejemplos de Uso:**

### Dashboard:
```jsx
// Antes
<h1>Gestión de Usuarios</h1>

// Después  
<h1>{t('Gestión de Usuarios')}</h1>
```

### Formularios:
```jsx
// Antes
<label>Nombre</label>
<button>Guardar</button>

// Después
<label>{t('Nombre')}</label>
<button>{t('Guardar')}</button>
```

### Navegación:
```jsx
// Antes
<Link href="/noticias">Noticias</Link>

// Después
<Link href="/noticias">{t('Noticias')}</Link>
```

## 🛠 **Componentes Disponibles:**

### LanguageSelector
Selector de idioma automático:
```jsx
import LanguageSelector from './LanguageSelector';

<LanguageSelector />
```

### Text, Title, Button
Componentes que traducen automáticamente:
```jsx
import Text, { Title, Button } from './Text';

<Text>Mi texto</Text>
<Title level={2}>Mi título</Title>
<Button>Mi botón</Button>
```

## 🌐 **Agregar Nuevos Idiomas:**

1. Agregar al diccionario en `LanguageContext.js`:
```js
const translations = {
  es: { /* traducciones */ },
  en: { /* traducciones */ },
  fr: { /* nuevas traducciones en francés */ }
};
```

2. Actualizar el selector en `LanguageSelector.js`:
```jsx
<option value="fr">🇫🇷 Français</option>
```

## 📋 **Implementación Gradual:**

Puedes implementar las traducciones **gradualmente**:

1. **Fase 1**: Header y navegación principal
2. **Fase 2**: Dashboard y formularios  
3. **Fase 3**: Páginas de contenido
4. **Fase 4**: Footer y textos auxiliares

## 🔧 **Ventajas de este Sistema:**

- ✅ **No rompe el código existente**
- ✅ **Fácil mantenimiento**
- ✅ **Performance optimizado**
- ✅ **SEO friendly**
- ✅ **Funciona con SSR/SSG**
- ✅ **TypeScript compatible**

## 🚀 **Próximos Pasos:**

1. Agregar el hook `useTranslation` a tus componentes
2. Reemplazar textos hardcodeados con `t('texto')`
3. Agregar traducciones al diccionario
4. ¡Listo! El sistema funciona automáticamente

El selector de idioma ya está agregado al header y funciona instantáneamente. 🎯
