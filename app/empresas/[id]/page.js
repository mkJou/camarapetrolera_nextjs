'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function DetalleEmpresa() {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [lightboxAbierto, setLightboxAbierto] = useState(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const cargarEmpresa = async () => {
      try {
        const response = await fetch(`/api/empresas/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setEmpresa(data.empresa);
        } else if (response.status === 404) {
          setError('Empresa no encontrada');
        } else {
          setError('Error al cargar la empresa');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      cargarEmpresa();
    }
  }, [params.id]);

  const abrirLightbox = (imagen, index) => {
    setImagenSeleccionada({ src: imagen, index });
    setLightboxAbierto(true);
  };

  const cerrarLightbox = () => {
    setLightboxAbierto(false);
    setImagenSeleccionada(null);
  };

  const navegarImagen = (direccion) => {
    if (!imagenSeleccionada || !empresa.imagenes) return;
    
    const nuevoIndex = direccion === 'anterior' 
      ? (imagenSeleccionada.index - 1 + empresa.imagenes.length) % empresa.imagenes.length
      : (imagenSeleccionada.index + 1) % empresa.imagenes.length;
    
    setImagenSeleccionada({ 
      src: empresa.imagenes[nuevoIndex], 
      index: nuevoIndex 
    });
  };

  if (loading) {
    return (
      <>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 70vh;
            padding: 40px;
          }

          .loading-spinner {
            border: 5px solid #f3f3f3;
            border-top: 5px solid #ff9900;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .loading-text {
            font-size: 18px;
            color: #666;
          }
        `}</style>
        
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando empresa...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 70vh;
            padding: 40px;
            text-align: center;
          }

          .error-icon {
            font-size: 80px;
            color: #dc3545;
            margin-bottom: 20px;
          }

          .error-title {
            font-size: 28px;
            color: #333;
            margin-bottom: 15px;
            font-weight: 600;
          }

          .error-message {
            font-size: 16px;
            color: #666;
            margin-bottom: 30px;
            max-width: 500px;
            line-height: 1.5;
          }

          .btn-volver {
            background-color: #ff9900;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
          }

          .btn-volver:hover {
            background-color: #d15500;
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(233, 102, 0, 0.3);
          }
        `}</style>
        
        <div className="error-container">
          <div className="error-icon">🏢</div>
          <h1 className="error-title">Empresa no encontrada</h1>
          <p className="error-message">{error}</p>
          <button className="btn-volver" onClick={() => router.push('/directorio')}>
            Volver al Directorio
          </button>
        </div>
      </>
    );
  }

  if (!empresa) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        .empresa-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .empresa-header {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          margin-bottom: 30px;
          display: flex;
          gap: 30px;
          align-items: center;
        }

        .empresa-logo {
          flex-shrink: 0;
          width: 150px;
          height: 150px;
          border-radius: 12px;
          overflow: hidden;
          border: 3px solid #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
        }

        .empresa-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .logo-placeholder {
          color: #999;
          font-size: 14px;
          text-align: center;
        }

        .empresa-info {
          flex: 1;
        }

        .empresa-nombre {
          font-size: 2.5rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 15px 0;
          line-height: 1.2;
        }

        .empresa-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .meta-item {
          background: #f8f9fa;
          padding: 12px 16px;
          border-radius: 8px;
          border-left: 4px solid #ff9900;
        }

        .meta-label {
          font-size: 0.85rem;
          color: #666;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .meta-value {
          font-size: 1rem;
          color: #333;
          font-weight: 500;
        }

        .empresa-descripcion {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          margin-bottom: 30px;
        }

        .descripcion-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .descripcion-text {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #555;
          text-align: justify;
        }

        .empresa-galeria {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          margin-bottom: 30px;
        }

        .galeria-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .galeria-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .galeria-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 2px solid #f0f0f0;
        }

        .galeria-item:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          border-color: #ff9900;
        }

        .galeria-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .galeria-item:hover img {
          transform: scale(1.1);
        }

        .galeria-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .galeria-item:hover .galeria-overlay {
          opacity: 1;
        }

        .galeria-zoom {
          color: white;
          font-size: 2rem;
        }

        .sin-imagenes {
          text-align: center;
          padding: 40px;
          color: #666;
          font-style: italic;
        }

        /* Lightbox */
        .lightbox {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lightbox-imagen {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
        }

        .lightbox-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.2);
          color: white;
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          transition: background 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .lightbox-btn:hover {
          background: rgba(255,255,255,0.3);
        }

        .lightbox-prev {
          left: -70px;
        }

        .lightbox-next {
          right: -70px;
        }

        .lightbox-close {
          position: absolute;
          top: -70px;
          right: 0;
          background: rgba(255,255,255,0.2);
          color: white;
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          transition: background 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .lightbox-close:hover {
          background: rgba(255,255,255,0.3);
        }

        .lightbox-contador {
          position: absolute;
          bottom: -50px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          font-size: 14px;
          background: rgba(0,0,0,0.5);
          padding: 8px 16px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 40px;
        }

        .btn {
          padding: 12px 25px;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-regresar {
          background-color: #ff9900;
          color: white;
        }

        .btn-regresar:hover {
          background-color: #d15500;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(233, 102, 0, 0.3);
        }

        .btn-contacto {
          background-color: #28a745;
          color: white;
        }

        .btn-contacto:hover {
          background-color: #218838;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(40, 167, 69, 0.3);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .empresa-container {
            padding: 20px 15px;
          }

          .empresa-header {
            flex-direction: column;
            text-align: center;
            padding: 25px 20px;
          }

          .empresa-logo {
            width: 120px;
            height: 120px;
          }

          .empresa-nombre {
            font-size: 2rem;
          }

          .empresa-meta {
            grid-template-columns: 1fr;
          }

          .galeria-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
          }

          .action-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }

          .lightbox-btn {
            width: 40px;
            height: 40px;
            font-size: 16px;
          }

          .lightbox-prev {
            left: 10px;
          }

          .lightbox-next {
            right: 10px;
          }

          .lightbox-close {
            top: 20px;
            right: 20px;
          }
        }
      `}</style>

      <div className="empresa-container">
        {/* Header con información principal */}
        <div className="empresa-header">
          <div className="empresa-logo">
            {empresa.logo ? (
              <img src={empresa.logo} alt={`Logo de ${empresa.nombre}`} />
            ) : (
              <div className="logo-placeholder">
                🏢<br />Sin logo
              </div>
            )}
          </div>
          
          <div className="empresa-info">
            <h1 className="empresa-nombre">{empresa.nombre}</h1>
            
            <div className="empresa-meta">
              <div className="meta-item">
                <div className="meta-label">Capítulo</div>
                <div className="meta-value">{empresa.region || 'Venezuela'}</div>
              </div>
              
              <div className="meta-item">
                <div className="meta-label">Sector</div>
                <div className="meta-value">{empresa.sector || 'Sin especificar'}</div>
              </div>
              
              {empresa.telefono && (
                <div className="meta-item">
                  <div className="meta-label">Teléfono</div>
                  <div className="meta-value">{empresa.telefono}</div>
                </div>
              )}
              
              {empresa.correo && (
                <div className="meta-item">
                  <div className="meta-label">Correo</div>
                  <div className="meta-value">{empresa.correo}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="empresa-descripcion">
          <h2 className="descripcion-title">
            📋 Descripción de la Empresa
          </h2>
          <div className="descripcion-text">
            {empresa.descripcion || 'No hay descripción disponible.'}
          </div>
        </div>

        {/* Galería de imágenes */}
        <div className="empresa-galeria">
          <h2 className="galeria-title">
            📸 Galería de Imágenes
          </h2>
          
          {empresa.imagenes && empresa.imagenes.length > 0 ? (
            <div className="galeria-grid">
              {empresa.imagenes.map((imagen, index) => (
                <div 
                  key={index} 
                  className="galeria-item"
                  onClick={() => abrirLightbox(imagen, index)}
                >
                  <img src={imagen} alt={`Imagen ${index + 1} de ${empresa.nombre}`} />
                  <div className="galeria-overlay">
                    <div className="galeria-zoom">🔍</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="sin-imagenes">
              No hay imágenes disponibles para esta empresa.
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="action-buttons">
          <button 
            className="btn btn-regresar" 
            onClick={() => router.push('/directorio')}
          >
            ← Volver al Directorio
          </button>
          
          {empresa.correo && (
            <a 
              href={`mailto:${empresa.correo}`} 
              className="btn btn-contacto"
            >
              ✉️ Contactar Empresa
            </a>
          )}
        </div>
      </div>

      {/* Lightbox para visualizar imágenes */}
      {lightboxAbierto && imagenSeleccionada && (
        <div className="lightbox" onClick={cerrarLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img 
              src={imagenSeleccionada.src} 
              alt={`Imagen de ${empresa.nombre}`}
              className="lightbox-imagen"
            />
            
            <button 
              className="lightbox-close" 
              onClick={cerrarLightbox}
            >
              ✕
            </button>
            
            {empresa.imagenes.length > 1 && (
              <>
                <button 
                  className="lightbox-btn lightbox-prev" 
                  onClick={() => navegarImagen('anterior')}
                >
                  ‹
                </button>
                
                <button 
                  className="lightbox-btn lightbox-next" 
                  onClick={() => navegarImagen('siguiente')}
                >
                  ›
                </button>
                
                <div className="lightbox-contador">
                  {imagenSeleccionada.index + 1} de {empresa.imagenes.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
} 