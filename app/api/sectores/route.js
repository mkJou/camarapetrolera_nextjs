import { NextResponse } from 'next/server';
import connectToDatabase, { normalizarTexto, formatearTexto } from '../../../lib/db';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Array para almacenar los sectores normalizados y sus valores originales
    const sectoresNormalizados = [];
    const sectoresOriginales = {};

    // Obtener sectores únicos de la colección empresas
    const empresasCollection = db.collection('empresas');
    const sectoresResult = await empresasCollection
      .distinct('sector', { sector: { $ne: '', $exists: true } });

    sectoresResult.forEach(sector => {
      if (sector && sector.trim() !== '') {
        const normalizado = normalizarTexto(sector);
        if (!sectoresNormalizados.includes(normalizado)) {
          sectoresNormalizados.push(normalizado);
          sectoresOriginales[normalizado] = formatearTexto(sector);
        }
      }
    });

    // Ordenar los sectores normalizados alfabéticamente
    sectoresNormalizados.sort();

    // Crear el array final de sectores
    const sectores = sectoresNormalizados.map(normalizado => 
      sectoresOriginales[normalizado]
    );

    return NextResponse.json(sectores);

  } catch (error) {
    console.error('Error obteniendo sectores:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 