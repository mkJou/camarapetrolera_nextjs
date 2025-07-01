'use client'

import { useEffect, useState } from 'react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState([]);
  const [slidesLoading, setSlidesLoading] = useState(true);
  
  // Slides por defecto en caso de que no haya slides en la base de datos
  const defaultSlides = [
    {
      imagen: '/img/banner.png',
      titulo: 'El Mejor aliado del país',
      subtitulo: 'Generando oportunidades de desarrollo en la industria de los hidrocarburos'
    },
    {
      imagen: '/img/IndustriaPetrolera.png',
      titulo: 'Cámara Petrolera de Venezuela',
      subtitulo: 'Impulsando el desarrollo de la industria petrolera nacional'
    },
    {
      imagen: '/img/petroleorefineria.jpg',
      titulo: 'Excelencia y compromiso',
      subtitulo: 'Promoviendo la integración y el crecimiento del sector'
    }
  ];

  // Cambiar slide automáticamente cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [slides.length]);

  // Cargar slides desde la API
  const cargarSlides = async () => {
    try {
      const response = await fetch('/api/slides');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.slides && data.slides.length > 0) {
          setSlides(data.slides.filter(slide => slide.activo));
        } else {
          // Si no hay slides en la BD, usar los por defecto
          setSlides(defaultSlides);
        }
      } else {
        console.error('Error cargando slides, usando slides por defecto');
        setSlides(defaultSlides);
      }
    } catch (error) {
      console.error('Error:', error);
      setSlides(defaultSlides);
    } finally {
      setSlidesLoading(false);
    }
  };

  // Cargar noticias desde la API
  const cargarNoticias = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/noticias');
      if (response.ok) {
        const data = await response.json();
        // Limitamos a las últimas 4 noticias
        const ultimasNoticias = (data.noticias || []).slice(0, 4);
        setNoticias(ultimasNoticias);
      } else {
        console.error('Error cargando noticias');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar slides y noticias al montar el componente
  useEffect(() => {
    cargarSlides();
    cargarNoticias();
  }, []);

  // Mostrar solo las 5 últimas noticias
  const noticiasActuales = noticias.slice(0, 5);

  // Función para formatear fecha (actualizada para coincidir con noticias)
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

  // Función para truncar descripción (versión compacta)
  const truncarDescripcion = (descripcion) => {
    if (!descripcion) return '';
    const extracto = descripcion.substring(0, 100);
    return extracto + "...";
  };

  return (
    <>
      {/* Estilos CSS personalizados */}
      <style jsx>{`
        /* Estilos para el hero section con slider */
        .hero-section {
          position: relative;
          width: 100%;
          height: 500px;
          overflow: hidden;
        }
        
        .hero-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1s ease-in-out;
        }
        
        .hero-slide.active {
          opacity: 1;
        }
        
        .hero-background {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
        }
        
        .hero-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.4);
        }
        
        .hero-content {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
        
        .hero-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: white;
          margin-bottom: 1rem;
        }
        
        .hero-subtitle {
          font-size: 1.5rem;
          color: white;
          margin-bottom: 1rem;
        }
        
        /* Navegación del slider */
        .slider-nav {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 20;
        }
        
        .slider-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .slider-dot.active {
          background-color: white;
        }
        
        .slider-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 20;
          transition: background-color 0.3s;
        }
        
        .slider-arrow:hover {
          background-color: rgba(0, 0, 0, 0.8);
        }
        
        .slider-arrow-left {
          left: 20px;
        }
        
        .slider-arrow-right {
          right: 20px;
        }

        /* Estilos para la sección CamaraPetrolera */
        .CamaraPetrolera {
          padding: 80px 0;
          background:#191919;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          gap: 60px;
        }

        .CamaraPetrolera-left {
          flex: 1;
          position: relative;
        }

        .CamaraPetrolera-image {
          width: 100%;
          height: 400px;
          background: url('/img/IndustriaPetrolera.png') center/cover;
          border-radius: 10px;
          position: relative;
          z-index: 1;
        }

        .CamaraPetrolera-image--front {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 100%;
          height: 400px;
          background: rgba(0, 123, 191, 0.1);
          border-radius: 10px;
          z-index: 0;
        }

        .CamaraPetrolera-right {
          flex: 1;
        }

        .CamaraPetrolera-content h4 {
          color: #878686;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
        }

        .CamaraPetrolera-content h1 {
          font-size: 36px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 30px;
          color: white;
        }

        .secondary {
          background: black;
          color: white;
          padding: 12px 30px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .secondary:hover {
          background: #ff9900;
          transform: translateY(-2px);
        }

        .secondary a {
          color: white;
          text-decoration: none;
        }
        
        /* Estilos para la sección de beneficios */
        .beneficios-section {
          padding: 80px 0;
          background:rgb(0, 0, 0);
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

        /* Estilos para la sección de noticias - Idénticos a la página de noticias */
        .noticias-section {
          background-color: #ffffff;
          padding: 60px 0;
        }

        .noticias-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .noticias-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .noticias-title {
          font-size: 48px;
          font-weight: 700;
          color: #000000;
          margin: 0 0 20px 0;
          font-family: Arial, sans-serif;
        }

        .noticias-subtitle {
          font-size: 18px;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }

        .noticias-grid {
          display: flex;
          gap: 20px;
          margin-bottom: 50px;
          justify-content: space-between;
        }

        .noticia-card {
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid #e0e0e0;
          position: relative;
          display: flex;
          flex-direction: column;
          height: 450px !important;
          max-height: 450px !important;
          width: calc(25% - 15px);
          flex-shrink: 0;
        }

        .noticia-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.25);
        }

        .card-image-container {
          height: 220px;
          overflow: hidden;
        }

        .noticia-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .card-info-bar {
          background-color:#7f7f7f;
          padding: 10px 18px;
          height: 44px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e0e0e0;
        }

        .card-info-bar .fecha-info span {
          color: white;
          font-size: 14px;
          font-weight: 500;
          font-family: Arial, sans-serif;
        }

        .category {
          background-color:#999999;
          color: white;
          font-size: 12px;
          font-weight: 700;
          padding: 5px 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: 0;
          font-family: Arial, sans-serif;
        }

        .card-content {
          padding: 20px;
          background-color: #ffffff;
          height: 170px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-content h3 {
          font-size: 19px;
          font-weight: 700;
          color: #000000;
          margin: 0 0 12px 0;
          line-height: 1.3;
          height: 52px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-family: Arial, sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-content p {
          font-size: 15px;
          color: #666666;
          margin: 0 0 15px 0;
          line-height: 1.5;
          height: 48px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-family: Arial, sans-serif;
        }

        .read-post {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #ff9900;
          font-size: 15px;
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

        .loading-container {
          text-align: center;
          padding: 80px 20px;
        }

        .loading-text {
          font-size: 18px;
          color: #666;
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

        .no-noticias {
          text-align: center;
          padding: 60px 20px;
          color: #666;
          font-size: 18px;
        }



        /* Estilos para la sección Acerca de la Cámara */
        .acerca-camara-section {
          padding: 80px 0;
          background: #191919;
          color: white;
        }

        .acerca-camara-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .acerca-camara-info {
          position: relative;
        }

        .acerca-camara-header {
          margin-bottom: 30px;
          position: relative;
        }

        .acerca-camara-title {
          font-size: 48px;
          font-weight: 700;
          color: white;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .acerca-camara-subtitle {
          font-size: 18px;
          color: #878686;
          margin-bottom: 20px;
        }

        .acerca-camara-separator {
          width: 80px;
          height: 4px;
          background: #ff9900;
          margin-bottom: 30px;
        }

        .acerca-camara-content p {
          font-size: 16px;
          line-height: 1.8;
          color: white;
          max-width: 800px;
          border-left: 4px solid #ff9900;
          padding-left: 20px;
        }

        /* Estilos para la sección Acerca de la Cámara */ 
        .acerca-camara-section { 
          padding: 80px 0; 
          background: #191919; 
          color: white; 
        } 

        .acerca-camara-container { 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 0 20px; 
        } 

        .acerca-camara-info { 
          position: relative; 
        } 

        .acerca-camara-header { 
          margin-bottom: 30px; 
          position: relative; 
        } 

        .acerca-camara-title { 
          font-size: 48px; 
          font-weight: 700; 
          color: white; 
          margin-bottom: 10px; 
          text-transform: uppercase; 
        } 

        .acerca-camara-subtitle { 
          font-size: 18px; 
          color: #878686; 
          margin-bottom: 20px; 
        } 

        .acerca-camara-separator { 
          width: 80px; 
          height: 4px; 
          background: #ff9900; 
          margin-bottom: 30px; 
        } 

        .acerca-camara-content p { 
          font-size: 16px; 
          line-height: 1.8; 
          color: white; 
          max-width: 800px; 
          border-left: 4px solid #ff9900; 
          padding-left: 20px; 
        } 

        /* Sección grande de la Cámara Petrolera */
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
        @media (max-width: 1024px) {
          .noticia-card {
            width: calc(50% - 10px);
          }
          .noticias-grid {
            overflow-x: auto;
            justify-content: flex-start;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 1.8rem;
          }
          
          .hero-subtitle {
            font-size: 1.2rem;
          }

          .container {
            flex-direction: column;
            gap: 40px;
          }

          .CamaraPetrolera-content h1 {
            font-size: 28px;
          }

          .acerca-camara-title {
            font-size: 36px;
          }

          .eventos-title {
            font-size: 28px;
          }

          .CamaraPetrolera-Heading {
            font-size: 60px;
            letter-spacing: 2px;
          }
          
          .beneficios-grid {
            grid-template-columns: 1fr;
          }
          
          .beneficio-title {
            font-size: 16px;
          }

          .noticias-title {
            font-size: 36px;
          }

          .noticia-card {
            width: calc(100% - 0px);
          }
        }

        @media (max-width: 480px) {
          .noticia-card {
            width: 100%;
          }
          .noticias-grid {
            flex-direction: column;
            gap: 15px;
          }
        }
      `}</style>

      {/* Hero Section con Slider */}
      <section className="hero-section">
        {/* Loading para slides */}
        {slidesLoading && (
          <div 
            className="hero-slide active"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#333'
            }}
          >
            <div style={{ color: 'white', fontSize: '18px' }}>
              Cargando slides...
            </div>
          </div>
        )}
        
        {/* Slides */}
        {!slidesLoading && slides.map((slide, index) => (
          <div 
            key={slide._id || index} 
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div 
              className="hero-background"
              style={{backgroundImage: `url('${slide.imagen || slide.image}')`}}
            ></div>
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <div className="text-center" style={{maxWidth: "80%"}}>
                <h3 className="hero-subtitle">{slide.titulo || slide.title}</h3>
                <h1 className="hero-title">{slide.subtitulo || slide.subtitle}</h1>
              </div>
            </div>
          </div>
        ))}
        
        {/* Flechas de navegación */}
        {!slidesLoading && slides.length > 1 && (
          <>
            <div 
              className="slider-arrow slider-arrow-left"
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
            >
              &#10094;
            </div>
            <div 
              className="slider-arrow slider-arrow-right"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            >
              &#10095;
            </div>
          </>
        )}
        
        {/* Puntos de navegación */}
        {!slidesLoading && slides.length > 1 && (
          <div className="slider-nav">
            {slides.map((_, index) => (
              <div 
                key={index}
                className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></div>
            ))}
          </div>
        )}
      </section>

      {/* Sección CamaraPetrolera */}
      <section className="CamaraPetrolera bg-black">
        <div className="container">
          <div className="CamaraPetrolera-left">
            <div className="CamaraPetrolera-image"></div>
            <div className="CamaraPetrolera-image--front"></div>
          </div>
          <div className="CamaraPetrolera-right">
            <div className="CamaraPetrolera-content">
              <h4>La Cámara Petrolera</h4>
              <h1>Fortaleciendo el papel del sector productivo en la industria de los hidrocarburos nacional</h1>
                              <button className="secondary"><a href="./?r=lacamara">Conócenos</a></button>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Beneficios de la Afiliación */}
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
            
            {/* Tarjeta 4 - La quitamos la clase active */}
            <div className="beneficio-card">
                              <div className="beneficio-overlay" style={{backgroundColor: "#ff9900"}}></div>
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

      {/* Sección La Cámara */}
      <section className="acerca-camara-section">
        <div className="acerca-camara-container">
          <div className="acerca-camara-info">
            <div className="acerca-camara-header">
              <h1 className="acerca-camara-title">LA CÁMARA</h1>
              <div className="acerca-camara-subtitle">Fundada el 24 de mayo de 1978</div>
              <div className="acerca-camara-separator"></div>
            </div>
            <div className="acerca-camara-content">
              <p>La Formación de la Cámara Petrolera de Venezuela, inicialmente llamada Cámara de Suplidores de Bienes y Servicios y fundada el 24 de mayo de 1978, derivó del cambio fundamental ocurrido en la industria del petróleo venezolano al entrar en vigencia la Ley Orgánica que Reserva al Estado la Industria y el Comercio de los Hidrocarburos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Noticias */}
      <section className="noticias-section">
        <div className="noticias-container">
          <div className="noticias-header">
            <h1 className="noticias-title">ÚLTIMAS NOTICIAS</h1>
            <p className="noticias-subtitle">
              Mantente informado sobre las últimas novedades del sector petrolero y las actividades de la Cámara
            </p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Cargando noticias...</p>
            </div>
          ) : noticiasActuales.length === 0 ? (
            <div className="no-noticias">
              No hay noticias disponibles en este momento.
            </div>
          ) : (
            <>
              <div className="noticias-grid">
                {noticiasActuales.map((noticia) => (
                  <div key={noticia._id} className="noticia-card">
                    <div className="card-image-container">
                      <img 
                        alt={noticia.titulo || "Noticia"} 
                        height="180" 
                        src={noticia.imagen || '/img/post1.jpg'} 
                        width="100%"
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
                      <a className="read-post" href={`/noticias/${noticia._id}`}>
                        Leer
                        <i className="fas fa-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
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
