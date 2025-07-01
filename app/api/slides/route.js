import connectToDatabase from '../../../lib/db';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// GET - Obtener todos los slides
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const slides = await db.collection('slides').find({}).sort({ orden: 1 }).toArray();
    
    return NextResponse.json({
      success: true,
      slides: slides || []
    });
  } catch (error) {
    console.error('Error al obtener slides:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo slide
export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const data = await request.json();
    
    const { titulo, subtitulo, imagen, orden = 1 } = data;
    
    if (!titulo || !subtitulo) {
      return NextResponse.json(
        { success: false, error: 'Título y subtítulo son requeridos' },
        { status: 400 }
      );
    }

    const nuevoSlide = {
      titulo,
      subtitulo,
      imagen: imagen || '/img/banner.png',
      orden: parseInt(orden),
      fechaCreacion: new Date(),
      activo: true
    };

    const resultado = await db.collection('slides').insertOne(nuevoSlide);
    
    return NextResponse.json({
      success: true,
      slide: { ...nuevoSlide, _id: resultado.insertedId }
    });
  } catch (error) {
    console.error('Error al crear slide:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar slide
export async function DELETE(request) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID de slide inválido' },
        { status: 400 }
      );
    }

    const resultado = await db.collection('slides').deleteOne({
      _id: new ObjectId(id)
    });

    if (resultado.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Slide no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Slide eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar slide:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 