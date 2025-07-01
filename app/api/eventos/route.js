import connectToDatabase from '../../../lib/db';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    
    // Obtener todos los eventos ordenados por fecha de creación descendente
    const eventos = await db.collection('eventos').find({}).sort({ fechaCreacion: -1 }).toArray();
    
    return NextResponse.json({ 
      success: true,
      eventos: eventos 
    });
  } catch (error) {
    console.error('Error al obtener eventos:', error);
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
    const fechaEvento = formData.get('fechaEvento');
    const horaEvento = formData.get('horaEvento');
    const organizador = formData.get('organizador');
    const estado = formData.get('estado');
    const imagen = formData.get('imagen');
    
    // Validar campos obligatorios
    if (!titulo || !descripcion || !fechaEvento || !horaEvento) {
      return NextResponse.json(
        { error: 'Título, descripción, fecha y hora del evento son obligatorios' },
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
      const rutaCompleta = path.join(process.cwd(), 'public', 'uploads', 'eventos', nombreArchivo);
      
      await writeFile(rutaCompleta, buffer);
      rutaImagen = `/uploads/eventos/${nombreArchivo}`;
    }
    
    // Crear el evento
    const nuevoEvento = {
      titulo: titulo,
      descripcion: descripcion,
      fechaEvento: new Date(fechaEvento),
      horaEvento: horaEvento,
      organizador: organizador || 'Sin organizador',
      estado: estado || 'Anzoátegui',
      imagen: rutaImagen,
      fechaCreacion: new Date()
    };
    
    const resultado = await db.collection('eventos').insertOne(nuevoEvento);
    
    if (resultado.insertedId) {
      return NextResponse.json({ 
        success: true,
        evento: { ...nuevoEvento, _id: resultado.insertedId }
      }, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Error al crear el evento' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error al crear evento:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 