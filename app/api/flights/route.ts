// FlightStat Bot 2025 - Next.js API Route
// Consolidated backend - replaces separate Railway server

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const airport = searchParams.get('airport');
    const key = searchParams.get('key');
    const user = searchParams.get('user') || 'unknown';
    
    // Validate required parameters
    if (!airport || !key) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters',
        details: 'Both airport and key parameters are required'
      }, { status: 400 });
    }

    // Log request (without exposing full API key)
    const maskedKey = key.substring(0, 8) + '***' + key.substring(key.length - 4);
    console.log(`🛫 Flight request: ${airport} (User: ${user}, Key: ${maskedKey})`);

    // IATA to ICAO airport code conversion
    const iataToIcao: Record<string, string> = {
      'CGN': 'EDDK', 'FRA': 'EDDF', 'MUC': 'EDDM', 'DUS': 'EDDL',
      'HAM': 'EDDH', 'BER': 'EDDB', 'STR': 'EDDS', 'NUE': 'EDDN',
      'HAJ': 'EDDV', 'BRE': 'EDDW', 'JFK': 'KJFK', 'LAX': 'KLAX',
      'LHR': 'EGLL', 'CDG': 'LFPG', 'AMS': 'EHAM', 'ZUR': 'LSZH',
      'VIE': 'LOWW', 'FCO': 'LIRF', 'MAD': 'LEMD', 'BCN': 'LEBL'
    };

    const icaoCode = iataToIcao[airport.toUpperCase()] || airport;
    console.log(`🔄 Converting ${airport} → ${icaoCode}`);

    // Build FlightAware API URL
    const now = new Date();
    const startTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
    const endTime = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    
    const flightAwareUrl = `https://aeroapi.flightaware.com/aeroapi/airports/${icaoCode}/flights/arrivals?start=${startTime.toISOString()}&end=${endTime.toISOString()}&max_pages=3`;
    
    // Make request to FlightAware API
    const response = await fetch(flightAwareUrl, {
      headers: {
        'x-apikey': key,
        'Accept': 'application/json; charset=UTF-8',
        'User-Agent': 'FlightStat-Bot-2025/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`FlightAware API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Process flights
    const processedFlights = (data.arrivals || [])
      .filter((flight: any) => {
        const status = flight.status?.toLowerCase() || '';
        return status.includes('en route') || status.includes('approach') || 
               status.includes('final') || status.includes('scheduled') ||
               status.includes('departed') || status.includes('airborne') ||
               status.includes('climbing') || status.includes('cruising') ||
               status.includes('descending') || status.includes('diverted');
      })
      .slice(0, 50)
      .map((flight: any, index: number) => ({
        id: flight.fa_flight_id || `flight-${index}`,
        ident: flight.ident || 'Unknown',
        callsign: flight.ident || 'Unknown',
        registration: flight.registration || 'N/A',
        aircraft_type: flight.aircraft_type || 'Unknown',
        operator: flight.operator || 'Unknown',
        operator_iata: flight.operator_iata || 'XX',
        origin: {
          code: flight.origin?.code_iata || flight.origin?.code_icao || 'XXX',
          name: flight.origin?.name || 'Unknown Airport',
          city: flight.origin?.city || 'Unknown'
        },
        scheduled_in: flight.scheduled_in,
        estimated_in: flight.estimated_in,
        actual_in: flight.actual_in,
        status: flight.status || 'Unknown',
        progress_percent: flight.progress_percent || 0,
        isMonitored: false,
        isNewOrUpdated: false
      }));

    console.log(`✅ Success: ${processedFlights.length} flights for ${airport}`);
    
    return NextResponse.json({
      success: true,
      flights: processedFlights,
      airport: airport,
      timestamp: new Date().toISOString(),
      meta: {
        total: processedFlights.length,
        source: 'FlightAware API via Next.js',
        user: user
      }
    });

  } catch (error: any) {
    console.error('❌ API Error:', error.message);
    
    // Return demo data on error
    const demoFlights = [
      {
        id: 'demo-1', ident: 'LH441', callsign: 'DLH441', registration: 'D-AIXA',
        aircraft_type: 'A350-900', operator: 'DLH', operator_iata: 'LH',
        origin: { code: 'KJFK', name: 'John F. Kennedy International', city: 'New York' },
        scheduled_in: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        estimated_in: new Date(Date.now() + 2.25 * 60 * 60 * 1000).toISOString(),
        status: 'En Route', progress_percent: 75, isMonitored: false, isNewOrUpdated: true
      },
      {
        id: 'demo-2', ident: 'UA789', callsign: 'UAL789', registration: 'N12345',
        aircraft_type: 'B787-9', operator: 'UAL', operator_iata: 'UA',
        origin: { code: 'KSFO', name: 'San Francisco International', city: 'San Francisco' },
        scheduled_in: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
        estimated_in: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
        status: 'En Route', progress_percent: 85, isMonitored: false, isNewOrUpdated: false
      }
    ];

    return NextResponse.json({
      success: true,
      flights: demoFlights,
      airport: request.nextUrl.searchParams.get('airport'),
      timestamp: new Date().toISOString(),
      meta: {
        total: demoFlights.length,
        source: 'Demo Data (API Fallback)',
        user: request.nextUrl.searchParams.get('user') || 'unknown',
        note: 'Using demo data due to API restrictions'
      }
    });
  }
}