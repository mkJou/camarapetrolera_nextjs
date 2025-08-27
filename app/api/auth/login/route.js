import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Función para formatear nombres de estados con acentos y mayúsculas
const formatearEstado = (estado) => {
  if (!estado) return 'Anzoátegui';
  
  const estados = {
    'anzoategui': 'Anzoátegui',
    'anzoátegui': 'Anzoátegui',
    'zulia': 'Zulia',
    'carabobo': 'Carabobo',
    'monagas': 'Monagas',
    'falcon': 'Falcón',
    'falcón': 'Falcón',
    'general': 'General'
  };
  
  const estadoLower = estado.toLowerCase();
  return estados[estadoLower] || estado;
};

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

    // Buscar usuario por email (probar ambos formatos de campo)
    console.log('Buscando usuario con email:', email.toLowerCase());
    let usuario = await usuariosCollection.findOne({ 
      $or: [
        { Correo: email.toLowerCase() },
        { correo: email.toLowerCase() }
      ]
    });

    if (!usuario) {
      console.log('Usuario no encontrado para email:', email);
      // Intentar buscar sin considerar mayúsculas/minúsculas
      usuario = await usuariosCollection.findOne({ 
        $or: [
          { Correo: { $regex: new RegExp(`^${email}$`, 'i') } },
          { correo: { $regex: new RegExp(`^${email}$`, 'i') } }
        ]
      });
      
      if (!usuario) {
        console.log('Usuario no encontrado incluso con regex');
        return NextResponse.json(
          { error: 'Credenciales inválidas' },
          { status: 401 }
        );
      }
    }
    
    console.log('Usuario encontrado:', {
      id: usuario._id,
      nombre: usuario.Nombre || usuario.nombre,
      apellido: usuario.Apellido || usuario.apellido,
      correo: usuario.Correo || usuario.correo,
      estado: usuario.Estado || usuario.estado,
      tieneContraseña: !!(usuario.Contraseña || usuario.contraseña)
    });
    

    
    let contraseñaValida = false;
    
    // Obtener la contraseña del usuario (probar ambos formatos de campo)
    const contraseñaUsuario = usuario.Contraseña || usuario.contraseña;
    
    if (!contraseñaUsuario) {
      console.log('No se encontró campo de contraseña');
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
    
    // Verificar si la contraseña está hasheada (empieza con $2a$ o $2b$)
    if (contraseñaUsuario.startsWith('$2a$') || contraseñaUsuario.startsWith('$2b$')) {
      console.log('Contraseña hasheada detectada, usando bcrypt');
      try {
        contraseñaValida = await bcrypt.compare(password, contraseñaUsuario);
      } catch (error) {
        console.error('Error con bcrypt:', error);
        contraseñaValida = false;
      }
    } else {
      console.log('Contraseña en texto plano, comparando directamente');
      contraseñaValida = password === contraseñaUsuario;
    }
    

    
    console.log('Resultado de verificación de contraseña:', contraseñaValida);
    
    if (!contraseñaValida) {
      console.log('Contraseña incorrecta para usuario:', email);
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Crear token JWT
    const token = jwt.sign(
      { 
        userId: usuario._id,
        email: usuario.Correo || usuario.correo,
        nombre: usuario.Nombre || usuario.nombre,
        apellido: usuario.Apellido || usuario.apellido,
        estado: formatearEstado(usuario.Estado || usuario.estado),
        rol: usuario.rol || 'user'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respuesta exitosa con datos del usuario (sin contraseña)
    const usuarioSinContraseña = {
      _id: usuario._id,
      nombre: usuario.Nombre || usuario.nombre,
      apellido: usuario.Apellido || usuario.apellido,
      correo: usuario.Correo || usuario.correo,
      estado: formatearEstado(usuario.Estado || usuario.estado),
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