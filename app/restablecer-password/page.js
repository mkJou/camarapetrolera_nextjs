'use client'

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RestablecerContraseña() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      validateToken(tokenParam);
    } else {
      setValidatingToken(false);
      setMensaje('Token de recuperación no válido');
      setTipoMensaje('error');
    }
  }, [searchParams]);

  const validateToken = async (tokenToValidate) => {
    try {
      const response = await fetch('/api/auth/validate-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: tokenToValidate }),
      });

      const data = await response.json();

      if (response.ok) {
        setTokenValid(true);
      } else {
        setMensaje(data.message || 'Token inválido o expirado');
        setTipoMensaje('error');
      }
    } catch (error) {
      console.error('Error validando token:', error);
      setMensaje('Error validando el token');
      setTipoMensaje('error');
    } finally {
      setValidatingToken(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setMensaje('Por favor completa todos los campos');
      setTipoMensaje('error');
      return;
    }

    if (password !== confirmPassword) {
      setMensaje('Las contraseñas no coinciden');
      setTipoMensaje('error');
      return;
    }

    if (password.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres');
      setTipoMensaje('error');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('Contraseña restablecida exitosamente. Redirigiendo al login...');
        setTipoMensaje('success');
        
        setTimeout(() => {
          router.push('/acceder');
        }, 3000);
      } else {
        setMensaje(data.message || 'Error al restablecer la contraseña');
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

  if (validatingToken) {
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
          .loading-card {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #ff9900;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div className="container">
          <div className="loading-card">
            <div className="spinner"></div>
            <p>Validando token de recuperación...</p>
          </div>
        </div>
      </>
    );
  }

  if (!tokenValid) {
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
          .error-card {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 450px;
          }
          .error-icon {
            font-size: 48px;
            color: #dc3545;
            margin-bottom: 20px;
          }
          .back-link {
            margin-top: 20px;
          }
          .back-link a {
            color: #ff9900;
            text-decoration: none;
            font-weight: 600;
          }
          .back-link a:hover {
            text-decoration: underline;
          }
        `}</style>
        <div className="container">
          <div className="error-card">
            <div className="error-icon">⚠️</div>
            <h2>Token Inválido</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              {mensaje || 'El enlace de recuperación no es válido o ha expirado.'}
            </p>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Solicita un nuevo enlace de recuperación de contraseña.
            </p>
            <div className="back-link">
              <Link href="/recuperar-password">
                Solicitar nuevo enlace
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

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

        .password-requirements {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          padding: 12px;
          margin-top: 8px;
          font-size: 12px;
          color: #6c757d;
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
            <h1>Nueva Contraseña</h1>
          </div>

          <div className="subtitle">
            Ingresa tu nueva contraseña a continuación
          </div>

          {mensaje && (
            <div className={`mensaje ${tipoMensaje}`}>
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">Nueva Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                disabled={loading}
                required
              />
              <div className="password-requirements">
                La contraseña debe tener al menos 6 caracteres
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="loading">
                  <span className="spinner"></span>
                  Actualizando...
                </span>
              ) : (
                'Actualizar Contraseña'
              )}
            </button>
          </form>

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
