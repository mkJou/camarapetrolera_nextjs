'use client'

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <>
      <style jsx>{`
        .header {
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }

        .logo {
          height: 35px;
          width: auto;
          object-fit: contain;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 30px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-item {
          position: relative;
        }

        .nav-link {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          padding: 10px 15px;
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .nav-link:hover {
          color: #ff9900;
        }

        .nav-link.active {
          color: #ff9900;
        }

        .dropdown {
          position: relative;
        }

        .dropdown-toggle {
          cursor: pointer;
          position: relative;
        }

        .dropdown-toggle i {
          transition: transform 0.3s ease;
          margin-left: 5px;
          font-size: 12px;
        }

        .dropdown:hover .dropdown-toggle i {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 5px);
          left: 50%;
          transform: translateX(-50%) translateY(-10px);
          background: white;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          border-radius: 8px;
          min-width: 220px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.1);
          overflow: hidden;
          z-index: 1001;
        }

        .dropdown:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }

        .dropdown-menu::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 6px solid white;
        }

        .dropdown-menu .dropdown-item {
          display: block !important;
          padding: 14px 20px !important;
          color: #333 !important;
          text-decoration: none !important;
          transition: all 0.2s ease !important;
          font-weight: 500 !important;
          border-bottom: 1px solid #f5f5f5 !important;
          position: relative !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        .dropdown-menu .dropdown-item:last-child {
          border-bottom: none !important;
        }

        .dropdown-menu .dropdown-item:hover {
          background: linear-gradient(90deg, #ff9900, #e68900) !important;
          color: white !important;
          padding-left: 25px !important;
        }

        .dropdown-menu .dropdown-item:hover::before {
          content: '▶' !important;
          position: absolute !important;
          left: 8px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          font-size: 10px !important;
          color: white !important;
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .dropdown-menu {
            left: 0;
            transform: translateY(-10px);
            min-width: 180px;
          }

          .dropdown:hover .dropdown-menu {
            transform: translateY(0);
          }

          .dropdown-menu::before {
            left: 30px;
            transform: none;
          }
        }

        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }

          .mobile-menu-toggle {
            display: block;
          }

          .header-container {
            padding: 0 15px;
            height: 70px;
          }

          .logo {
            height: 30px;
          }
        }
      `}</style>

      <header className="header">
        <div className="header-container">
          <div className="logo-container">
            <Image 
              src="/img/CAMPET-OG_Logo.jpg" 
              alt="Cámara Petrolera de Venezuela" 
              className="logo"
              width={60}
              height={25}
              priority
            />
          </div>

          <nav>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link href="/" className="nav-link">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link href="/lacamara" className="nav-link">La Cámara</Link>
              </li>
              <li className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle">
                  Capítulos Regionales<i className="fas fa-chevron-down"></i>
                </a>
                <div className="dropdown-menu">
                  <a href="/capitulo-anzoategui" className="dropdown-item">Anzoátegui</a>
                  <a href="/capitulo-carabobo" className="dropdown-item">Carabobo</a>
                  <a href="/capitulo-falcon" className="dropdown-item">Falcón</a>
                  <a href="/capitulo-monagas" className="dropdown-item">Monagas</a>
                  <a href="/capitulo-zulia" className="dropdown-item">Zulia</a>
                </div>
              </li>
              <li className="nav-item">
                <Link href="/directorio" className="nav-link">Directorio</Link>
              </li>
              <li className="nav-item">
                <Link href="/noticias" className="nav-link">Noticias</Link>
              </li>
              <li className="nav-item">
                <Link href="/afiliarse" className="nav-link">Afiliarse</Link>
              </li>
              <li className="nav-item">
                <Link href="/acceder" className="nav-link">Acceder</Link>
              </li>
            </ul>
          </nav>

          <button className="mobile-menu-toggle">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>
    </>
  );
} 