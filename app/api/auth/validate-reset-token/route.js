import connectToDatabase from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: 'Token es requerido' },
        { status: 400 }
      );
    }

    console.log('Validando token:', token);

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

    console.log('Token válido para usuario:', usuario._id);

    return NextResponse.json(
      { message: 'Token válido' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error validando token:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
