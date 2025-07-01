const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'camaranuevo';

async function checkUsers() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db(dbName);
    const usuariosCollection = db.collection('Usuarios');
    
    // Obtener todos los usuarios
    const usuarios = await usuariosCollection.find({}).toArray();
    
    console.log('\n=== USUARIOS EN LA BASE DE DATOS ===');
    console.log(`Total de usuarios: ${usuarios.length}\n`);
    
    usuarios.forEach((usuario, index) => {
      console.log(`Usuario ${index + 1}:`);
      console.log(`  ID: ${usuario._id}`);
      console.log(`  Nombre: ${usuario.Nombre || 'N/A'}`);
      console.log(`  Apellido: ${usuario.Apellido || 'N/A'}`);
      console.log(`  Correo: ${usuario.Correo || 'N/A'}`);
      console.log(`  Contraseña: ${usuario.Contraseña || 'N/A'}`);
      console.log(`  Rol: ${usuario.rol || 'N/A'}`);
      console.log('  ---');
    });
    
    // Buscar específicamente el usuario con cesar
    const usuarioCesar = await usuariosCollection.findOne({ 
      $or: [
        { Correo: /cesar/i },
        { Nombre: /cesar/i }
      ]
    });
    
    if (usuarioCesar) {
      console.log('\n=== USUARIO CESAR ENCONTRADO ===');
      console.log('Datos exactos:');
      console.log(JSON.stringify(usuarioCesar, null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkUsers(); 