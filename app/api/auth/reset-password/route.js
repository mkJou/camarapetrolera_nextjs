import connectToDatabase from '../../../../lib/db';
import bcryptjs from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    console.log('Restableciendo contraseña con token:', token);

    // Conectar a la base de datos
    const { db } = await connectToDatabase();
    const collection = db.collection('Usuarios');

    // Buscar usuario con el token válido y no expirado
    const usuario = await collection.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!usuario) {
      console.log('Token no válido o expirado');
      return NextResponse.json(
        { message: 'Token inválido o expirado' },
        { status: 400 }
      );
    }

    console.log('Usuario encontrado para restablecer contraseña:', usuario._id);

    // Encriptar la nueva contraseña
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Actualizar la contraseña y limpiar el token
    const updateResult = await collection.updateOne(
      { _id: usuario._id },
      {
        $set: {
          Contraseña: hashedPassword,
          contraseña: hashedPassword // Para mantener compatibilidad
        },
        $unset: {
          resetToken: "",
          resetTokenExpiry: ""
        }
      }
    );

    if (updateResult.modifiedCount === 0) {
      console.log('No se pudo actualizar la contraseña');
      return NextResponse.json(
        { message: 'Error actualizando la contraseña' },
        { status: 500 }
      );
    }

    console.log('Contraseña restablecida exitosamente para usuario:', usuario._id);

    return NextResponse.json(
      { message: 'Contraseña restablecida exitosamente' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error restableciendo contraseña:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
