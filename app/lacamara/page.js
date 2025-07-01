"use client";
import { useState, useEffect } from 'react';

export default function LaCamara() {
  return (
    <>
      
      <style jsx>{`
        .container_info {
          width: 100%;
        }

        .image {
          height: 50vh;
          background-image: url('/img/banner_info.jpg');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .image::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
        }

        .banner_text {
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .banner_text h1 {
          font-size: 4rem;
          color: white;
          font-weight: 900;
          text-transform: uppercase;
          margin: 0;
        }

        .content_info {
          padding: 60px 80px;
          background-color: #f8f9fa;
        }

        .split {
          display: flex;
          gap: 60px;
          margin-bottom: 40px;
        }

        .left, .right {
          flex: 1;
        }

        .left h1, .right h1 {
          color: #2c3e50;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        .left hr, .right hr {
          border: none;
          height: 3px;
          background-color: #ff9900;
          margin-bottom: 20px;
          width: 60px;
        }

        .left p, .right p {
          color: #666;
          line-height: 1.8;
          font-size: 1.1rem;
          margin-bottom: 15px;
        }

        .valores {
          margin-top: 60px;
        }

        .valores .left strong {
          color: #2c3e50;
          font-weight: 600;
        }

        .info_img {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 10px;
        }

        .button {
          background-color: #ff9900;
          color: white;
          padding: 14px 70px;
          font-size: 14px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          margin: 40px 0 20px 0;
          text-decoration: none;
          display: inline-block;
          border-radius: 5px;
          transition: all 0.3s ease;
        }

        .button:hover {
          background-color: #e68900;
        }

        .container-directorio {
          text-align: center;
          padding: 60px 80px;
          background-color: white;
        }

        .affiliates {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 30px;
          margin: 60px 0;
        }

        .affiliates img {
          max-height: 60px;
          max-width: 150px;
          object-fit: contain;
        }

        .categories {
          margin: 80px 0;
        }

        .Hero-Title--Big--secondary {
          color: #2c3e50;
          font-size: 2.5rem;
          text-transform: uppercase;
          margin-bottom: 40px;
          font-weight: 700;
        }

        .categories-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 30px;
          margin-top: 40px;
        }

        .category {
          position: relative;
          height: 250px;
          width: 300px;
          overflow: hidden;
          border-radius: 15px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .category:hover {
          transform: scale(1.05);
        }

        .category img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 20px;
          font-size: 1.2rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .new-affiliates {
          margin: 80px 0;
        }

        .companies {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 40px;
          margin-top: 40px;
        }

        .companies img {
          max-height: 80px;
          max-width: 200px;
          object-fit: contain;
        }

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
          .banner_text h1 {
            font-size: 2.5rem;
          }

          .content_info {
            padding: 40px 20px;
          }

          .split {
            flex-direction: column;
            gap: 40px;
          }

          .left h1, .right h1 {
            font-size: 2rem;
          }

          .container-directorio {
            padding: 40px 20px;
          }

          .affiliates {
            gap: 20px;
          }

          .affiliates img {
            max-height: 50px;
            max-width: 120px;
          }

          .categories-grid {
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }

          .category {
            height: 200px;
            width: 100%;
            max-width: 300px;
          }

          .CamaraPetrolera-Heading {
            font-size: 3em;
            letter-spacing: 1px;
          }

          .Hero-Title--Big--secondary {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="container_info">
        <div className="image">
          <div className="banner_text">
            <h1>CAMARA PETROLERA DE VENEZUELA</h1>
          </div>
        </div>
        
        <div className="content_info">
          <div className="split">
            <div className="left">
              <h1>MISIÓN</h1>        
              <hr />
              <p>organización empresarial venezolana que agrupa y representa al sector productivo privado de hidrocarburos, con un equipo humano competente y tecnología avanzada.</p>
            </div>
            <div className="right">
              <h1>VISIÓN</h1>
              <hr />        
              <p>ser referente nacional e internacional en el sector de hidrocarburos, con autonomía, sustentabilidad y responsabilidad social.</p>
            </div>
          </div>
          
          <div className="valores">
            <div className="split">
              <div className="left">
                <h1>VALORES</h1>
                <hr />
                <p>Nuestros valores fundamentales guían cada estrategia y acción:</p>
                <p><strong>Perseverancia:</strong> alcanzar objetivos y superar dificultades para el desarrollo del país.</p>
                <p><strong>Confiabilidad:</strong> asegurar calidad y uso óptimo de recursos.</p>
                <p><strong>Trabajo en equipo:</strong> alianzas estratégicas para mejorar la competitividad y calidad de vida.</p>
                <p><strong>Calidad:</strong> satisfacción de las necesidades de nuestros afiliados.</p>
                <p><strong>Coopetitividad:</strong> equilibrio entre colaboración y competencia para fomentar innovación y desarrollo.</p>
              </div>
              <div className="right">
                <img className="info_img" src="/img/IndustriaPetrolera.png" alt="Industria Petrolera" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-directorio">    
        <div className="affiliates">
          <img alt="argos" src="https://camarapetrolera.org/wp-content/uploads/2024/08/Argos.svg"/>
          <img alt="azex" src="https://camarapetrolera.org/wp-content/uploads/2024/08/Azex.jpg"/>
          <img alt="NV" src="https://camarapetrolera.org/wp-content/uploads/2024/08/NV.svg"/>
          <img alt="Petrocor" src="https://camarapetrolera.org/wp-content/uploads/2024/08/Petrocor.svg"/>
          <img alt="Barcan" src="https://camarapetrolera.org/wp-content/uploads/2024/08/Barcan.jpg"/>
          <img alt="Temi" src="https://camarapetrolera.org/wp-content/uploads/2024/08/Temi.svg"/>
          <img alt="ZIC" src="https://camarapetrolera.org/wp-content/uploads/2024/08/ZIC.svg"/>
          <a href="https://camarapetrolera.smart-world.es/empresas/?id_empresa=1">
            <img alt="smartworld" src="/img/smartword.png"/>
          </a>
        </div>
        
        <div className="categories">
          <h1 className="Hero-Title--Big--secondary">Sectores</h1>
          <div className="categories-grid">
            <div className="category">
              <img alt="Exploración y Evaluación" src="/img/exploracion petrolera.png"/>
              <div className="overlay">Exploración y Evaluación</div>
            </div>
            <div className="category">
              <img alt="Perforación y Completamiento" src="/img/perforacion.webp"/>
              <div className="overlay">Perforación y Completamiento</div>
            </div>
            <div className="category">
              <img alt="Producción" src="/img/produccionPetrolera.webp"/>
              <div className="overlay">Producción</div>
            </div>
            <div className="category">
              <img alt="Logística" src="/img/refineriaPetrolera.webp"/>
              <div className="overlay">Logística</div>
            </div>
            <div className="category">
              <img alt="Tratamiento" src="/img/petroleorefineria.jpg"/>
              <div className="overlay">Tratamiento</div>
            </div>
            <div className="category">
              <img alt="Bienes y Servicios Transversales" src="/img/BienesPetroleo.jpg"/>
              <div className="overlay">Bienes y Servicios Transversales</div>
            </div>
            <div className="category">
              <img alt="Energías Renovables" src="/img/energiasrenovables.jpg"/>
              <div className="overlay">Energías Renovables</div>
            </div>
          </div>
        </div>
        
        <div className="new-affiliates">
          <h1 className="Hero-Title--Big--secondary">Nuevos Afiliados</h1>
          <div className="companies">
            <img alt="azex" src="https://camarapetrolera.org/wp-content/uploads/2024/08/Azex.jpg"/>
            <img alt="Temi" src="https://camarapetrolera.org/wp-content/uploads/2024/08/Temi.svg"/>
            <img alt="Barcan" src="https://camarapetrolera.org/wp-content/uploads/2024/08/Barcan.jpg"/>
            <a href="https://camarapetrolera.smart-world.es/empresas/?id_empresa=1">
              <img alt="smartworld" src="/img/smartword.png"/>
            </a>
          </div>
        </div>
      </div>

      {/* Sección La Cámara Petrolera Grande */}
      <section className="CamaraPetroleraBig">
        <div className="CamaraPetrolera-containerimg">
          <h1 className="CamaraPetrolera-Heading">La Cámara Petrolera</h1>
        </div>
      </section>

    </>
  );
} 