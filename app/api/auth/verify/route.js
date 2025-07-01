import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Obtener token del header Authorization o de las cookies
    let token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      token = request.cookies.get('auth-token')?.value;
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 401 }
      );
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu-secreto-jwt');

    // Token válido
    return NextResponse.json({
      valid: true,
      user: {
        userId: decoded.userId,
        email: decoded.email || decoded.correo,
        nombre: decoded.nombre
      }
    });

  } catch (error) {
    console.error('Error al verificar token:', error);
    
    return NextResponse.json(
      { error: 'Token inválido' },
      { status: 401 }
    );
  }
} 