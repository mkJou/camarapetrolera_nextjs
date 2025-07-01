// Ejemplos de uso de la API de búsqueda de empresas

// 1. Búsqueda simple por nombre
async function buscarPorNombre(nombre) {
  try {
    const response = await fetch(`/api/empresas?busqueda=${encodeURIComponent(nombre)}`);
    const data = await response.json();
    return data.empresas || data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// 2. Búsqueda por región y sector
async function buscarPorRegionYSector(region, sector) {
  try {
    const params = new URLSearchParams();
    if (region) params.append('region', region);
    if (sector) params.append('sector', sector);
    
    const response = await fetch(`/api/empresas?${params}`);
    const data = await response.json();
    return data.empresas || data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// 3. Búsqueda avanzada con múltiples parámetros
async function busquedaAvanzada(filtros) {
  try {
    const response = await fetch('/api/empresas/buscar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: filtros.nombre || '',
        region: filtros.region || '',
        sector: filtros.sector || '',
        telefono: filtros.telefono || '',
        email: filtros.email || '',
        direccion: filtros.direccion || '',
        web: filtros.web || '',
        busquedaGeneral: filtros.busquedaGeneral || '',
        filtrosExactos: filtros.exacto || false,
        limit: filtros.limit || 20,
        skip: filtros.skip || 0
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return { success: false, empresas: [] };
  }
}

// 4. Búsqueda general en todos los campos
async function busquedaGeneral(termino, exacto = false) {
  try {
    const response = await fetch('/api/empresas/buscar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        busquedaGeneral: termino,
        filtrosExactos: exacto,
        limit: 50
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return { success: false, empresas: [] };
  }
}

// 5. Búsqueda con paginación
async function buscarConPaginacion(filtros, pagina = 0, tamanoPagina = 10) {
  try {
    const response = await fetch('/api/empresas/buscar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...filtros,
        limit: tamanoPagina,
        skip: pagina * tamanoPagina
      })
    });
    
    const data = await response.json();
    return {
      empresas: data.empresas || [],
      total: data.total || 0,
      paginaActual: pagina,
      totalPaginas: Math.ceil((data.total || 0) / tamanoPagina),
      hayMas: data.hasMore || false
    };
  } catch (error) {
    console.error('Error:', error);
    return { empresas: [], total: 0, paginaActual: 0, totalPaginas: 0, hayMas: false };
  }
}

// Ejemplos de uso:

// Buscar empresas que contengan "Petro" en cualquier campo
// busquedaGeneral('Petro').then(resultado => console.log(resultado));

// Buscar empresas en Zulia del sector Exploración
// buscarPorRegionYSector('Zulia', 'Exploración').then(empresas => console.log(empresas));

// Búsqueda avanzada específica
// busquedaAvanzada({
//   region: 'Anzoátegui',
//   sector: 'Producción',
//   telefono: '0414',
//   exacto: false
// }).then(resultado => console.log(resultado));

// Búsqueda con paginación
// buscarConPaginacion({ region: 'Carabobo' }, 0, 5).then(resultado => {
//   console.log(`Página 1 de ${resultado.totalPaginas}`);
//   console.log(`Total de empresas: ${resultado.total}`);
//   console.log('Empresas:', resultado.empresas);
// });

// Exportar funciones para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    buscarPorNombre,
    buscarPorRegionYSector,
    busquedaAvanzada,
    busquedaGeneral,
    buscarConPaginacion
  };
} 