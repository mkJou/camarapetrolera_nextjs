const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'camaranuevo';

async function verifyAndHashUser() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db(dbName);
    const usuariosCollection = db.collection('Usuarios');
    
    // Buscar el usuario
    const usuario = await usuariosCollection.findOne({ 
      Correo: 'cesar.arg8011@gmail.com' 
    });
    
    if (!usuario) {
      console.log('Usuario no encontrado');
      return;
    }
    
    console.log('Usuario encontrado:', {
      nombre: usuario.Nombre,
      correo: usuario.Correo,
      contraseña: usuario.Contraseña
    });
    
    // Verificar si la contraseña ya está hasheada
    const isHashed = usuario.Contraseña.startsWith('$2a$') || usuario.Contraseña.startsWith('$2b$');
    
    if (isHashed) {
      console.log('La contraseña ya está hasheada');
      
      // Verificar contraseña con bcrypt
      const isValid = await bcrypt.compare('Cesar@811', usuario.Contraseña);
      console.log('¿Contraseña válida?', isValid);
    } else {
      console.log('La contraseña está en texto plano:', usuario.Contraseña);
      
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(usuario.Contraseña, 10);
      console.log('Contraseña hasheada:', hashedPassword);
      
      // Actualizar en la base de datos
      await usuariosCollection.updateOne(
        { _id: usuario._id },
        { $set: { Contraseña: hashedPassword } }
      );
      
      console.log('Contraseña actualizada en la base de datos');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

verifyAndHashUser(); 