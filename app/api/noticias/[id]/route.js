import connectToDatabase from '../../../../lib/db';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'ID de noticia inválido' },
        { status: 400 }
      );
    }
    
    const noticia = await db.collection('noticias').findOne({ _id: new ObjectId(params.id) });
    
    if (!noticia) {
      return NextResponse.json(
        { error: 'Noticia no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      noticia: noticia 
    });
  } catch (error) {
    console.error('Error al obtener noticia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const formData = await request.formData();
    
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'ID de noticia inválido' },
        { status: 400 }
      );
    }
    
    const titulo = formData.get('titulo');
    const descripcion = formData.get('descripcion');
    const autor = formData.get('autor');
    const imagen = formData.get('imagen');
    
    // Validar campos obligatorios
    if (!titulo || !descripcion) {
      return NextResponse.json(
        { error: 'Título y descripción son obligatorios' },
        { status: 400 }
      );
    }
    
    // Preparar datos de actualización
    const datosActualizacion = {
      titulo: titulo,
      descripcion: descripcion,
      autor: autor || 'Sin autor',
      fechaModificacion: new Date()
    };
    
    // Procesar nueva imagen si existe
    if (imagen && imagen.size > 0) {
      const bytes = await imagen.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generar nombre único para la imagen
      const extension = path.extname(imagen.name);
      const nombreArchivo = `${Date.now()}-${Math.random().toString(36).substring(7)}${extension}`;
      const rutaCompleta = path.join(process.cwd(), 'public', 'uploads', 'noticias', nombreArchivo);
      
      await writeFile(rutaCompleta, buffer);
      datosActualizacion.imagen = `/uploads/noticias/${nombreArchivo}`;
    }
    
    const resultado = await db.collection('noticias').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: datosActualizacion }
    );
    
    if (resultado.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Noticia no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      mensaje: 'Noticia actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'ID de noticia inválido' },
        { status: 400 }
      );
    }
    
    const resultado = await db.collection('noticias').deleteOne({ _id: new ObjectId(params.id) });
    
    if (resultado.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Noticia no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      mensaje: 'Noticia eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar noticia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 