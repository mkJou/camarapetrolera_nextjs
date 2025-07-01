import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import connectToDatabase from '../../../../lib/db';

// Actualizar usuario
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updateData = await request.json();
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Preparar datos de actualización
    const updateFields = {};
    
    if (updateData.nombre) updateFields.nombre = updateData.nombre;
    if (updateData.apellido) updateFields.apellido = updateData.apellido;
    if (updateData.correo) updateFields.correo = updateData.correo;
    if (updateData.rol) updateFields.rol = updateData.rol;
    if (updateData.estado) updateFields.estado = updateData.estado;
    
    // Solo actualizar contraseña si se proporciona
    if (updateData.contraseña && updateData.contraseña.trim() !== '') {
      updateFields.contraseña = updateData.contraseña; // En producción, hash esta contraseña
    }
    
    updateFields.fechaActualizacion = new Date();
    
    const resultado = await db.collection('Usuarios').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );
    
    if (resultado.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      mensaje: 'Usuario actualizado exitosamente',
      modifiedCount: resultado.modifiedCount 
    });
    
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Eliminar usuario
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    const resultado = await db.collection('Usuarios').deleteOne(
      { _id: new ObjectId(id) }
    );
    
    if (resultado.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      mensaje: 'Usuario eliminado exitosamente',
      deletedCount: resultado.deletedCount 
    });
    
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Obtener usuario por ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    const usuario = await db.collection('Usuarios').findOne(
      { _id: new ObjectId(id) },
      { projection: { contraseña: 0 } } // No incluir contraseña
    );
    
    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ usuario });
    
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 