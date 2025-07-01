import connectToDatabase from '../../../../lib/db';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;

    // Validar que el ID sea un ObjectId válido
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ 
        error: 'ID de empresa no válido' 
      }, { status: 400 });
    }

    const empresa = await db.collection('Empresas').findOne({ 
      _id: new ObjectId(id) 
    });

    if (!empresa) {
      return NextResponse.json({ 
        error: 'Empresa no encontrada' 
      }, { status: 404 });
    }

    // Formatear las rutas de imágenes
    const empresaFormateada = {
      ...empresa,
      logo: empresa.logo ? `/uploads/empresas/${empresa.logo}` : null,
      imagenes: empresa.imagenes && Array.isArray(empresa.imagenes) ? 
        empresa.imagenes.map(img => 
          img.startsWith('/') || img.startsWith('../') ? img : `/uploads/empresas/${img}`
        ) : []
    };

    console.log('Empresa encontrada:', empresa.nombre);
    console.log('Imágenes en BD:', empresa.imagenes);
    console.log('Empresa formateada:', empresaFormateada);

    return NextResponse.json({ empresa: empresaFormateada });
  } catch (error) {
    console.error('Error obteniendo empresa:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;

    // Validar que el ID sea un ObjectId válido
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ 
        error: 'ID de empresa no válido' 
      }, { status: 400 });
    }

    const formData = await request.formData();
    
    const nombre = formData.get('nombre');
    const region = formData.get('region');
    const sector = formData.get('sector');
    const descripcion = formData.get('descripcion');
    const telefono = formData.get('telefono') || '';
    const correo = formData.get('correo') || '';
    const logoFile = formData.get('logo');
    const imagenesFiles = formData.getAll('imagenes');

    console.log('PUT - FormData recibido:');
    console.log('- Logo file:', logoFile ? logoFile.name : 'No logo');
    console.log('- Imágenes files:', imagenesFiles.length, 'archivos');
    console.log('- Nombres imágenes:', imagenesFiles.map(f => f?.name || 'undefined'));

    // Validaciones básicas
    if (!nombre || !region || !sector || !descripcion) {
      return NextResponse.json({ 
        error: 'Los campos nombre, región, sector y descripción son obligatorios' 
      }, { status: 400 });
    }

    // Obtener empresa actual para preservar datos existentes
    const empresaActual = await db.collection('Empresas').findOne({ 
      _id: new ObjectId(id) 
    });

    if (!empresaActual) {
      return NextResponse.json({ 
        error: 'Empresa no encontrada' 
      }, { status: 404 });
    }

    // Preparar objeto de actualización
    const updateData = {
      nombre,
      region,
      sector,
      descripcion,
      telefono,
      correo,
      fechaModificacion: new Date()
    };

    let logoNombre = empresaActual.logo; // Mantener logo actual por defecto
    let imagenesNombres = empresaActual.imagenes || []; // Mantener imágenes actuales por defecto

    // Si hay un nuevo logo, procesarlo
    if (logoFile && logoFile.size > 0) {
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(logoFile.type)) {
        return NextResponse.json({ 
          error: 'Formato de logo no válido. Use JPG, JPEG, PNG o GIF' 
        }, { status: 400 });
      }
      
      // Validar tamaño (5MB máximo)
      if (logoFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({ 
          error: 'El logo no debe superar los 5MB' 
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
        updateData.logo = logoNombre;
      } catch (error) {
        console.error('Error guardando logo:', error);
        return NextResponse.json({ 
          error: 'Error al guardar el logo' 
        }, { status: 500 });
      }
    }

    // Si hay nuevas imágenes, procesarlas
    if (imagenesFiles && imagenesFiles.length > 0) {
      // Verificar que realmente hay archivos válidos
      const archivosValidos = imagenesFiles.filter(file => file && file.size > 0);
      
      if (archivosValidos.length > 0) {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'empresas');
        const nuevasImagenes = [];
        
        for (const imagenFile of archivosValidos) {
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
            nuevasImagenes.push(imagenNombre);
          } catch (error) {
            console.error('Error guardando imagen:', error);
            return NextResponse.json({ 
              error: `Error al guardar la imagen ${imagenFile.name}` 
            }, { status: 500 });
          }
        }
        
        // Agregar nuevas imágenes a las existentes (no reemplazar)
        imagenesNombres = [...imagenesNombres, ...nuevasImagenes];
        updateData.imagenes = imagenesNombres;
        
        console.log('Nuevas imágenes procesadas:', nuevasImagenes);
        console.log('Total imágenes después del update:', imagenesNombres);
      }
    }

    console.log('Datos que se van a actualizar en BD:', updateData);

    const result = await db.collection('Empresas').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        error: 'Empresa no encontrada' 
      }, { status: 404 });
    }

    console.log('Empresa actualizada exitosamente con ID:', id);
    console.log('Datos actualizados:', updateData);

    return NextResponse.json({ 
      message: 'Empresa actualizada exitosamente' 
    });
  } catch (error) {
    console.error('Error actualizando empresa:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;

    // Validar que el ID sea un ObjectId válido
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ 
        error: 'ID de empresa no válido' 
      }, { status: 400 });
    }

    const result = await db.collection('Empresas').deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        error: 'Empresa no encontrada' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Empresa eliminada exitosamente' 
    });
  } catch (error) {
    console.error('Error eliminando empresa:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
} 