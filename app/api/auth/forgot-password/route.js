import connectToDatabase from '../../../../lib/db';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'El correo electrónico es requerido' },
        { status: 400 }
      );
    }

    console.log('Intentando recuperar contraseña para:', email);

    // Conectar a la base de datos
    const { db } = await connectToDatabase();
    const collection = db.collection('Usuarios');

    // Buscar el usuario por correo (manejar ambos casos: Correo y correo)
    const usuario = await collection.findOne({
      $or: [
        { Correo: email },
        { correo: email },
        { Correo: { $regex: new RegExp(`^${email}$`, 'i') } },
        { correo: { $regex: new RegExp(`^${email}$`, 'i') } }
      ]
    });

    if (!usuario) {
      console.log('Usuario no encontrado para email:', email);
      // Por seguridad, no revelamos si el usuario existe o no
      return NextResponse.json(
        { message: 'Si el correo existe en nuestro sistema, recibirás un enlace de recuperación' },
        { status: 200 }
      );
    }

    console.log('Usuario encontrado:', usuario._id);

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Guardar el token en la base de datos
    await collection.updateOne(
      { _id: usuario._id },
      {
        $set: {
          resetToken: resetToken,
          resetTokenExpiry: resetTokenExpiry
        }
      }
    );

    console.log('Token de recuperación guardado');

    // Configurar Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Crear el enlace de recuperación
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/restablecer-password?token=${resetToken}`;

    // Enviar el correo con Resend
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Recuperación de Contraseña - Cámara Petrolera de Venezuela',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                          .header { text-align: center; margin-bottom: 30px; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 8px; }
              .button { 
                display: inline-block; 
                background: #ff9900; 
                color: white !important; 
                padding: 12px 30px; 
                text-decoration: none; 
                border-radius: 5px; 
                margin: 20px 0;
                font-weight: bold;
              }
              .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="color: #ff9900;">Recuperación de Contraseña</h1>
              </div>
              
              <div class="content">
                <h2>Hola ${usuario.Nombre || usuario.nombre || 'Usuario'},</h2>
                
                <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en la Cámara Petrolera de Venezuela.</p>
                
                <p>Si fuiste tú quien solicitó este cambio, haz clic en el siguiente botón para crear una nueva contraseña:</p>
                
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
                </div>
                
                <p>Este enlace expirará en 1 hora por motivos de seguridad.</p>
                
                <p>Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña actual seguirá siendo válida.</p>
                
                <p>Si tienes problemas con el botón, copia y pega este enlace en tu navegador:<br>
                <a href="${resetUrl}">${resetUrl}</a></p>
              </div>
              
              <div class="footer">
                <p>Este correo fue enviado automáticamente por el sistema de la Cámara Petrolera de Venezuela.</p>
                <p>Por favor no respondas a este correo.</p>
              </div>
            </div>
          </body>
          </html>
        `
      });

      if (error) {
        console.error('Error de Resend:', error);
        throw error;
      }

      console.log('Correo de recuperación enviado exitosamente con Resend:', data);
      
      return NextResponse.json(
        { message: 'Se ha enviado un enlace de recuperación a tu correo electrónico' },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Error enviando correo:', emailError);
      
      // Limpiar el token si no se pudo enviar el correo
      await collection.updateOne(
        { _id: usuario._id },
        {
          $unset: {
            resetToken: "",
            resetTokenExpiry: ""
          }
        }
      );
      
      return NextResponse.json(
        { message: 'Error enviando el correo de recuperación. Inténtalo más tarde.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error en forgot-password:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
