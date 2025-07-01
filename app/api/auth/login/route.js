import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    const { db } = await connectToDatabase();
    const usuariosCollection = db.collection('Usuarios');

    // Buscar usuario por email
    console.log('Buscando usuario con email:', email.toLowerCase());
    let usuario = await usuariosCollection.findOne({ 
      Correo: email.toLowerCase() 
    });

    if (!usuario) {
      console.log('Usuario no encontrado para email:', email);
      // Intentar buscar sin considerar mayúsculas/minúsculas
      usuario = await usuariosCollection.findOne({ 
        Correo: { $regex: new RegExp(`^${email}$`, 'i') }
      });
      
      if (!usuario) {
        return NextResponse.json(
          { error: 'Credenciales inválidas' },
          { status: 401 }
        );
      }
    }
    

    
    let contraseñaValida = false;
    
    // Verificar si la contraseña está hasheada (empieza con $2a$ o $2b$)
    if (usuario.Contraseña.startsWith('$2a$') || usuario.Contraseña.startsWith('$2b$')) {
      console.log('Contraseña hasheada detectada, usando bcrypt');
      try {
        contraseñaValida = await bcrypt.compare(password, usuario.Contraseña);
      } catch (error) {
        console.error('Error con bcrypt:', error);
        contraseñaValida = false;
      }
    } else {

      contraseñaValida = password === usuario.Contraseña;
    }
    

    
    if (!contraseñaValida) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Crear token JWT
    const token = jwt.sign(
      { 
        userId: usuario._id,
        email: usuario.Correo,
        nombre: usuario.Nombre,
        rol: usuario.rol || 'user'
      },
      process.env.JWT_SECRET || 'tu-secreto-jwt',
      { expiresIn: '24h' }
    );

    // Respuesta exitosa con datos del usuario (sin contraseña)
    const usuarioSinContraseña = {
      _id: usuario._id,
      nombre: usuario.Nombre,
      apellido: usuario.Apellido,
      correo: usuario.Correo,
      rol: usuario.rol || 'user'
    };

    const response = NextResponse.json({
      message: 'Login exitoso',
      usuario: usuarioSinContraseña,
      token
    });

    // Establecer cookie con el token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    return response;

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 