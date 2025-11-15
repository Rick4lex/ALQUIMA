
import { NextRequest, NextResponse } from 'next/server';

// Esta ruta actúa como un proxy para evitar problemas de CORS
// al consultar el estado de una transacción desde el lado del cliente.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const externalUrl = searchParams.get('url');

  if (!externalUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(externalUrl);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error fetching from ePayco');
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`API proxy error for ${externalUrl}:`, error.message);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
