'use client'

import Image from 'next/image';

export default function AfiliarsiPage() {
  const beneficios = [
    {
      titulo: "Comisiones de Trabajo",
      descripcion: "Participación en grupos especializados para incrementar la presencia del sector privado en la cadena de valor de hidrocarburos."
    },
    {
      titulo: "Networking",
      descripcion: "Interacción con representantes de organismos públicos y privados, nacionales e internacionales."
    },
    {
      titulo: "Eventos Internacionales",
      descripcion: "Posibilidad de formar parte de delegaciones en eventos del sector energético global."
    },
    {
      titulo: "Catálogo de Afiliados",
      descripcion: "Presencia en el directorio oficial, facilitando la exposición de bienes y servicios a potenciales clientes."
    },
    {
      titulo: "Representación Institucional",
      descripcion: "Defensa de los intereses del sector productivo privado asociado a los hidrocarburos."
    },
    {
      titulo: "Información Actualizada",
      descripcion: "Acceso a información relevante y noticias de interés para el sector."
    },
    {
      titulo: "Agenda Legislativa",
      descripcion: "Participación en la formulación de propuestas para políticas públicas del sector."
    },
    {
      titulo: "Capacitación Preferencial",
      descripcion: "Descuentos en eventos, cursos, talleres y seminarios especializados."
    },
    {
      titulo: "Espacios Publicitarios",
      descripcion: "Presencia en la Revista BARRILES, reconocido medio de comunicación del sector petrolero."
    }
  ];

  return (
    <>
      <style jsx>{`
        .container_info {
          background: url('/img/banner.png') center/cover;
          position: relative;
          min-height: 400px;
          display: flex;
          align-items: center;
        }

        .container_info::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
        }

        .content_info {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 20px;
          text-align: center;
          color: white;
        }

        .content_info h1 {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .benefits-container {
          max-width: 1200px;
          margin: 50px auto;
          padding: 0 20px;
        }

        .benefits-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
          margin-bottom: 40px;
        }

        .benefit-card {
          width: 300px;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          transition: transform 0.3s;
        }

        .benefit-card:hover {
          transform: translateY(-5px);
        }

        .benefit-header {
          background-color: #ff9900;
          padding: 15px;
          text-align: center;
        }

        .benefit-header h3 {
          margin: 0;
          font-size: 18px;
          color: white;
        }

        .benefit-content {
          padding: 20px;
          min-height: 120px;
          display: flex;
          align-items: center;
        }

        .benefit-content p {
          margin: 0;
          color: #333;
          line-height: 1.5;
        }

        .button {
          display: inline-block;
          background: #ff9900;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 600;
          margin: 10px;
          transition: background 0.3s;
        }

        .button:hover {
          background: #d55500;
          color: white;
        }

        .container-directorio {
          background: white;
          padding: 40px 0;
        }

        .affiliates {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 30px;
          flex-wrap: wrap;
          margin-bottom: 30px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 20px;
        }

        .affiliates img {
          height: 60px;
          width: auto;
          object-fit: contain;
          filter: grayscale(0%);
          transition: transform 0.3s;
        }

        .affiliates img:hover {
          transform: scale(1.1);
        }

        .categories {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
          text-align: center;
        }

        .Hero-Title--Big--secondary {
          font-size: 2rem;
          color: #333;
          margin-bottom: 30px;
          font-weight: bold;
        }

                 .categories-grid {
           display: grid;
           grid-template-columns: repeat(3, 1fr);
           gap: 20px;
           margin-top: 30px;
           max-width: 1000px;
           margin-left: auto;
           margin-right: auto;
         }

         .categories-grid .category:last-child {
           grid-column: 2;
         }

                 .category {
           position: relative;
           height: 180px;
           border-radius: 12px;
           overflow: hidden;
           cursor: pointer;
           transition: transform 0.3s ease;
           box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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
           bottom: 0;
           left: 0;
           right: 0;
           background: linear-gradient(transparent, rgba(0,0,0,0.85));
           color: white;
           padding: 20px 15px;
           font-weight: 600;
           text-align: center;
           font-size: 0.95rem;
           line-height: 1.2;
         }

        .featured-companies, .new-affiliates {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
          text-align: center;
        }

        .companies {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 30px;
          flex-wrap: wrap;
          margin-top: 20px;
        }

        .companies img {
          height: 50px;
          width: auto;
          object-fit: contain;
        }

                 @media (max-width: 768px) {
           .content_info h1 {
             font-size: 1.8rem;
           }

           .benefits-grid {
             flex-direction: column;
             align-items: center;
           }

           .benefit-card {
             width: 100%;
             max-width: 350px;
           }

           .categories-grid {
             grid-template-columns: 1fr;
             gap: 15px;
           }

           .category {
             height: 160px;
           }

           .overlay {
             padding: 15px 10px;
             font-size: 0.9rem;
           }

           .affiliates {
             gap: 15px;
           }

           .affiliates img {
             height: 40px;
           }
         }

         @media (min-width: 769px) and (max-width: 1024px) {
           .categories-grid {
             grid-template-columns: repeat(2, 1fr);
             gap: 18px;
           }
         }
      `}</style>

      <div className="container_info">
        <div className="content_info">
          <h1>BENEFICIOS DE AFILIACIÓN</h1>
        </div>
      </div>

      <div className="benefits-container">
        <div className="benefits-grid">
          {beneficios.map((beneficio, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-header">
                <h3>{beneficio.titulo}</h3>
              </div>
              <div className="benefit-content">
                <p>{beneficio.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <a href="/" className="button">Volver</a>
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
          <Image alt="smartworld" src="/img/smartword.png" width={100} height={60}/>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <button className="button">Ver Todos Los Afiliados</button>
        </div>



        <div className="featured-companies">
          <h1 className="Hero-Title--Big--secondary">Empresas destacadas</h1>
          <div className="companies">
            <img alt="ZIC" src="https://camarapetrolera.org/wp-content/uploads/2024/08/ZIC.svg"/>
            <img alt="Petrocor" src="https://camarapetrolera.org/wp-content/uploads/2024/08/Petrocor.svg"/>
            <img alt="argos" src="https://camarapetrolera.org/wp-content/uploads/2024/08/Argos.svg"/>
            <Image alt="smartworld" src="/img/smartword.png" width={80} height={50}/>
          </div>
        </div>

        <div className="new-affiliates">
          <h1 className="Hero-Title--Big--secondary">Nuevos Afiliados</h1>
          <div className="companies">
            <img alt="azex" src="https://camarapetrolera.org/wp-content/uploads/2024/08/Azex.jpg"/>
            <img alt="Temi" src="https://camarapetrolera.org/wp-content/uploads/2024/08/Temi.svg"/>
            <img alt="Barcan" src="https://camarapetrolera.org/wp-content/uploads/2024/08/Barcan.jpg"/>
            <Image alt="smartworld" src="/img/smartword.png" width={80} height={50}/>
          </div>
        </div>
      </div>
    </>
  );
}