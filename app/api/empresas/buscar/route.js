import { NextResponse } from 'next/server';
import connectToDatabase, { normalizarTexto } from '../../../../lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      nombre,
      region,
      sector,
      telefono,
      email,
      direccion,
      web,
      busquedaGeneral,
      filtrosExactos = false,
      limit = 20,
      skip = 0
    } = body;

    console.log('Parámetros de búsqueda POST:', body);

    const { db } = await connectToDatabase();
    const empresasCollection = db.collection('Empresas');

    // Construir filtro dinámico
    let filtro = {};
    
    // Si hay búsqueda general, buscar en todos los campos
    if (busquedaGeneral && busquedaGeneral.trim() !== '') {
      const termino = busquedaGeneral.trim();
      const regex = new RegExp(termino, 'i');
      
      filtro.$or = [
        { nombre: regex },
        { region: regex },
        { sector: regex },
        { telefono: regex },
        { email: regex },
        { direccion: regex },
        { web: regex }
      ];
    } else {
      // Filtros específicos por campo
      if (nombre && nombre.trim() !== '') {
        filtro.nombre = new RegExp(nombre.trim(), 'i');
      }

      // Para región (capítulo) usar coincidencia exacta
      if (region && region.trim() !== '') {
        filtro.region = region.trim();
      }

      // Para sector usar coincidencia exacta
      if (sector && sector.trim() !== '') {
        filtro.sector = sector.trim();
      }

      if (telefono && telefono.trim() !== '') {
        filtro.telefono = new RegExp(telefono.trim(), 'i');
      }

      if (email && email.trim() !== '') {
        filtro.email = new RegExp(email.trim(), 'i');
      }

      if (direccion && direccion.trim() !== '') {
        filtro.direccion = new RegExp(direccion.trim(), 'i');
      }

      if (web && web.trim() !== '') {
        filtro.web = new RegExp(web.trim(), 'i');
      }
    }

    console.log('Filtro construido:', filtro);

    // Ejecutar consulta con paginación
    const query = empresasCollection
      .find(filtro)
      .sort({ nombre: 1 });

    if (skip > 0) {
      query.skip(skip);
    }

    if (limit > 0) {
      query.limit(limit);
    }

    const empresas = await query.toArray();
    const total = await empresasCollection.countDocuments(filtro);

    console.log(`Encontradas ${empresas.length} empresas de ${total} total`);

    // Asegurar que los logos e imágenes tengan la ruta completa para el frontend
    const empresasConLogos = empresas.map(empresa => ({
      ...empresa,
      logo: empresa.logo ? `/uploads/empresas/${empresa.logo}` : null,
      imagenes: empresa.imagenes && Array.isArray(empresa.imagenes) ? 
        empresa.imagenes.map(img => 
          img.startsWith('/') || img.startsWith('../') ? img : `/uploads/empresas/${img}`
        ) : []
    }));

    return NextResponse.json({
      success: true,
      empresas: empresasConLogos,
      total,
      limit,
      skip,
      hasMore: skip + empresas.length < total,
      filtrosAplicados: filtro
    });

  } catch (error) {
    console.error('Error en búsqueda avanzada:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Convertir parámetros GET a formato POST
    const params = {
      nombre: searchParams.get('nombre'),
      region: searchParams.get('region'),
      sector: searchParams.get('sector'),
      telefono: searchParams.get('telefono'),
      email: searchParams.get('email'),
      direccion: searchParams.get('direccion'),
      web: searchParams.get('web'),
      busquedaGeneral: searchParams.get('q') || searchParams.get('busqueda'),
      filtrosExactos: searchParams.get('exacto') === 'true',
      limit: parseInt(searchParams.get('limit')) || 50,
      skip: parseInt(searchParams.get('skip')) || 0
    };

    console.log('Parámetros de búsqueda GET:', params);

    // Reutilizar la lógica del POST
    const mockRequest = {
      json: async () => params
    };

    return await POST(mockRequest);

  } catch (error) {
    console.error('Error en búsqueda avanzada GET:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor',
        message: error.message 
      },
      { status: 500 }
    );
  }
} 