import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://root:NQ9vaoWpiMm1lFlA@cluster0.m4fyvrj.mongodb.net/camaranuevo?retryWrites=true&w=majority';
const dbName = 'camaranuevo';

async function checkPassword() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db(dbName);
    const usuariosCollection = db.collection('Usuarios');
    
    // Buscar usuario por email
    const email = 'cesar.aug0811@gmail.com';
    const usuario = await usuariosCollection.findOne({ 
      $or: [
        { Correo: email },
        { correo: email }
      ]
    });
    
    if (!usuario) {
      console.log('Usuario no encontrado');
      return;
    }
    
    console.log('Usuario encontrado:', {
      nombre: usuario.Nombre || usuario.nombre,
      apellido: usuario.Apellido || usuario.apellido,
      correo: usuario.Correo || usuario.correo,
      estado: usuario.Estado || usuario.estado,
      contraseña: usuario.Contraseña || usuario.contraseña,
      longitudContraseña: (usuario.Contraseña || usuario.contraseña || '').length
    });
    
    // Verificar si la contraseña es la esperada
    const contraseñaEsperada = 'Cesar@0811';
    const contraseñaActual = usuario.Contraseña || usuario.contraseña;
    
    if (contraseñaActual === contraseñaEsperada) {
      console.log('✅ La contraseña ya es correcta');
    } else {
      console.log('❌ La contraseña no coincide');
      console.log(`Contraseña esperada: ${contraseñaEsperada}`);
      console.log(`Contraseña actual: ${contraseñaActual}`);
      
      // Preguntar si actualizar
      console.log('\n¿Deseas actualizar la contraseña a "Cesar@0811"? (s/n)');
      
      // Simular respuesta positiva para actualizar
      const actualizar = true; // Cambiar a false si no quieres actualizar
      
      if (actualizar) {
        const resultado = await usuariosCollection.updateOne(
          { _id: usuario._id },
          { $set: { 
            Contraseña: contraseñaEsperada,
            contraseña: contraseñaEsperada
          }}
        );
        
        if (resultado.modifiedCount > 0) {
          console.log('✅ Contraseña actualizada correctamente');
          
          // Verificar el cambio
          const usuarioActualizado = await usuariosCollection.findOne({ _id: usuario._id });
          console.log('Usuario actualizado:', {
            nombre: usuarioActualizado.Nombre || usuarioActualizado.nombre,
            contraseña: usuarioActualizado.Contraseña || usuarioActualizado.contraseña
          });
        } else {
          console.log('❌ No se pudo actualizar la contraseña');
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Conexión cerrada');
  }
}

checkPassword();
