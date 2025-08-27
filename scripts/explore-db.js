import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://root:NQ9vaoWpiMm1lFlA@cluster0.m4fyvrj.mongodb.net/central?retryWrites=true&w=majority';
const dbName = 'central';

async function exploreDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    // Listar todas las bases de datos
    const adminDb = client.db('admin');
    const databases = await adminDb.admin().listDatabases();
    console.log('\n📚 Bases de datos disponibles:');
    databases.databases.forEach(db => {
      console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    // Conectar a la base de datos especificada
    const db = client.db(dbName);
    console.log(`\n🔍 Explorando base de datos: ${dbName}`);
    
    // Listar todas las colecciones
    const collections = await db.listCollections().toArray();
    console.log('\n📁 Colecciones encontradas:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Explorar cada colección
    for (const collection of collections) {
      console.log(`\n📊 Colección: ${collection.name}`);
      const count = await db.collection(collection.name).countDocuments();
      console.log(`  Total de documentos: ${count}`);
      
      if (count > 0) {
        const sample = await db.collection(collection.name).findOne();
        console.log(`  Ejemplo de documento:`);
        console.log(`    ${JSON.stringify(sample, null, 2)}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nConexión cerrada');
  }
}

exploreDatabase();

