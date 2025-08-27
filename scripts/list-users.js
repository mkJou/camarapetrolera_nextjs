import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://root:NQ9vaoWpiMm1lFlA@cluster0.m4fyvrj.mongodb.net/central?retryWrites=true&w=majority';
const dbName = 'central';

async function listUsers() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db(dbName);
    const usuariosCollection = db.collection('Usuarios');
    
    // Listar todos los usuarios
    const usuarios = await usuariosCollection.find({}).toArray();
    
    console.log(`\n📋 Total de usuarios encontrados: ${usuarios.length}\n`);
    
    usuarios.forEach((usuario, index) => {
      console.log(`${index + 1}. ${usuario.Nombre} ${usuario.Apellido}`);
      console.log(`   📧 Email: ${usuario.Correo}`);
      console.log(`   🏛️  Estado: ${usuario.Estado || 'No definido'}`);
      console.log(`   🆔 ID: ${usuario._id}`);
      console.log('   ---');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nConexión cerrada');
  }
}

listUsers();

