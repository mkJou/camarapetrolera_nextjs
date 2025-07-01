import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Solo aplicar middleware a rutas protegidas
  if (pathname.startsWith('/dashboard')) {
    // Obtener token de las cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      // No hay token, redirigir al login
      return NextResponse.redirect(new URL('/acceder', request.url));
    }

    // Si hay token, permitir acceso
    // La verificación JWT completa se hará en la página del dashboard
    return NextResponse.next();
  }

  // Para otras rutas, continuar normalmente
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*'
  ]
};

 