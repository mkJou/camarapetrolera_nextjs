'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AccederPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error cuando usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Login exitoso - guardar datos en localStorage y redirigir
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        localStorage.setItem('auth-token', data.token);
        
        // Redirigir al dashboard
        router.push('/dashboard');
      } else {
        // Mostrar error
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
                 .acceder-container {
           min-height: 100vh;
           background: url('/img/petroleorefineria.jpg') center/cover;
           position: relative;
           display: flex;
           align-items: center;
           justify-content: center;
           padding: 20px;
         }

         .acceder-container::before {
           content: '';
           position: absolute;
           top: 0;
           left: 0;
           right: 0;
           bottom: 0;
           background: rgba(0, 0, 0, 0.4);
         }

                 .acceder-wrapper {
           background: white;
           border-radius: 20px;
           box-shadow: 0 20px 60px rgba(0,0,0,0.3);
           overflow: hidden;
           max-width: 900px;
           width: 100%;
           display: grid;
           grid-template-columns: 1fr 1fr;
           min-height: 600px;
           position: relative;
           z-index: 2;
         }

        .form-section {
          padding: 50px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .brand-section {
          background: linear-gradient(135deg, #ff9900 0%, #e68900 100%);
          color: white;
          padding: 50px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

                 .brand-section::before {
           content: '';
           position: absolute;
           top: 0;
           left: 0;
           right: 0;
           bottom: 0;
           background: url('/img/IndustriaPetrolera.png') center/cover;
           opacity: 0.15;
         }

        .brand-content {
          position: relative;
          z-index: 2;
        }

        .logo {
          width: 80px;
          height: auto;
          margin-bottom: 30px;
          background: white;
          border-radius: 10px;
          padding: 10px;
        }

        .brand-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .brand-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .form-title {
          font-size: 2rem;
          color: #333;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .form-subtitle {
          color: #666;
          margin-bottom: 30px;
        }

        

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: 15px;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          font-size: 16px;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #ff9900;
        }

        

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #ff9900 0%, #e68900 100%);
          color: white;
          border: none;
          padding: 15px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin-top: 10px;
        }

                 .submit-btn:hover:not(:disabled) {
           transform: translateY(-2px);
           box-shadow: 0 8px 20px rgba(230, 126, 34, 0.3);
         }

         .submit-btn:disabled {
           background: #ccc;
           cursor: not-allowed;
           transform: none;
         }

         .error-message {
           background: #fee;
           color: #c33;
           padding: 12px;
           border-radius: 8px;
           margin-bottom: 20px;
           border: 1px solid #fcc;
           font-size: 14px;
         }

        .forgot-password {
          text-align: center;
          margin-top: 20px;
        }

        .forgot-password a {
          color: #ff9900;
          text-decoration: none;
          font-weight: 500;
        }

        .forgot-password a:hover {
          text-decoration: underline;
        }

        .benefits-list {
          margin-top: 30px;
          text-align: left;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          font-size: 0.95rem;
        }

        .benefit-item::before {
          content: '✓';
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .acceder-wrapper {
            grid-template-columns: 1fr;
            max-width: 400px;
          }

          .brand-section {
            order: -1;
            padding: 30px 20px;
          }

                     .form-section {
             padding: 30px 20px;
           }

          .brand-title {
            font-size: 1.5rem;
          }

          .form-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="acceder-container">
        <div className="acceder-wrapper">
                   <div className="form-section">
           <h1 className="form-title">Bienvenido</h1>
           <p className="form-subtitle">
             Accede a tu cuenta para continuar
           </p>

                         <form onSubmit={handleSubmit}>
               {error && (
                 <div className="error-message">
                   {error}
                 </div>
               )}
               
               <div className="form-group">
                 <label className="form-label">Correo Electrónico</label>
                 <input
                   type="email"
                   name="email"
                   className="form-input"
                   placeholder="tu@email.com"
                   value={formData.email}
                   onChange={handleInputChange}
                   required
                 />
               </div>

               <div className="form-group">
                 <label className="form-label">Contraseña</label>
                 <input
                   type="password"
                   name="password"
                   className="form-input"
                   placeholder="Tu contraseña"
                   value={formData.password}
                   onChange={handleInputChange}
                   required
                 />
               </div>

               <button type="submit" className="submit-btn" disabled={loading}>
                 {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
               </button>
             </form>

             <div className="forgot-password">
               <a href="#forgot">¿Olvidaste tu contraseña?</a>
             </div>
          </div>

          <div className="brand-section">
            <div className="brand-content">
              <h2 className="brand-title">
                Cámara Petrolera de Venezuela
              </h2>
              <p className="brand-subtitle">
                Tu puerta de entrada al sector energético más importante del país
              </p>

              <div className="benefits-list">
                <div className="benefit-item">
                  Acceso exclusivo al directorio de empresas
                </div>
                <div className="benefit-item">
                  Noticias y actualizaciones del sector
                </div>
                <div className="benefit-item">
                  Oportunidades de networking
                </div>
                <div className="benefit-item">
                  Eventos y capacitaciones especializadas
                </div>
                <div className="benefit-item">
                  Representación institucional
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}