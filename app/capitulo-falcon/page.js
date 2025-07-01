"use client";

import { useEffect, useState } from 'react';

export default function CapituloFalcon() {
  // Estados para manejar los eventos
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar eventos desde la API
  const cargarEventos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/eventos');
      if (response.ok) {
        const data = await response.json();
        // Filtrar eventos que pertenezcan al estado "Falcón" y no estén cancelados
        const eventosFalcon = (data.eventos || []).filter(evento => {
          const estado = evento.estado || '';
          return (estado.toLowerCase().includes('falcón') || 
                  estado.toLowerCase().includes('falcon')) && 
                 !evento.cancelado;
        });
        setEventos(eventosFalcon);
      } else {
        console.error('Error cargando eventos');
        setEventos([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar eventos al montar el componente
  useEffect(() => {
    cargarEventos();
  }, []);

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  return (
    <>
      
      <style jsx>{`
        /* Hero Section */
        .hero-section {
          height: 800px;
          background-image: url('/img/falcon.jpeg');
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          padding: 0 20px;
        }

        .hero-title-container {
          background-color: rgba(0, 0, 0, 0.5);
          padding: 20px;
          border-radius: 10px;
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
        }

        .hero-subtitle {
          color: #ffffff;
          font-size: 1.2rem;
          margin-bottom: 15px;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
          text-transform: uppercase;
          font-weight: 500;
        }

        .hero-title {
          color: #ffffff;
          font-size: 2.5rem;
          font-weight: 700;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          line-height: 1.2;
          margin: 0;
        }

        /* Beneficios Section */
        .beneficios-section {
          padding: 80px 0;
          background: rgb(0, 0, 0);
          color: white;
        }

        .beneficios-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .beneficios-title {
          font-size: 36px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 60px;
          color: white;
        }

        .beneficios-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .beneficio-card {
          background-color: #222;
          height: 250px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          text-align: center;
        }

        .beneficio-card.active {
          background-color: #ff9900;
        }

        .beneficio-overlay {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background-color: #ff9900;
          transition: left 0.3s ease;
          z-index: 1;
        }

        .beneficio-card:hover .beneficio-overlay {
          left: 0;
        }

        .beneficio-content {
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          text-align: left;
          height: 100%;
          width: 100%;
          padding: 0 20px;
        }

        .beneficio-title {
          font-size: 24px;
          font-weight: 700;
          line-height: 1.3;
          margin: 0;
          text-transform: uppercase;
        }

        .beneficio-arrow {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 0 20px 20px;
          border-color: transparent transparent #ff9900 transparent;
        }

        .beneficio-card.active .beneficio-arrow {
          border-color: transparent transparent #ffffff transparent;
        }

        /* Acerca Camara Section */
        .acerca-camara-section {
          background-color: #191919;
          padding: 80px 0;
          color: white;
        }

        .acerca-camara-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .acerca-camara-title {
          font-size: 2.5rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 10px;
          color: #ffffff;
        }

        .acerca-camara-subtitle {
          color: #888;
          font-size: 1.1rem;
          margin-bottom: 20px;
        }

        .acerca-camara-separator {
          height: 3px;
          width: 60px;
          background-color: #ff9900;
          margin-bottom: 30px;
        }

        .acerca-camara-content p {
          color: #ccc;
          line-height: 1.8;
          font-size: 1.1rem;
          margin-bottom: 60px;
        }

        /* Eventos Section */
        .eventos-section {
          background-color: #191919;
          padding: 0 0 80px 0;
        }

        .eventos-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .eventos-title {
          font-size: 2rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 10px;
          color: #ffffff;
        }

        .eventos-separator {
          height: 3px;
          width: 60px;
          background-color: #ff9900;
          margin-bottom: 40px;
        }

        .eventos-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .evento-card {
          height: 200px;
          background-size: cover;
          background-position: center;
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .evento-card:hover {
          transform: scale(1.05);
        }

        .evento-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
        }

        .evento-content {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          color: white;
          z-index: 2;
        }

        .evento-title {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .evento-date {
          font-size: 0.8rem;
          color: #ff9900;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        /* Contacto Section */
        .contacto-section {
          background-color: #111111;
          padding: 80px 0;
          color: white;
        }

        .contacto-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .contacto-title {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }

        .contacto-separator {
          height: 3px;
          width: 60px;
          background-color: #f7931e;
          margin: 0 auto 40px;
        }

        .contacto-subtitle-container {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 1px solid #333;
          padding-bottom: 15px;
        }

        .contacto-icon {
          font-size: 1.75rem;
          color: #f7931e;
          margin-right: 15px;
        }

        .contacto-subtitle {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }

        .contacto-details {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .contacto-item {
          display: flex;
          align-items: flex-start;
          gap: 20px;
        }

        .contacto-item i {
          color: #f7931e;
          font-size: 1.25rem;
          margin-top: 3px;
        }

        .contacto-text p {
          margin: 0 0 5px;
          color: #cccccc;
          line-height: 1.6;
        }

        .contacto-text a {
          color: #f7931e;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .contacto-text a:hover {
          color: #ffffff;
        }

        /* Estados de carga para eventos */
        .eventos-loading {
          text-align: center;
          padding: 60px 20px;
          color: #ccc;
          font-size: 18px;
        }

        .eventos-no-data {
          text-align: center;
          padding: 60px 20px;
          color: #888;
          font-size: 18px;
        }

        /* CamaraPetroleraBig Section */
         .CamaraPetroleraBig {
          background-color: #000000;
          padding: 5px 25px 5px 25px;
        }

        .CamaraPetrolera-Heading {
          color: #ffffff;
          font-size: 8em;
          margin: 5px;
          text-transform: uppercase;
          text-align: center;
          background-image: url('/img/Footer.png');
          background-size: cover;
          background-position: center;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 900;
          letter-spacing: 2px;
          line-height: 1;
          padding: 20px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }

          .beneficios-grid {
            grid-template-columns: 1fr;
          }
          
          .beneficio-title {
            font-size: 16px;
          }

          .eventos-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .acerca-camara-section,
          .contacto-section {
            padding: 40px 0;
          }

          .CamaraPetrolera-Heading {
            font-size: 60px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-title-container">
            <h3 className="hero-subtitle">CAPÍTULO FALCON</h3>
            <h1 className="hero-title">
              En el estado Falcón se encuentra el Centro de Refinación Paraguaná, el segundo más grande del mundo. Este centro concentra la mayor parte de la capacidad de refinación en Venezuela
            </h1>
          </div>
        </div>
      </div>

      {/* Beneficios Section */}
      <section className="beneficios-section">
        <div className="beneficios-container">
          <h2 className="beneficios-title">BENEFICIOS DE LA AFILIACIÓN</h2>
          
          <div className="beneficios-grid">
            {/* Tarjeta 1 */}
            <div className="beneficio-card">
              <div className="beneficio-overlay"></div>
              <div className="beneficio-content">
                <h3 className="beneficio-title">PARTICIPACIÓN EN LAS COMISIONES DE TRABAJO</h3>
                <div className="beneficio-arrow"></div>
              </div>
            </div>
            
            {/* Tarjeta 2 */}
            <div className="beneficio-card">
              <div className="beneficio-overlay"></div>
              <div className="beneficio-content">
                <h3 className="beneficio-title">PARTICIPACIÓN EN LAS ACTIVIDADES DE LA CÁMARA</h3>
                <div className="beneficio-arrow"></div>
              </div>
            </div>
            
            {/* Tarjeta 3 */}
            <div className="beneficio-card">
              <div className="beneficio-overlay"></div>
              <div className="beneficio-content">
                <h3 className="beneficio-title">INSCRIPCIÓN EN EL CATÁLOGO DE LOS AFILIADOS DE LA CPV</h3>
                <div className="beneficio-arrow"></div>
              </div>
            </div>
            
            {/* Tarjeta 4 */}
            <div className="beneficio-card">
              <div className="beneficio-overlay"></div>
              <div className="beneficio-content">
                <h3 className="beneficio-title">REPRESENTACIÓN INSTITUCIONAL DEL SECTOR PRODUCTIVO PRIVADO ASOCIADO A LOS HIDROCARBUROS</h3>
                <div className="beneficio-arrow"></div>
              </div>
            </div>
            
            {/* Tarjeta 5 */}
            <div className="beneficio-card">
              <div className="beneficio-overlay"></div>
              <div className="beneficio-content">
                <h3 className="beneficio-title">FORMULACIÓN DE PROPUESTAS A LA AGENDA LEGISLATIVA NACIONAL</h3>
                <div className="beneficio-arrow"></div>
              </div>
            </div>
            
            {/* Tarjeta 6 */}
            <div className="beneficio-card">
              <div className="beneficio-overlay"></div>
              <div className="beneficio-content">
                <h3 className="beneficio-title">DIFUNDIR LA VISIÓN Y LOS OBJETIVOS DE NUESTRO SECTOR</h3>
                <div className="beneficio-arrow"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Acerca Camara Section */}
      <section className="acerca-camara-section">
        <div className="acerca-camara-container">
          <div className="acerca-camara-info">
            <h1 className="acerca-camara-title">LA CÁMARA</h1>
            <div className="acerca-camara-subtitle">Fundada el 24 de mayo de 1978</div>
            <div className="acerca-camara-separator"></div>
            <div className="acerca-camara-content">
              <p>
                La Formación de la Cámara Petrolera de Venezuela, inicialmente llamada Cámara de Suplidores de Bienes y Servicios y fundada el 24 de mayo de 1978, derivó del cambio fundamental ocurrido en la industria del petróleo venezolano al entrar en vigencia la Ley Orgánica que Reserva al Estado la Industria y el Comercio de los Hidrocarburos.
              </p>
            </div>
          </div>
          
          {/* Eventos Section */}
          <div className="eventos-section">
            <div className="eventos-container">
              <h2 className="eventos-title">EVENTOS</h2>
              <div className="eventos-separator"></div>
              
              {loading ? (
                <div className="eventos-loading">
                  Cargando eventos de Falcón...
                </div>
              ) : eventos.length === 0 ? (
                <div className="eventos-no-data">
                  No hay eventos programados para Falcón en este momento.
                </div>
              ) : (
                <div className="eventos-grid">
                  {eventos.map((evento) => (
                    <a
                      key={evento._id}
                      href={`/eventos/${evento._id}`}
                      className="evento-link"
                      style={{textDecoration: 'none', color: 'inherit'}}
                    >
                      <div 
                        className="evento-card" 
                        style={{
                          backgroundImage: evento.imagen 
                            ? `url(${evento.imagen})` 
                            : "url('/img/post2.jpg')"
                        }}
                      >
                        <div className="evento-overlay"></div>
                        <div className="evento-content">
                          <h3 className="evento-title">{evento.titulo}</h3>
                          <div className="evento-date">
                            <i className="fas fa-calendar-alt"></i> {formatearFecha(evento.fechaEvento)}
                            {evento.horaEvento && (
                              <span style={{marginLeft: '10px'}}>
                                🕒 {evento.horaEvento}
                              </span>
                            )}
                          </div>
                          {evento.organizador && (
                            <div className="evento-organizador" style={{
                              fontSize: '14px',
                              color: '#ccc',
                              marginTop: '10px'
                            }}>
                              Organiza: {evento.organizador}
                            </div>
                          )}
                          <div className="ver-mas-evento" style={{
                            marginTop: '15px',
                            padding: '8px 16px',
                            background: 'rgba(255,255,255,0.9)',
                            color: '#004a87',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'inline-block'
                          }}>
                            Ver detalles →
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contacto Section */}
      <section className="contacto-section">
        <div className="contacto-container">
          <h2 className="contacto-title">INFORMACIÓN DE CONTACTO</h2>
          <div className="contacto-separator"></div>
          
          <div className="contacto-subtitle-container">
            <i className="fa-solid fa-building contacto-icon"></i>
            <h3 className="contacto-subtitle">Capítulo Falcón</h3>
          </div>
          
          <div className="contacto-details">
            <div className="contacto-item">
              <i className="fa-solid fa-phone"></i>
              <div className="contacto-text">
                <p>Atención telefónica: +58 212 794.1222</p>
              </div>
            </div>
            
            <div className="contacto-item">
              <i className="fa-solid fa-envelope"></i>
              <div className="contacto-text">
                <p><a href="mailto:falcon@camarapetrolera.org">falcon@camarapetrolera.org</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección La Cámara Petrolera Grande */}
      <section className="CamaraPetroleraBig">
        <div className="CamaraPetrolera-containerimg">
          <h1 className="CamaraPetrolera-Heading">La Cámara Petrolera</h1>
        </div>
      </section>

    </>
  );
} 