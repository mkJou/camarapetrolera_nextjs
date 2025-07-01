'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Cargar noticias desde la API
  const cargarNoticias = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/noticias');
      if (response.ok) {
        const data = await response.json();
        setNoticias(data.noticias || []);
      } else {
        console.error('Error cargando noticias');
        setNoticias([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setNoticias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    cargarNoticias();
  }, []);

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return '21 Ene 2025';
    try {
      const fechaObj = new Date(fecha);
      const dia = fechaObj.getDate();
      const mes = fechaObj.getMonth();
      const año = fechaObj.getFullYear();
      
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      return `${dia} ${meses[mes]} ${año}`;
    } catch (error) {
      return '21 Ene 2025';
    }
  };

  // Función para determinar capítulo
  const determinarCapitulo = (autor) => {
    if (!autor) return 'GENERAL';
    const autorLower = autor.toLowerCase();
    if (autorLower.includes('anzoátegui') || autorLower.includes('anzoategui')) return 'ANZOÁTEGUI';
    if (autorLower.includes('zulia')) return 'ZULIA';
    if (autorLower.includes('carabobo')) return 'CARABOBO';
    if (autorLower.includes('monagas')) return 'MONAGAS';
    if (autorLower.includes('falcón') || autorLower.includes('falcon')) return 'FALCÓN';
    return 'GENERAL';
  };

  // Función para truncar descripción
  const truncarDescripcion = (descripcion) => {
    if (!descripcion) return '';
    const extracto = descripcion.substring(0, 330);
    return extracto + "...";
  };

  return (
    <>
      <style jsx>{`
        .titular {
          text-align: left;
          padding: 40px 0 20px 0;
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 20px;
          padding-right: 20px;
        }

        .titular h1 {
          font-size: 64px;
          font-weight: 700;
          color: #000000;
          margin: 0 0 20px 0;
          font-family: Arial, sans-serif;
          position: relative;
          display: inline-block;
        }

        .titular h1::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 1200px;
          height: 4px;
          background-color: #ff9900;
        }

        .container-noticias {
          background-color: #ffffff;
          min-height: 100vh;
          padding-bottom: 40px;
        }

        #enlaces {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .centrar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .card {
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid #e0e0e0;
          position: relative;
          display: flex;
          flex-direction: column;
          height: 450px;
        }

        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.25);
        }

        .card-image-container {
          height: 200px;
          overflow: hidden;
        }

        .card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .card-info-bar {
          background-color:#7f7f7f;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e0e0e0;
        }

        .card-info-bar .fecha-info span {
          color: white;
          font-size: 13px;
          font-weight: 500;
          font-family: Arial, sans-serif;
        }

        .category {
          background-color:#999999;
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: 0;
          font-family: Arial, sans-serif;
        }

        .card-content {
          padding: 20px;
          background-color: #ffffff;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-content h3 {
          font-size: 18px;
          font-weight: 700;
          color: #000000;
          margin: 0 0 12px 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-family: Arial, sans-serif;
        }

        .card-content p {
          font-size: 14px;
          color: #666666;
          margin: 0 0 15px 0;
          line-height: 1.5;
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-family: Arial, sans-serif;
        }

        .read-post {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #ff9900;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.3s ease;
          font-family: Arial, sans-serif;
          align-self: flex-start;
        }

        .read-post:hover {
          color: #e68900;
        }

        .read-post i {
          font-size: 12px;
        }

        .navegacion_noticias {
          text-align: center;
          padding: 40px 0;
          max-width: 1200px;
          margin: 0 auto;
        }

        .loading-container {
          text-align: center;
          padding: 80px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #FFD700;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .centrar {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .titular h1 {
            font-size: 36px;
          }
          
          .centrar {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          
          .card img {
            height: 180px;
          }
        }

        @media (max-width: 480px) {
          .centrar {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="titular">
        <h1>Noticias</h1>        
      </div>

      <div className="container-noticias">
        <div id="enlaces">
          <div className="centrar">
            {!mounted || loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p style={{ fontSize: '18px', color: '#666' }}>Cargando noticias...</p>
              </div>
            ) : noticias.length === 0 ? (
              <div className="loading-container">
                <p style={{ fontSize: '18px', color: '#666' }}>No hay noticias disponibles en este momento.</p>
              </div>
            ) : (
                             noticias.map((noticia) => (
                 <div key={noticia._id} className="card">
                   <div className="card-image-container">
                     <img 
                       alt={noticia.titulo || "Noticia"} 
                       height="200" 
                       src={noticia.imagen || '/img/post1.jpg'} 
                       width="300"
                     />
                   </div>
                   <div className="card-info-bar">
                     <div className="fecha-info">
                       <span>
                         {formatearFecha(noticia.fechaCreacion || noticia.fecha)}
                       </span>
                     </div>
                     <div className="category">                       
                     <p>
                       CPV
                     </p>
                     </div>
                   </div>
                   <div className="card-content">
                     <h3>
                       {noticia.titulo}
                     </h3>
                     <p>
                       {truncarDescripcion(noticia.descripcion)}
                     </p>
                     <Link className="read-post" href={`/noticias/${noticia._id}`}>
                       Leer
                       <i className="fas fa-arrow-right"></i>
                     </Link>
                   </div>
                 </div>
               ))
            )}
          </div>
        </div>
        
        <div className="navegacion_noticias">
          {/* 
            <button className="btn_noticias">Anterior</button>
            <button className="btn_noticias">Siguiente</button> 
          */}
        </div>
      </div>
    </>
  );
} 