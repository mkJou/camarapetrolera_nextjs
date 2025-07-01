import connectToDatabase from '../../../../lib/db';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// GET - Obtener slide por ID
export async function GET(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID de slide inválido' },
        { status: 400 }
      );
    }

    const slide = await db.collection('slides').findOne({
      _id: new ObjectId(id)
    });

    if (!slide) {
      return NextResponse.json(
        { success: false, error: 'Slide no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      slide
    });
  } catch (error) {
    console.error('Error al obtener slide:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar slide
export async function PUT(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;
    const data = await request.json();
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID de slide inválido' },
        { status: 400 }
      );
    }

    const { titulo, subtitulo, imagen, orden, activo } = data;
    
    if (!titulo || !subtitulo) {
      return NextResponse.json(
        { success: false, error: 'Título y subtítulo son requeridos' },
        { status: 400 }
      );
    }

    const slideActualizado = {
      titulo,
      subtitulo,
      imagen: imagen || '/img/banner.png',
      orden: parseInt(orden || 1),
      activo: activo !== undefined ? activo : true,
      fechaModificacion: new Date()
    };

    const resultado = await db.collection('slides').updateOne(
      { _id: new ObjectId(id) },
      { $set: slideActualizado }
    );

    if (resultado.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Slide no encontrado' },
        { status: 404 }
      );
    }

    // Obtener el slide actualizado
    const slide = await db.collection('slides').findOne({
      _id: new ObjectId(id)
    });

    return NextResponse.json({
      success: true,
      slide
    });
  } catch (error) {
    console.error('Error al actualizar slide:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 