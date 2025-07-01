import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/db';
import { ObjectId } from 'mongodb';

export async function POST(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;

    // Validar que el ID sea un ObjectId válido
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ 
        error: 'ID de empresa no válido' 
      }, { status: 400 });
    }

    // Verificar que la empresa existe
    const empresa = await db.collection('Empresas').findOne({ 
      _id: new ObjectId(id) 
    });

    if (!empresa) {
      return NextResponse.json({ 
        error: 'Empresa no encontrada' 
      }, { status: 404 });
    }

    // Imágenes de prueba (rutas directas a imágenes existentes)
    const imagenesPrueba = [
      '/img/post1.jpg',
      '/img/post2.jpg', 
      '/img/perforacion.webp',
      '/img/produccionPetrolera.webp',
      '/img/refineriaPetrolera.webp'
    ];

    // Actualizar la empresa con las imágenes de prueba
    const result = await db.collection('Empresas').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          imagenes: imagenesPrueba,
          fechaModificacion: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        error: 'Error al actualizar empresa' 
      }, { status: 500 });
    }

    console.log(`Imágenes de prueba agregadas a empresa ${empresa.nombre}:`, imagenesPrueba);

    return NextResponse.json({ 
      message: 'Imágenes de prueba agregadas exitosamente',
      imagenes: imagenesPrueba
    });
  } catch (error) {
    console.error('Error agregando imágenes de prueba:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
} 