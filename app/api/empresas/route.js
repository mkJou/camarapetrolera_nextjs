import { NextResponse } from 'next/server';
import connectToDatabase, { normalizarTexto, formatearTexto } from '../../../lib/db';
import { ObjectId } from 'mongodb';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const empresas = await db.collection('Empresas').find({}).toArray();
    
    // Asegurar que los logos e imágenes tengan la ruta completa para el frontend
    const empresasConLogos = empresas.map(empresa => ({
      ...empresa,
      logo: empresa.logo ? `/uploads/empresas/${empresa.logo}` : null,
      imagenes: empresa.imagenes && Array.isArray(empresa.imagenes) ? 
        empresa.imagenes.map(img => 
          img.startsWith('/') || img.startsWith('../') ? img : `/uploads/empresas/${img}`
        ) : []
    }));
    
    return NextResponse.json({ empresas: empresasConLogos });
  } catch (error) {
    console.error('Error obteniendo empresas:', error);
    return NextResponse.json({ error: 'Error obteniendo empresas' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const formData = await request.formData();
    
    const nombre = formData.get('nombre');
    const region = formData.get('region');
    const sector = formData.get('sector');
    const descripcion = formData.get('descripcion');
    const telefono = formData.get('telefono') || '';
    const correo = formData.get('correo') || '';
    const logoFile = formData.get('logo');
    const imagenesFiles = formData.getAll('imagenes');

    console.log('FormData recibido:');
    console.log('- Logo file:', logoFile ? logoFile.name : 'No logo');
    console.log('- Imágenes files:', imagenesFiles.length, 'archivos');
    console.log('- Nombres imágenes:', imagenesFiles.map(f => f.name));
    
    // Validaciones básicas
    if (!nombre || !region || !sector || !descripcion) {
      return NextResponse.json({ 
        error: 'Los campos nombre, región, sector y descripción son obligatorios' 
      }, { status: 400 });
    }
    
    let logoNombre = null;
    let imagenesNombres = [];
    
    // Manejar subida de logo si existe
    if (logoFile && logoFile.size > 0) {
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(logoFile.type)) {
        return NextResponse.json({ 
          error: 'Formato de imagen no válido. Use JPG, JPEG, PNG o GIF' 
        }, { status: 400 });
      }
      
      // Validar tamaño (5MB máximo)
      if (logoFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({ 
          error: 'La imagen no debe superar los 5MB' 
        }, { status: 400 });
      }
      
      // Generar nombre único para el archivo
      const extension = logoFile.name.split('.').pop();
      logoNombre = `empresa_${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
      
      // Crear directorio si no existe y guardar archivo
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'empresas');
      const filePath = path.join(uploadDir, logoNombre);
      
      try {
        await writeFile(filePath, buffer);
      } catch (error) {
        console.error('Error guardando archivo:', error);
        return NextResponse.json({ 
          error: 'Error al guardar la imagen' 
        }, { status: 500 });
      }
    }

    // Manejar subida de múltiples imágenes si existen
    if (imagenesFiles && imagenesFiles.length > 0) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'empresas');
      
      for (const imagenFile of imagenesFiles) {
        if (imagenFile && imagenFile.size > 0) {
          const bytes = await imagenFile.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          // Validar tipo de archivo
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
          if (!allowedTypes.includes(imagenFile.type)) {
            return NextResponse.json({ 
              error: `Formato de imagen no válido en ${imagenFile.name}. Use JPG, JPEG, PNG o GIF` 
            }, { status: 400 });
          }
          
          // Validar tamaño (5MB máximo)
          if (imagenFile.size > 5 * 1024 * 1024) {
            return NextResponse.json({ 
              error: `La imagen ${imagenFile.name} no debe superar los 5MB` 
            }, { status: 400 });
          }
          
          // Generar nombre único para el archivo
          const extension = imagenFile.name.split('.').pop();
          const imagenNombre = `empresa_${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
          
          // Guardar archivo
          const filePath = path.join(uploadDir, imagenNombre);
          
          try {
            await writeFile(filePath, buffer);
            imagenesNombres.push(imagenNombre);
          } catch (error) {
            console.error('Error guardando imagen:', error);
            return NextResponse.json({ 
              error: `Error al guardar la imagen ${imagenFile.name}` 
            }, { status: 500 });
          }
        }
      }
    }
    
    // Crear objeto empresa
    const nuevaEmpresa = {
      nombre,
      region,
      sector,
      descripcion,
      telefono,
      correo,
      logo: logoNombre,
      imagenes: imagenesNombres,
      fechaCreacion: new Date()
    };

    console.log('Objeto empresa a guardar:', {
      nombre,
      logo: logoNombre,
      imagenes: imagenesNombres,
      totalImagenes: imagenesNombres.length
    });
    
    const result = await db.collection('Empresas').insertOne(nuevaEmpresa);
    
    if (result.insertedId) {
      return NextResponse.json({ 
        message: 'Empresa creada exitosamente',
        empresaId: result.insertedId 
      }, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Error al crear empresa' }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error creando empresa:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 