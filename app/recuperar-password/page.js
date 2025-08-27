'use client'

import { useState } from 'react';
import Link from 'next/link';

export default function RecuperarContraseña() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState(''); // 'success' o 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMensaje('Por favor ingresa tu correo electrónico');
      setTipoMensaje('error');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('Se ha enviado un enlace de recuperación a tu correo electrónico');
        setTipoMensaje('success');
        setEmail('');
      } else {
        setMensaje(data.message || 'Error al enviar el correo de recuperación');
        setTipoMensaje('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error de conexión. Inténtalo nuevamente');
      setTipoMensaje('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .card {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 450px;
        }

        .logo {
          text-align: center;
          margin-bottom: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logo img {
          width: 120px;
          height: auto;
          display: block;
          margin: 0 auto;
        }

        .title {
          text-align: center;
          margin-bottom: 10px;
        }

        .title h1 {
          font-size: 28px;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        .subtitle {
          text-align: center;
          color: #666;
          font-size: 16px;
          margin-bottom: 30px;
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-weight: 600;
          font-size: 14px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: #ff9900;
        }

        .submit-btn {
          width: 100%;
          background: #ff9900;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-bottom: 20px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #e68900;
        }

        .submit-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .loading {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .mensaje {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          text-align: center;
        }

        .mensaje.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .mensaje.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .back-link {
          text-align: center;
        }

        .back-link a {
          color: #ff9900;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .back-link a:hover {
          color: #e68900;
          text-decoration: underline;
        }

        .info-box {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .info-box h3 {
          margin: 0 0 8px 0;
          color: #495057;
          font-size: 16px;
        }

        .info-box p {
          margin: 0;
          color: #6c757d;
          font-size: 14px;
          line-height: 1.4;
        }

        @media (max-width: 480px) {
          .card {
            padding: 30px 20px;
          }
          
          .title h1 {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="container">
        <div className="card">
          <div className="logo">
            <img src="/img/CAMPET-OG_Logo.jpg" alt="Cámara Petrolera de Venezuela" />
          </div>

          <div className="title">
            <h1>Recuperar Contraseña</h1>
          </div>

          <div className="subtitle">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
          </div>

          {mensaje && (
            <div className={`mensaje ${tipoMensaje}`}>
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="loading">
                  <span className="spinner"></span>
                  Enviando...
                </span>
              ) : (
                'Enviar Enlace de Recuperación'
              )}
            </button>
          </form>

          <div className="info-box">
            <h3>¿No recibes el correo?</h3>
            <p>
              Revisa tu carpeta de spam o correo no deseado. Si aún no lo encuentras, 
              contacta al administrador del sistema.
            </p>
          </div>

          <div className="back-link">
            <Link href="/acceder">
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
