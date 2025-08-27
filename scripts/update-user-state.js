import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://root:NQ9vaoWpiMm1lFlA@cluster0.m4fyvrj.mongodb.net/central?retryWrites=true&w=majority';
const dbName = 'central';

async function updateUserState() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db(dbName);
    const usuariosCollection = db.collection('Usuarios');
    
    // Buscar usuario por email
    const email = 'cesar.aug0811@gmail.com'; // Cambiar por el email del usuario
    const usuario = await usuariosCollection.findOne({ Correo: email });
    
    if (!usuario) {
      console.log('Usuario no encontrado');
      return;
    }
    
    console.log('Usuario encontrado:', {
      nombre: usuario.Nombre,
      apellido: usuario.Apellido,
      estado: usuario.Estado
    });
    
    // Actualizar estado a Zulia
    const resultado = await usuariosCollection.updateOne(
      { _id: usuario._id },
      { $set: { Estado: 'Zulia' } }
    );
    
    if (resultado.modifiedCount > 0) {
      console.log('✅ Estado actualizado correctamente a Zulia');
      
      // Verificar el cambio
      const usuarioActualizado = await usuariosCollection.findOne({ _id: usuario._id });
      console.log('Usuario actualizado:', {
        nombre: usuarioActualizado.Nombre,
        apellido: usuarioActualizado.Apellido,
        estado: usuarioActualizado.Estado
      });
    } else {
      console.log('❌ No se pudo actualizar el estado');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Conexión cerrada');
  }
}

updateUserState();

