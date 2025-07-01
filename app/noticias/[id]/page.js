'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function DetalleNoticia() {
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const cargarNoticia = async () => {
      try {
        const response = await fetch(`/api/noticias/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setNoticia(data.noticia);
        } else if (response.status === 404) {
          setError('Noticia no encontrada');
        } else {
          setError('Error al cargar la noticia');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      cargarNoticia();
    }
  }, [params.id]);

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const año = fechaObj.getFullYear();
    const horas = fechaObj.getHours().toString().padStart(2, '0');
    const minutos = fechaObj.getMinutes().toString().padStart(2, '0');
    const segundos = fechaObj.getSeconds().toString().padStart(2, '0');
    
    return `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
  };

  // Función para determinar capítulo por autor
  const determinarCapitulo = (autor) => {
    if (!autor) return 'Reflexiones';
    const autorLower = autor.toLowerCase();
    if (autorLower.includes('anzoátegui') || autorLower.includes('anzoategui')) return 'Anzoátegui';
    if (autorLower.includes('zulia')) return 'Zulia';
    if (autorLower.includes('carabobo')) return 'Carabobo';
    if (autorLower.includes('monagas')) return 'Monagas';
    if (autorLower.includes('falcón') || autorLower.includes('falcon')) return 'Falcón';
    return 'Reflexiones';
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
          <p className="loading-text">Cargando noticia...</p>
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
          <div className="error-icon">📰</div>
          <h1 className="error-title">Noticia no encontrada</h1>
          <p className="error-message">{error}</p>
          <button className="btn-volver" onClick={() => router.push('/noticias')}>
            Volver a Noticias
          </button>
        </div>
      </>
    );
  }

  if (!noticia) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        .noticia-container {
          max-width: 930px;
          margin: 0 auto;
          padding: 40px 20px;
          background: #ffffff;
          min-height: 100vh;
        }

        .noticia-header {
          position: relative;
          margin-bottom: 40px;
          text-align: center;
        }

        .noticia-imagen {
          width: 100%;
          max-width: 930px;
          height: 560px;
          object-fit: cover;
          border-radius: 0;
          box-shadow: none;
          display: block;
        }

        .noticia-tags {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 0;
          margin: 0;
        }

        .noticia-tag {
          background: #FFD700;
          color: #000;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .noticia-fecha-tag {
          background: #666666;
          color: white;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 500;
          margin: 0;
        }

        .noticia-content {
          background: white;
          padding: 40px 20px;
          margin-bottom: 40px;
          text-align: center;
        }

        .noticia-title {
          font-size: 32px;
          font-weight: 700;
          color: #000;
          margin: 0 0 30px 0;
          line-height: 1.3;
          text-align: center;
          font-family: Arial, sans-serif;
        }

        .noticia-descripcion {
          font-size: 16px;
          line-height: 1.6;
          color: #666;
          text-align: justify;
          margin-bottom: 40px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          font-family: Arial, sans-serif;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }

        .btn-regresar {
          background-color: #FFD700;
          color: #000;
          padding: 12px 40px;
          border: none;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: Arial, sans-serif;
        }

        .btn-regresar:hover {
          background-color: #FFC107;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .noticia-container {
            padding: 20px 15px;
          }

          .noticia-imagen {
            height: 250px;
          }

          .noticia-title {
            font-size: 1.8rem;
          }

          .noticia-content {
            padding: 25px 20px;
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

          .noticia-tags {
            bottom: 15px;
            left: 15px;
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="noticia-container">
        {/* Header con imagen */}
        <div className="noticia-header">
          <img 
            src={noticia.imagen || '/img/post1.jpg'} 
            alt={noticia.titulo}
            className="noticia-imagen"
          />
          <div className="noticia-tags">
            <div className="noticia-tag">
              {determinarCapitulo(noticia.autor)}
            </div>
            <div className="noticia-fecha-tag">
              CPV publicado: {formatearFecha(noticia.fechaCreacion || noticia.fecha)}
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="noticia-content">
          <h1 className="noticia-title">{noticia.titulo}</h1>
          
          <div className="noticia-descripcion">
            {noticia.descripcion}
          </div>

          {/* Botón de acción */}
          <div className="action-buttons">
            <button 
              className="btn-regresar" 
              onClick={() => router.push('/noticias')}
            >
              Regresar
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 