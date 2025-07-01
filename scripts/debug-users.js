const { MongoClient } = require('mongodb');

async function debugUsers() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db('camarapetrolera');
    const usuarios = db.collection('Usuarios');
    
    // Buscar todos los usuarios
    console.log('\n=== TODOS LOS USUARIOS ===');
    const todosUsuarios = await usuarios.find({}).toArray();
    console.log(`Total de usuarios encontrados: ${todosUsuarios.length}`);
    
    todosUsuarios.forEach((usuario, index) => {
      console.log(`\nUsuario ${index + 1}:`);
      console.log(`  _id: ${usuario._id}`);
      console.log(`  Nombre: ${usuario.Nombre}`);
      console.log(`  Apellido: ${usuario.Apellido}`);
      console.log(`  Correo: "${usuario.Correo}"`);
      console.log(`  Contraseña: ${usuario.Contraseña ? usuario.Contraseña.substring(0, 20) + '...' : 'No definida'}`);
      console.log(`  Rol: ${usuario.rol || 'No definido'}`);
    });
    
    // Buscar específicamente el usuario gervasioalberto@gmail.com
    console.log('\n=== BÚSQUEDA ESPECÍFICA ===');
    const emailBuscado = 'gervasioalberto@gmail.com';
    
    console.log(`Buscando email exacto: "${emailBuscado}"`);
    const usuarioExacto = await usuarios.findOne({ Correo: emailBuscado });
    console.log('Resultado búsqueda exacta:', usuarioExacto ? 'ENCONTRADO' : 'NO ENCONTRADO');
    
    console.log(`Buscando email toLowerCase: "${emailBuscado.toLowerCase()}"`);
    const usuarioLower = await usuarios.findOne({ Correo: emailBuscado.toLowerCase() });
    console.log('Resultado búsqueda toLowerCase:', usuarioLower ? 'ENCONTRADO' : 'NO ENCONTRADO');
    
    console.log(`Buscando con regex case-insensitive:`);
    const usuarioRegex = await usuarios.findOne({ 
      Correo: { $regex: new RegExp(`^${emailBuscado}$`, 'i') }
    });
    console.log('Resultado búsqueda regex:', usuarioRegex ? 'ENCONTRADO' : 'NO ENCONTRADO');
    
    // Buscar correos que contengan partes del email
    console.log(`\nBuscando correos que contengan "gervasioalberto":`);
    const usuariosGervasio = await usuarios.find({ 
      Correo: { $regex: /gervasioalberto/i }
    }).toArray();
    console.log(`Encontrados: ${usuariosGervasio.length}`);
    usuariosGervasio.forEach(u => console.log(`  - ${u.Correo}`));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

debugUsers(); 