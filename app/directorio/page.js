'use client';

import { useState, useEffect } from 'react';

export default function Directorio() {
  const [empresas, setEmpresas] = useState([]);
  const [capitulos, setCapitulos] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInicial, setLoadingInicial] = useState(true);
  const [filtros, setFiltros] = useState({
    region: '',
    sector: '',
    busqueda: ''
  });
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const empresasPorPagina = 8; // 2 filas de 4 empresas cada una

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        // Cargar todas las empresas
        const empresasRes = await fetch('/api/empresas');
        const empresasData = await empresasRes.json();
        
        // Verificar si es un array o si viene en una propiedad
        const empresasList = Array.isArray(empresasData) ? empresasData : (empresasData.empresas || []);
        setEmpresas(empresasList);
        
        console.log('Empresas cargadas:', empresasList.length);

        // Debug: mostrar una muestra de empresas
        console.log('Muestra de empresas:', empresasList.slice(0, 3));

        // Extraer capítulos únicos de las empresas (campo region)
        const capitulosUnicos = [...new Set(
          empresasList
            .map(empresa => empresa.region)
            .filter(region => region && region.trim() !== '')
        )].sort();
        
        console.log('Capítulos encontrados:', capitulosUnicos);
        setCapitulos(capitulosUnicos);

        // Extraer sectores únicos de las empresas
        const sectoresUnicos = [...new Set(
          empresasList
            .map(empresa => empresa.sector)
            .filter(sector => sector && sector.trim() !== '')
        )].sort();
        
        console.log('Sectores encontrados:', sectoresUnicos);
        setSectores(sectoresUnicos);

      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
      } finally {
        setLoadingInicial(false);
      }
    };

    cargarDatosIniciales();
  }, []);

  // Función para buscar empresas
  const buscarEmpresas = async () => {
    // Validar que al menos un filtro esté seleccionado, EXCEPTO si se quiere ver "Todos los capítulos"
    if (!filtros.region && !filtros.sector && !filtros.busqueda) {
      // Permitir mostrar todas las empresas si no hay filtros aplicados
      setErrorValidacion('');
      setLoading(true);
      setBusquedaRealizada(true);
      setPaginaActual(1);
      
      // Mostrar todas las empresas sin filtros
      setResultados(empresas);
      setLoading(false);
      return;
    }

    setErrorValidacion('');
    setLoading(true);
    setBusquedaRealizada(true);
    setPaginaActual(1);
    
    try {
      const params = new URLSearchParams();
      if (filtros.region) params.append('region', filtros.region);
      if (filtros.sector) params.append('sector', filtros.sector);
      if (filtros.busqueda) params.append('busqueda', filtros.busqueda);

      console.log('Filtros aplicados:', filtros);
      console.log('URL de búsqueda:', `/api/empresas/buscar?${params}`);

      const response = await fetch(`/api/empresas/buscar?${params}`);
      const result = await response.json();
      
      console.log('Resultado de la búsqueda:', result);
      
      if (result.success) {
        setResultados(result.empresas || []);
        console.log(`Se encontraron ${result.empresas?.length || 0} empresas`);
      } else {
        console.error('Error en la respuesta:', result.error);
        setResultados([]);
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      region: '',
      sector: '',
      busqueda: ''
    });
    setResultados([]);
    setBusquedaRealizada(false);
    setErrorValidacion('');
    setPaginaActual(1);
  };

  // Funciones de paginación
  const obtenerEmpresasPaginadas = (empresasList) => {
    const indiceInicio = (paginaActual - 1) * empresasPorPagina;
    const indiceFin = indiceInicio + empresasPorPagina;
    return empresasList.slice(indiceInicio, indiceFin);
  };

  const obtenerTotalPaginas = (totalEmpresas) => {
    return Math.ceil(totalEmpresas / empresasPorPagina);
  };

  const cambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
    // No hacer scroll al cambiar página, mantener posición actual
  };

  // Función para verificar si hay filtros aplicados
  const hayFiltrosAplicados = () => {
    return filtros.region || filtros.sector || filtros.busqueda;
  };

  // Función para organizar empresas por región y sector
  const organizarEmpresasPorRegionYSector = (empresasList) => {
    const organizadas = {};
    
    empresasList.forEach(empresa => {
      const region = empresa.region || 'Sin Región';
      const sector = empresa.sector || 'Sin Sector';
      
      if (!organizadas[region]) {
        organizadas[region] = {};
      }
      
      if (!organizadas[region][sector]) {
        organizadas[region][sector] = [];
      }
      
      organizadas[region][sector].push(empresa);
    });
    
    return organizadas;
  };

  return (
    <>
      <style jsx>{`
        /* Estilos para el directorio interactivo */
        .busqueda-directorio {
          background-color: rgba(255, 255, 255, 0.95);
          padding: 25px 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          margin-bottom: 30px;
          max-width: 1000px;
          margin: 0 auto;
          border: 1px solid rgba(0, 74, 135, 0.1);
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .busqueda-directorio h2 {
          color: #ff9900;
          margin-bottom: 15px;
          font-size: 26px;
          font-weight: 600;
        }

        /* Estilos para los filtros */
        .filtros-container {
          display: flex;
          flex-wrap: nowrap;
          gap: 15px;
          margin-bottom: 20px;
          justify-content: center;
          align-items: end;
        }

        @media (max-width: 768px) {
          .filtros-container {
            flex-wrap: wrap;
          }
        }

        .filtro-grupo {
          flex: 1;
          min-width: 180px;
          position: relative;
          text-align: left;
        }

        .filtro-grupo-boton {
          flex: 0 0 auto;
          min-width: 120px;
          position: relative;
          text-align: left;
        }

        @media (min-width: 769px) {
          .filtro-grupo {
            max-width: 25%;
          }
        }

        .filtro-grupo label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        .filtro-grupo select,
        .filtro-grupo input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 15px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .filtro-grupo select:focus,
        .filtro-grupo input:focus {
          border-color: #ff9900;
          box-shadow: 0 0 0 3px rgba(255, 153, 0, 0.1);
          outline: none;
        }

        /* Estilos para los botones */
        .botones-container {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 0px;
          align-items: center;
          flex-direction: column;
        }

        .btn-buscar {
          background-color: #ff9900;
          color: white;
          box-shadow: 0 4px 6px rgba(255, 153, 0, 0.2);
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 14px;
          white-space: nowrap;
          width: 100%;
        }

        .btn-buscar:hover {
          background-color: #e68900;
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(255, 153, 0, 0.3);
        }

        .btn-limpiar {
          background-color: #6c757d;
          color: white;
          box-shadow: 0 4px 6px rgba(108, 117, 125, 0.2);
          padding: 12px 10px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 14px;
          white-space: nowrap;
          width: 100%;
        }

        .btn-limpiar:hover {
          background-color: #5a6268;
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(108, 117, 125, 0.3);
        }

        /* Mensaje de error de validación */
        .error-validacion {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
          padding: 10px 15px;
          border-radius: 5px;
          margin-top: 10px;
          text-align: center;
          font-weight: 500;
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Estilos para la sección de resultados */
        .resultados-directorio {
          background-color: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          margin-bottom: 40px;
          border: 1px solid #f0f0f0;
        }

        /* Estilos para los mensajes informativos */
        .directorio-instrucciones,
        .directorio-sin-resultados {
          padding: 25px;
          text-align: center;
          color: #666;
          font-style: italic;
          background-color: #f9f9f9;
          border-radius: 10px;
          margin: 20px 0;
          border-left: 4px solid #ff9900;
        }

        .info-resultados {
          margin-bottom: 30px;
          padding: 15px 20px;
          background-color: #ff9900;
          color: white;
          border-radius: 8px;
          font-weight: 500;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          letter-spacing: 0.5px;
        }

        .directorio-info-post-busqueda {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          text-align: center;
          border-left: 4px solid #ff9900;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .directorio-info-post-busqueda h4 {
          color: #2c3e50;
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .directorio-info-post-busqueda p {
          color: #666;
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .directorio-info-post-busqueda p:last-child {
          margin-bottom: 0;
          font-weight: 600;
          color: #333;
        }

        /* Estilos para los resultados */
        #resultados {
          margin-top: 100px;
          padding: 30px;
          position: relative;
          z-index: 5;
        }

        .resultados-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .resultados-info {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          font-size: 16px;
          color: #333;
          margin-bottom: 20px;
          text-align: center;
          border-left: 4px solid #ff9900;
        }

        .box_resultados {
          margin-bottom: 20px;
        }

        .container-directorio {
          margin-top: 50px;
          margin-bottom: 50px;
          position: relative;
          z-index: 5;
        }

        /* Estilos para los encabezados de región y sector */
        .region-header {
          background-color: #ff9900;
          color: white;
          padding: 15px 20px;
          margin-top: 35px;
          margin-bottom: 20px;
          border-radius: 8px;
          font-size: 20px;
          font-weight: bold;
          position: relative;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .region-header:after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid #ff9900;
        }

        .sector-header {
          background-color: #f0f0f0;
          color: #333;
          padding: 12px 20px;
          margin-top: 25px;
          margin-bottom: 15px;
          border-radius: 8px;
          font-size: 18px;
          font-weight: bold;
          border-left: 5px solid #ff9900;
          text-align: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          position: relative;
        }

        /* Indicador de carga */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
          margin: 20px auto;
          max-width: 300px;
        }

        .loading-spinner {
          border: 5px solid #f3f3f3;
          border-top: 5px solid #ff9900;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Grid de tarjetas */
        .tarjetas-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        @media (max-width: 1200px) {
          .tarjetas-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .tarjetas-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
        }

        @media (max-width: 480px) {
          .tarjetas-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Estilos para las tarjetas de resultados */
        .tarjeta {
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .tarjeta:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 20px rgba(0,0,0,0.15);
          border-color: #e0e0e0;
        }

        .logo_tarjeta {
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: white;
          padding: 8px;
          border-bottom: 1px solid #f0f0f0;
          background: linear-gradient(145deg, #ffffff, #f9f9f9);
          overflow: hidden;
        }

        .logo_tarjeta img {
          max-width: 98%;
          max-height: 98%;
          width: auto;
          height: auto;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .tarjeta:hover .logo_tarjeta img {
          transform: scale(1.05);
        }

        .infoTarjeta {
          padding: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex-grow: 1;
        }

        .datosTarjeta {
          list-style: none;
          padding: 0;
          margin: 0 0 10px 0;
        }

        .datosTarjeta li {
          margin-bottom: 8px;
          font-size: 14px;
          line-height: 1.4;
          color: #333;
          font-weight: 500;
        }

        .datosTarjeta li:last-child {
          margin-bottom: 0;
        }

        .datosTarjeta li span {
          font-weight: bold;
          color: #ff9900;
          display: block;
          font-size: 12px;
          margin-bottom: 2px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn_enlace {
          margin-top: auto;
        }

        .btn_tarjeta {
          display: block;
          background-color: #ff9900;
          color: white;
          padding: 10px 14px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 700;
          transition: background-color 0.3s;
          text-align: center;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 2px 4px rgba(255, 153, 0, 0.3);
        }

        .btn_tarjeta:hover {
          background-color: #d15500;
          color: white;
        }

        /* Paginación */
        .paginacion {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 30px;
          padding: 20px 0;
        }

        .btn-pagina {
          padding: 8px 12px;
          border: 1px solid #ddd;
          background: white;
          color: #333;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          min-width: 40px;
        }

        .btn-pagina:hover:not(:disabled) {
          background-color: #f8f9fa;
          border-color: #ff9900;
        }

        .btn-pagina.activa {
          background-color: #ff9900;
          color: white;
          border-color: #ff9900;
        }

        .btn-pagina:disabled {
          background-color: #f8f9fa;
          color: #ccc;
          cursor: not-allowed;
        }

        .info-paginacion {
          margin: 0 15px;
          color: #666;
          font-size: 14px;
        }

        /* Hero Section */
        .hero {
          background-image: url('/img/Directorio.png');
          background-size: cover;
          background-position: center;
          height: 700px;
          margin-bottom: -150px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .hero-content-search {
          text-align: center;
          z-index: 2;
          padding: 40px;
          border-radius: 15px;
          max-width: 1000px;
          width: 90%;
        }

        .hero-title-big {
          font-size: 3rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 30px;
          text-transform: uppercase;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }

        .hero-title-big-secondary {
          font-size: 2.5rem;
          font-weight: 700;
          color: #004a87;
          margin-bottom: 30px;
          text-align: center;
        }

        /* Estilos responsive */
        @media (max-width: 768px) {
          .filtros-container {
            flex-direction: column;
          }

          .filtro-grupo {
            min-width: 100%;
          }

          .botones-container {
            flex-direction: column;
          }
          
          .tarjeta {
            flex-direction: column;
          }
          
          .logo_tarjeta {
            width: 100%;
          }
          
          .btn_enlace {
            text-align: center;
          }

          .hero-title-big {
            font-size: 2rem;
          }

          .hero-content-search {
            padding: 20px;
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .busqueda-directorio input[type="text"] {
            width: 100%;
            margin-right: 0;
            margin-bottom: 10px;
          }
          
          .busqueda-directorio button {
            width: 100%;
          }
          
          .tarjeta {
            flex-direction: column;
          }
          
          .logo_tarjeta {
            width: 100%;
            padding: 20px;
          }
          
          .btn_enlace {
            text-align: center;
          }
        }
      `}</style>

      {/* Hero Section con formulario de búsqueda */}
      <div className="hero">
        <div className="hero-content-search">
          <h1 className="hero-title-big">Directorio Interactivo</h1>
          <div className="busqueda-directorio">
            <div className="filtros-container">
              <div className="filtro-grupo">
                <label htmlFor="region">Capítulo:</label>
                <select 
                  id="region" 
                  value={filtros.region}
                  onChange={(e) => setFiltros({...filtros, region: e.target.value})}
                >
                  <option value="">Todos los capítulos</option>
                  {capitulos.map((capitulo, index) => (
                    <option key={index} value={capitulo}>{capitulo}</option>
                  ))}
                </select>
              </div>
              
              <div className="filtro-grupo">
                <label htmlFor="sector">Sector:</label>
                <select 
                  id="sector"
                  value={filtros.sector}
                  onChange={(e) => setFiltros({...filtros, sector: e.target.value})}
                >
                  <option value="">Todos los sectores</option>
                  {sectores.map((sector, index) => (
                    <option key={index} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
              
              <div className="filtro-grupo">
                <label htmlFor="busqueda">Empresa:</label>
                <input 
                  type="text" 
                  id="busqueda" 
                  placeholder="Nombre de la empresa"
                  value={filtros.busqueda}
                  onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                />
              </div>
              
              <div className="filtro-grupo-boton">
                <label>&nbsp;</label>
                <button type="button" className="btn-buscar" onClick={buscarEmpresas}>
                  Buscar
                </button>
              </div>
              
              <div className="filtro-grupo-boton">
                <label>&nbsp;</label>
                <button type="button" className="btn-limpiar" onClick={limpiarFiltros}>
                  Limpiar filtros
                </button>
              </div>
            </div>
            
            {/* Mensaje de error de validación */}
            {errorValidacion && (
              <div className="error-validacion">
                {errorValidacion}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="container-directorio">
        {/* Resultados */}
        <div id="resultados">
          {(loading || loadingInicial) && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{loadingInicial ? 'Cargando directorio...' : 'Buscando empresas...'}</p>
            </div>
          )}
          
          {/* Mensaje inicial - sin instrucciones */}
          {!loading && !loadingInicial && !busquedaRealizada && (
            <div className="directorio-instrucciones">
              <h3>Bienvenido al Directorio de Empresas</h3>
              <p>Utiliza los filtros de búsqueda para encontrar empresas específicas.</p>
              <p><strong>Haz clic en "Buscar" sin filtros para ver todas las empresas, o selecciona filtros específicos.</strong></p>
            </div>
          )}

          {/* Resultados de búsqueda */}
          {!loading && !loadingInicial && busquedaRealizada && resultados.length > 0 && (() => {
            const empresasPaginadas = obtenerEmpresasPaginadas(resultados);
            const totalPaginas = obtenerTotalPaginas(resultados.length);
            
            return (
              <div className="resultados-directorio">
                <div className="info-resultados">
                  Se encontraron {resultados.length} empresa{resultados.length !== 1 ? 's' : ''}
                  {totalPaginas > 1 && (
                    <span> - Página {paginaActual} de {totalPaginas}</span>
                  )}
                </div>
                
                {/* Información del directorio después de búsqueda */}
                <div className="directorio-info-post-busqueda">
                  <h4>Explora nuestro directorio de empresas</h4>
                  <p>Utiliza los filtros de búsqueda para encontrar empresas por capítulo, sector o nombre específico.</p>
                </div>

                {/* Grid de tarjetas */}
                <div className="tarjetas-grid">
                  {empresasPaginadas.map(empresa => (
                    <div key={empresa._id} className="tarjeta">
                      <div className="logo_tarjeta">
                        {empresa.logo ? (
                          <img 
                            src={empresa.logo} 
                            alt={`Logo de ${empresa.nombre}`}
                          />
                        ) : (
                          <div style={{
                            width: '100px',
                            height: '70px',
                            background: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999',
                            fontSize: '12px',
                            borderRadius: '8px',
                            border: '2px dashed #ddd'
                          }}>
                            Sin logo
                          </div>
                        )}
                      </div>
                      
                      <div className="infoTarjeta">
                        <ul className="datosTarjeta">
                          <li>
                            <span>Empresa:</span> 
                            {empresa.nombre}
                          </li>
                          <li>
                            <span>Capítulo:</span> 
                            {empresa.region || 'Venezuela'}
                          </li>
                          <li>
                            <span>Sector:</span> 
                            {empresa.sector || 'Sin especificar'}
                          </li>
                          {empresa.email && (
                            <li>
                              <span>Correo:</span> 
                              {empresa.email}
                            </li>
                          )}
                        </ul>
                        
                        <div className="btn_enlace">
                          <a href={`/empresas/${empresa._id}`} className="btn_tarjeta">
                            Ver más
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginación */}
                {totalPaginas > 1 && (
                  <div className="paginacion">
                    <button 
                      className="btn-pagina" 
                      onClick={() => cambiarPagina(paginaActual - 1)}
                      disabled={paginaActual === 1}
                    >
                      ←
                    </button>
                    
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
                      <button
                        key={pagina}
                        className={`btn-pagina ${paginaActual === pagina ? 'activa' : ''}`}
                        onClick={() => cambiarPagina(pagina)}
                      >
                        {pagina}
                      </button>
                    ))}
                    
                    <button 
                      className="btn-pagina" 
                      onClick={() => cambiarPagina(paginaActual + 1)}
                      disabled={paginaActual === totalPaginas}
                    >
                      →
                    </button>
                    
                    <div className="info-paginacion">
                      Mostrando {((paginaActual - 1) * empresasPorPagina) + 1}-{Math.min(paginaActual * empresasPorPagina, resultados.length)} de {resultados.length}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Sin resultados */}
          {!loading && !loadingInicial && busquedaRealizada && resultados.length === 0 && (
            <div className="directorio-sin-resultados">
              <h3>No se encontraron resultados</h3>
              <p>Intenta modificar los criterios de búsqueda o limpia los filtros para ver todas las empresas.</p>
          </div>
          )}
        </div>
      </div>
    </>
  );
} 