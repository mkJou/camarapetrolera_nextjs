'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function DetalleEvento() {
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const cargarEvento = async () => {
      try {
        const response = await fetch(`/api/eventos/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setEvento(data.evento);
        } else if (response.status === 404) {
          setError('Evento no encontrado');
        } else {
          setError('Error al cargar el evento');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      cargarEvento();
    }
  }, [params.id]);

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatearFechaCompleta = (fecha) => {
    if (!fecha) return '';
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const esEventoPasado = (fecha) => {
    if (!fecha) return false;
    const fechaEvento = new Date(fecha);
    const hoy = new Date();
    return fechaEvento < hoy;
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
            border-top: 5px solid #004a87;
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
          <p className="loading-text">Cargando evento...</p>
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
            background-color: #004a87;
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
            background-color: #003a6d;
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 74, 135, 0.3);
          }
        `}</style>
        
        <div className="error-container">
          <div className="error-icon">📅</div>
          <h1 className="error-title">Evento no encontrado</h1>
          <p className="error-message">{error}</p>
          <button className="btn-volver" onClick={() => router.back()}>
            Volver
          </button>
        </div>
      </>
    );
  }

  if (!evento) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        .evento-detail-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .evento-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          overflow: hidden;
          margin-bottom: 30px;
        }

        .evento-header {
          position: relative;
          height: 450px;
          background: linear-gradient(135deg, #004a87 0%, #0066b3 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .evento-imagen {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .evento-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.4) 0%,
            rgba(0,0,0,0.8) 100%
          );
        }

        .evento-header-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: white;
          padding: 40px;
          max-width: 800px;
        }

        .evento-status {
          display: inline-block;
          padding: 8px 20px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .status-upcoming {
          background: rgba(40, 167, 69, 0.9);
          color: white;
        }

        .status-past {
          background: rgba(108, 117, 125, 0.9);
          color: white;
        }

        .status-cancelled {
          background: rgba(220, 53, 69, 0.9);
          color: white;
        }

        .evento-title {
          font-size: 2.8rem;
          font-weight: 700;
          margin: 0 0 20px 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          line-height: 1.2;
        }

        .evento-meta {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          font-size: 1.1rem;
          opacity: 0.95;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.15);
          padding: 12px 20px;
          border-radius: 25px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .evento-content {
          padding: 40px;
        }

        .evento-descripcion {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #495057;
          margin-bottom: 40px;
          text-align: justify;
          background: #f8f9fa;
          padding: 25px;
          border-radius: 15px;
          border-left: 5px solid #004a87;
        }

        .evento-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }

        .detail-section {
          background: white;
          padding: 25px;
          border-radius: 15px;
          border: 2px solid #e9ecef;
          transition: border-color 0.3s ease;
        }

        .detail-section:hover {
          border-color: #004a87;
        }

        .detail-section h3 {
          color: #004a87;
          margin: 0 0 20px 0;
          font-size: 1.3rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .detail-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 15px;
          padding: 10px 0;
          border-bottom: 1px dashed #dee2e6;
        }

        .detail-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .detail-label {
          font-weight: 600;
          color: #495057;
          min-width: 120px;
          margin-right: 15px;
        }

        .detail-value {
          color: #333;
          flex: 1;
          word-break: break-word;
        }

        .highlight-value {
          color: #004a87;
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
          padding: 30px;
          background: #f8f9fa;
          border-radius: 15px;
          margin-bottom: 20px;
        }

        .btn {
          padding: 14px 28px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary {
          background-color: #004a87;
          color: white;
        }

        .btn-primary:hover {
          background-color: #003a6d;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 74, 135, 0.3);
        }

        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background-color: #5a6268;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(108, 117, 125, 0.3);
        }

        .btn-success {
          background-color: #28a745;
          color: white;
        }

        .btn-success:hover {
          background-color: #218838;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(40, 167, 69, 0.3);
        }

        .btn-outline {
          background-color: transparent;
          color: #004a87;
          border: 2px solid #004a87;
        }

        .btn-outline:hover {
          background-color: #004a87;
          color: white;
          transform: translateY(-2px);
        }

        .share-section {
          background: white;
          padding: 25px;
          border-radius: 15px;
          margin-bottom: 20px;
          text-align: center;
          border: 2px solid #e9ecef;
        }

        .share-title {
          color: #495057;
          margin-bottom: 15px;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .share-buttons {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .share-btn {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          transition: transform 0.3s ease;
          font-size: 20px;
        }

        .share-btn:hover {
          transform: scale(1.1);
        }

        .share-facebook {
          background-color: #1877f2;
        }

        .share-twitter {
          background-color: #1da1f2;
        }

        .share-whatsapp {
          background-color: #25d366;
        }

        .share-linkedin {
          background-color: #0077b5;
        }

        .calendar-section {
          background: linear-gradient(135deg, #004a87 0%, #0066b3 100%);
          color: white;
          padding: 25px;
          border-radius: 15px;
          text-align: center;
          margin-bottom: 20px;
        }

        .calendar-title {
          margin: 0 0 15px 0;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .add-calendar-btn {
          background: rgba(255,255,255,0.2);
          color: white;
          border: 2px solid rgba(255,255,255,0.3);
          padding: 12px 25px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .add-calendar-btn:hover {
          background: rgba(255,255,255,0.3);
          border-color: rgba(255,255,255,0.5);
          transform: translateY(-2px);
        }

        .cancelled-alert {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
          padding: 25px;
          border-radius: 15px;
          text-align: center;
          margin-bottom: 20px;
          border: 2px solid #b21e2f;
        }

        .cancelled-title {
          margin: 0 0 15px 0;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .cancelled-message {
          margin: 0;
          font-size: 1rem;
          line-height: 1.6;
          opacity: 0.95;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .evento-detail-container {
            padding: 20px 15px;
          }

          .evento-header {
            height: 350px;
          }

          .evento-header-content {
            padding: 20px;
          }

          .evento-title {
            font-size: 2rem;
          }

          .evento-meta {
            flex-direction: column;
            gap: 10px;
          }

          .evento-content {
            padding: 25px 20px;
          }

          .evento-details {
            grid-template-columns: 1fr;
            gap: 20px;
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

          .detail-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .detail-label {
            margin-bottom: 5px;
            margin-right: 0;
          }
        }
      `}</style>

      <div className="evento-detail-container">
        <div className="evento-card">
          {/* Header con imagen y título */}
          <div className="evento-header">
            {evento.imagen && (
              <div 
                className="evento-imagen"
                style={{
                  backgroundImage: `url(${evento.imagen})`
                }}
              />
            )}
            <div className="evento-overlay"></div>
            <div className="evento-header-content">
              <div className={`evento-status ${
                evento.cancelado ? 'status-cancelled' : 
                esEventoPasado(evento.fechaEvento) ? 'status-past' : 'status-upcoming'
              }`}>
                {evento.cancelado ? '❌ Evento Cancelado' :
                 esEventoPasado(evento.fechaEvento) ? '✓ Evento Finalizado' : '🎯 Próximo Evento'}
              </div>
              <h1 className="evento-title">{evento.titulo}</h1>
              <div className="evento-meta">
                <div className="meta-item">
                  📅 {formatearFechaCompleta(evento.fechaEvento)}
                </div>
                <div className="meta-item">
                  🕐 {evento.horaEvento}
                </div>
                <div className="meta-item">
                  📍 {evento.estado || 'Venezuela'}
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="evento-content">
            {/* Descripción */}
            <div className="evento-descripcion">
              <strong>📋 Descripción del Evento:</strong><br />
              {evento.descripcion}
            </div>

            {/* Detalles del evento */}
            <div className="evento-details">
              <div className="detail-section">
                <h3>📅 Información de Fecha y Hora</h3>
                <div className="detail-item">
                  <span className="detail-label">Fecha:</span>
                  <span className="detail-value highlight-value">{formatearFechaCompleta(evento.fechaEvento)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Hora:</span>
                  <span className="detail-value highlight-value">{evento.horaEvento}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Estado:</span>
                  <span className="detail-value">
                    {evento.cancelado ? 
                      <span style={{color: '#dc3545'}}>❌ Cancelado</span> :
                      esEventoPasado(evento.fechaEvento) ? 
                        <span style={{color: '#6c757d'}}>✓ Finalizado</span> : 
                        <span style={{color: '#28a745'}}>🎯 Próximamente</span>
                    }
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h3>🏢 Información del Organizador</h3>
                <div className="detail-item">
                  <span className="detail-label">Organizador:</span>
                  <span className="detail-value">{evento.organizador || 'Cámara Petrolera'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Capítulo:</span>
                  <span className="detail-value">{evento.estado || 'Venezuela'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Creado:</span>
                  <span className="detail-value">{formatearFecha(evento.fechaCreacion)}</span>
                </div>
                {evento.fechaModificacion && (
                  <div className="detail-item">
                    <span className="detail-label">Actualizado:</span>
                    <span className="detail-value">{formatearFecha(evento.fechaModificacion)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Alerta para eventos cancelados */}
            {evento.cancelado && (
              <div className="cancelled-alert">
                <h3 className="cancelled-title">⚠️ Evento Cancelado</h3>
                <p className="cancelled-message">
                  Este evento ha sido cancelado. Si ya te habías registrado o tenías planeado asistir, 
                  te recomendamos contactar directamente al organizador para más información.
                </p>
              </div>
            )}

            {/* Agregar al calendario */}
            {!esEventoPasado(evento.fechaEvento) && !evento.cancelado && (
              <div className="calendar-section">
                <h3 className="calendar-title">📅 Agregar a mi Calendario</h3>
                <a 
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evento.titulo)}&dates=${new Date(evento.fechaEvento).toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${new Date(new Date(evento.fechaEvento).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(evento.descripcion)}&location=${encodeURIComponent(evento.estado || 'Venezuela')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="add-calendar-btn"
                >
                  📅 Agregar a Google Calendar
                </a>
              </div>
            )}

            {/* Compartir */}
            <div className="share-section">
              <h3 className="share-title">Compartir este evento</h3>
              <div className="share-buttons">
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn share-facebook"
                >
                  📘
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(evento.titulo)}&url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn share-twitter"
                >
                  🐦
                </a>
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(evento.titulo + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn share-whatsapp"
                >
                  💬
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn share-linkedin"
                >
                  💼
                </a>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="action-buttons">
              <button 
                className="btn btn-secondary" 
                onClick={() => router.back()}
              >
                ← Volver
              </button>
              <button 
                className="btn btn-outline" 
                onClick={() => window.print()}
              >
                🖨️ Imprimir
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                ⬆️ Ir al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 