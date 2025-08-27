import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ClientLayout from './components/ClientLayout';
import { LanguageProvider } from './contexts/LanguageContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Cámara Petrolera de Venezuela",
  description: "Fortaleciendo el papel del sector productivo en la industria de los hidrocarburos nacional",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Font Awesome */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
