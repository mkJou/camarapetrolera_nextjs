import { NextResponse } from 'next/server';
import connectToDatabase, { normalizarTexto, formatearTexto } from '../../../lib/db';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Array para almacenar los capítulos normalizados y sus valores originales
    const capitulosNormalizados = [];
    const capitulosOriginales = {};

    // Verificar si existe la colección capitulos
    try {
      const capitulosCollection = db.collection('capitulos');
      const capitulosResult = await capitulosCollection
        .find({}, { projection: { nombre: 1 } })
        .sort({ nombre: 1 })
        .toArray();

      capitulosResult.forEach(doc => {
        if (doc.nombre && doc.nombre.trim() !== '') {
          const normalizado = normalizarTexto(doc.nombre);
          if (!capitulosNormalizados.includes(normalizado)) {
            capitulosNormalizados.push(normalizado);
            capitulosOriginales[normalizado] = formatearTexto(doc.nombre);
          }
        }
      });
    } catch (error) {
      // Si hay error con la colección capitulos, continuar
      console.log('Colección capitulos no encontrada o error:', error.message);
    }

    // Obtener capítulos únicos de la colección empresas
    const empresasCollection = db.collection('empresas');
    const capitulosEmpresasResult = await empresasCollection
      .distinct('region', { region: { $ne: '', $exists: true } });

    capitulosEmpresasResult.forEach(capitulo => {
      if (capitulo && capitulo.trim() !== '') {
        const normalizado = normalizarTexto(capitulo);
        if (!capitulosNormalizados.includes(normalizado)) {
          capitulosNormalizados.push(normalizado);
          capitulosOriginales[normalizado] = formatearTexto(capitulo);
        }
      }
    });

    // Ordenar los capítulos normalizados alfabéticamente
    capitulosNormalizados.sort();

    // Crear el array final de capítulos
    const capitulos = capitulosNormalizados.map(normalizado => 
      capitulosOriginales[normalizado]
    );

    return NextResponse.json(capitulos);

  } catch (error) {
    console.error('Error obteniendo capítulos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 