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
        { error: 'ID de evento inválido' },
        { status: 400 }
      );
    }
    
    const evento = await db.collection('eventos').findOne({ _id: new ObjectId(params.id) });
    
    if (!evento) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      evento: evento 
    });
  } catch (error) {
    console.error('Error al obtener evento:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'ID de evento inválido' },
        { status: 400 }
      );
    }

    // Verificar si es una actualización JSON (cancelación) o FormData (edición completa)
    const contentType = request.headers.get('content-type');
    let datosActualizacion = {};

    if (contentType && contentType.includes('application/json')) {
      // Actualización de cancelación (JSON)
      const body = await request.json();
      datosActualizacion = {
        cancelado: body.cancelado,
        fechaModificacion: new Date()
      };
    } else {
      // Actualización completa del evento (FormData)
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
      
      // Preparar datos de actualización completa
      datosActualizacion = {
        titulo: titulo,
        descripcion: descripcion,
        fechaEvento: new Date(fechaEvento),
        horaEvento: horaEvento,
        organizador: organizador || 'Sin organizador',
        estado: estado || 'Anzoátegui',
        fechaModificacion: new Date()
      };
      
      // Procesar nueva imagen si existe
      if (imagen && imagen.size > 0) {
        const bytes = await imagen.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generar nombre único para la imagen
        const extension = path.extname(imagen.name);
        const nombreArchivo = `${Date.now()}-${Math.random().toString(36).substring(7)}${extension}`;
        const rutaCompleta = path.join(process.cwd(), 'public', 'uploads', 'eventos', nombreArchivo);
        
        await writeFile(rutaCompleta, buffer);
        datosActualizacion.imagen = `/uploads/eventos/${nombreArchivo}`;
      }
    }
    
    const resultado = await db.collection('eventos').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: datosActualizacion }
    );
    
    if (resultado.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      mensaje: 'Evento actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar evento:', error);
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
        { error: 'ID de evento inválido' },
        { status: 400 }
      );
    }
    
    const resultado = await db.collection('eventos').deleteOne({ _id: new ObjectId(params.id) });
    
    if (resultado.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      mensaje: 'Evento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 