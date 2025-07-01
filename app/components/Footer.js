'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const [ultimasNoticias, setUltimasNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar las últimas 2 noticias
  const cargarUltimasNoticias = async () => {
    try {
      const response = await fetch('/api/noticias');
      if (response.ok) {
        const data = await response.json();
        const noticias = data.noticias || [];
        setUltimasNoticias(noticias.slice(0, 2)); // Solo las primeras 2
      } else {
        console.error('Error cargando noticias para footer');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    cargarUltimasNoticias();
  }, []);

  // Función para truncar título
  const truncarTitulo = (titulo) => {
    if (!titulo) return '';
    return titulo.length > 60 ? titulo.substring(0, 60) + "..." : titulo;
  };

  return (
    <>
      <style jsx>{`
        .CamaraPetrolera-Footer {
          background-image: url('/img/Footer.png');
          padding: 45px 80px 45px 80px;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }

        .CamaraPetrolera-Footer--container {
          padding-bottom: 8em;
        }

        .row2 {
          display: flex;
          flex-direction: row;
          gap: 10em;
        }

        .col-33 {
          width: 33%;
        }

        .col-33b {
          width: 33%;
        }

        .col-100 {
          width: 100%;
        }

        .col-100-a {
          width: 100%;
          text-align: center;
        }

        .CamaraPetrolera-Footer--paragraph {
          color: #adabab;
          font-size: 12px;
          margin-bottom: 10px;
          margin-top: 10px;
        }

        .CamaraPetrolera-Location {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 5px;
        }

        .CamaraPetrolera-Location--Marker {
          background-color: #000000;
          padding: 15px;
        }

        .CamaraPetrolera-LocationText {
          color: #878686;
        }

        .fa-location-dot {
          color: #4b4a4a;
        }

        .CamaraPetrolera-Footer--logo {
          width: 45px;
          height: 45px;
        }

        .CamaraPetrolera-Footer--h2heading {
          font-size: 25px;
          color: #ffffff;
        }

        .separator {
          background-color: #ff9900;
          height: 3px;
        }

        .CamaraPetrolera-Footer--link-container {
          padding: 0;
          margin-top: 30px;
        }

        .CamaraPetrolera-Footer--link {
          list-style: none;
          font-weight: 600;
          padding-bottom: 15px;
          color: #ffffff;
          font-size: 16px;
        }

        .CamaraPetrolera-Footer--link a,
        .CamaraPetrolera-Footer--link > a {
          color: #ffffff;
          text-decoration: none;
        }

        .CamaraPetrolera-post {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 15px;
          gap: 15px;
        }

        .CamaraPetrolera-post--image {
          width: 118px;
          height: 70px;
        }

        .CamaraPetrolera-post--text {
          color: #ffffff;
          font-weight: 600;
          font-size: 18px;
          line-height: 1.3;
        }

        .CamaraPetrolera-post a {
          text-decoration: none;
          color: inherit;
        }

        .CamaraPetrolera-post:hover {
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .CamaraPetrolera-copy {
          color: #ffffff;
        }

        .CamaraPetrolera-copy--url {
          color: #ff9900;
          font-weight: 400;
        }

        @media screen and (max-width: 600px) {
          .CamaraPetrolera-Footer {
            padding: 45px 15px 45px 15px;
          }

          .col-33b {
            width: 100%;
          }

          .CamaraPetrolera-Footer--container {
            padding-bottom: 5em;
          }

          .CamaraPetrolera-Footer--paragraph {
            font-size: 12px;
            padding-top: 5px;
            padding-bottom: 5px;
          }

          .CamaraPetrolera-Location {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 5px;
            padding-bottom: 10px;
          }

          .CamaraPetrolera-copy {
            color: #ffffff;
            text-align: center;
          }

          .row2 {
            display: flex;
            flex-direction: column;
            gap: 0;
          }
        }

        @media screen and (width: 1024px) {
          .CamaraPetrolera-Footer {
            padding: 45px 30px 45px 30px;
          }

          .CamaraPetrolera-Footer--paragraph {
            font-size: 12px;
          }

          .CamaraPetrolera-LocationText {
            font-size: 12px;
          }

          .row2 {
            gap: 3em;
          }

          .CamaraPetrolera-Footer--h2heading {
            font-size: 18px;
          }

          .CamaraPetrolera-post--text {
            font-size: 12px;
          }
        }
      `}</style>

      <footer className="CamaraPetrolera-Footer">
        <div className="CamaraPetrolera-Footer--container">
          <div className="row2">
            <div className="col-33">
              <p className="CamaraPetrolera-Footer--paragraph">
                La Cámara Petrolera de Venezuela es la organización empresarial venezolana que agrupa y representa al sector productivo de la industria de los hidrocarburos.
              </p>
              <div className="CamaraPetrolera-Location">
                <div className="CamaraPetrolera-Location--Marker">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div className="CamaraPetrolera-LocationText">
                  <strong>Av Abraham Lincoln Con Calle Olimpo,</strong><br />
                  Torre Domus, Piso 3, Oficina 3-A.<br />
                  Sabana Grande Caracas
                </div>
              </div>
            </div>

            <div className="col-33b">
              <h2 className="CamaraPetrolera-Footer--h2heading">Acceso Rápido</h2>
              <div className="separator"></div>
              <ul className="CamaraPetrolera-Footer--link-container">
                <li className="CamaraPetrolera-Footer--link">
                  <Link href="/">Inicio</Link>
                </li>
                <li className="CamaraPetrolera-Footer--link">
                  <Link href="/lacamara">La Camara</Link>
                </li>
                <li className="CamaraPetrolera-Footer--link">
                  <Link href="/directorio">Directorio</Link>
                </li>
                <li className="CamaraPetrolera-Footer--link">
                  <Link href="/afiliarse">Afiliarse</Link>
                </li>
              </ul>
            </div>

            <div className="col-33b">
              <h2 className="CamaraPetrolera-Footer--h2heading">Últimas Publicaciones</h2>
              <div className="separator"></div>
              <ul className="CamaraPetrolera-Footer--link-container">
                {loading ? (
                  <li>
                    <p className="CamaraPetrolera-post--text">Cargando publicaciones...</p>
                  </li>
                ) : ultimasNoticias.length === 0 ? (
                  <li>
                    <p className="CamaraPetrolera-post--text">No hay publicaciones disponibles.</p>
                  </li>
                ) : (
                  ultimasNoticias.map((noticia, index) => (
                    <li key={noticia._id || index}>
                      <Link href={`/noticias/${noticia._id}`}>
                        <div className="CamaraPetrolera-post">
                          <img 
                            className="CamaraPetrolera-post--image" 
                            src={noticia.imagen || '/img/post1.webp'} 
                            alt={noticia.titulo || "Publicación"}
                            style={{objectFit: 'cover'}}
                          />
                          <p className="CamaraPetrolera-post--text">
                            {truncarTitulo(noticia.titulo)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-100-a">
          <p className="CamaraPetrolera-copy">
            All Copyright 2024 by <span className="CamaraPetrolera-copy--url">Smartworld.com.ve</span>
          </p>
        </div>
      </footer>
    </>
  );
} 