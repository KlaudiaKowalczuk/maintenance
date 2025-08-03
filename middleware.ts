import { NextRequest, NextResponse } from 'next/server';
import { getCustomerConfig } from './src/utils/appConfig';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const customerMatch = pathname.match(/^\/([^\/]+)$/);
  
  if (customerMatch) {
    const customerName = customerMatch[1];
    const customerConfig = getCustomerConfig(customerName);
    
    if (customerConfig && customerConfig.configs.language) {
      const response = NextResponse.next();
      response.headers.set('x-customer-language', customerConfig.configs.language);
      return response;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
