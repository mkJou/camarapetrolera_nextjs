import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://root:NQ9vaoWpiMm1lFlA@cluster0.m4fyvrj.mongodb.net/central?retryWrites=true&w=majority';
const dbName = process.env.DB_NAME || 'camaranuevo';

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // En desarrollo, usa una variable global para evitar crear múltiples conexiones
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // En producción, es mejor no usar una variable global
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    return { client, db };
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    throw error;
  }
}

// Función auxiliar para normalizar texto (eliminar acentos y convertir a minúsculas)
export function normalizarTexto(texto) {
  if (!texto) return '';
  
  texto = texto.toString().trim();
  if (!texto) return '';
  
  // Convertir a minúsculas
  texto = texto.toLowerCase();
  
  // Eliminar acentos
  const buscar = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', 'à', 'è', 'ì', 'ò', 'ù'];
  const reemplazar = ['a', 'e', 'i', 'o', 'u', 'u', 'n', 'a', 'e', 'i', 'o', 'u'];
  
  buscar.forEach((caracter, index) => {
    texto = texto.replace(new RegExp(caracter, 'g'), reemplazar[index]);
  });
  
  return texto;
}

// Función para formatear texto (primera letra mayúscula)
export function formatearTexto(texto) {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
} 