import connectToDatabase from '../../../lib/db';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    const noticias = await db.collection('noticias').find({}).sort({ fecha: -1 }).toArray();
    
    return NextResponse.json({ 
      success: true,
      noticias: noticias 
    });
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const formData = await request.formData();
    
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
    
    let rutaImagen = null;
    
    // Procesar imagen si existe
    if (imagen && imagen.size > 0) {
      const bytes = await imagen.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Generar nombre único para la imagen
      const extension = path.extname(imagen.name);
      const nombreArchivo = `${Date.now()}-${Math.random().toString(36).substring(7)}${extension}`;
      const rutaCompleta = path.join(process.cwd(), 'public', 'uploads', 'noticias', nombreArchivo);
      
      await writeFile(rutaCompleta, buffer);
      rutaImagen = `/uploads/noticias/${nombreArchivo}`;
    }
    
    // Crear la noticia
    const nuevaNoticia = {
      titulo: titulo,
      descripcion: descripcion,
      imagen: rutaImagen,
      autor: autor || 'Sin autor',
      fechaCreacion: new Date(),
      fecha: new Date() // Mantener compatibilidad
    };
    
    const resultado = await db.collection('noticias').insertOne(nuevaNoticia);
    
    if (resultado.insertedId) {
      return NextResponse.json({ 
        success: true,
        noticia: { ...nuevaNoticia, _id: resultado.insertedId }
      }, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Error al crear la noticia' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error al crear noticia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 