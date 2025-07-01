import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const usuarios = await db.collection('Usuarios').find({}).toArray();
    
    // Remover contraseñas de la respuesta y agregar campos por defecto si no existen
    const usuariosSeguros = usuarios.map(({ contraseña, ...usuario }) => ({
      ...usuario,
      nombre: usuario.nombre || usuario.Nombre || 'Sin nombre',
      apellido: usuario.apellido || usuario.Apellido || 'Sin apellido',
      correo: usuario.correo || usuario.Correo || usuario.email || 'Sin correo',
      rol: usuario.rol || 'Usuario',
      estado: usuario.estado || 'Anzoátegui'
    }));
    
    return NextResponse.json({ usuarios: usuariosSeguros });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { nombre, apellido, correo, contraseña, rol = 'Usuario', estado = 'Anzoátegui' } = await request.json();
    
    if (!nombre || !apellido || !correo || !contraseña) {
      return NextResponse.json(
        { error: 'Nombre, apellido, correo y contraseña son obligatorios' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Verificar si el usuario ya existe
    const usuarioExistente = await db.collection('Usuarios').findOne({ correo });
    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este correo' },
        { status: 400 }
      );
    }
    
    // Crear nuevo usuario
    const nuevoUsuario = {
      nombre,
      apellido,
      correo,
      contraseña, // En producción, hash esta contraseña
      rol,
      estado,
      fechaCreacion: new Date()
    };
    
    const resultado = await db.collection('Usuarios').insertOne(nuevoUsuario);
    
    return NextResponse.json({ 
      mensaje: 'Usuario creado exitosamente',
      id: resultado.insertedId 
    });
  } catch (error) {
    console.error('Error creando usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 