'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// CHATGPT FIX: Client-only rendering to avoid WebAuthn SSR issues
const ClientOnlyFlightStatBot = dynamic(() => Promise.resolve(FlightStatBotComponent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-gradient-to-br from-aviation-black via-aviation-dark to-aviation-gray flex items-center justify-center">
    <div className="text-white">Loading FlightStat Bot...</div>
  </div>
});

import { Plane, Settings, RefreshCw, MapPin, Clock, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { SecureSettings } from '@/components/ui/SecureSettings';
import { CreditDisplay } from '@/components/ui/CreditDisplay';
import { FlightTable } from '@/components/flight/FlightTable';
import { FlightFilters } from '@/components/flight/FlightFilters';
import { FlightSeparator } from '@/components/flight/FlightSeparator';
import { cn } from '@/lib/utils';
import { securityManager } from '@/lib/security';
import { filterFlights, categorizeFlights, getFlightStats } from '@/lib/flightUtils';
import type { Flight } from '@/types/flight';

function FlightStatBotComponent() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [airport, setAirport] = useState('CGN');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [apiStatus, setApiStatus] = useState<'offline' | 'active' | 'warning'>('offline');
  const [showSettings, setShowSettings] = useState(false);
  const [isSecurityInitialized, setIsSecurityInitialized] = useState(false);
  
  // NEW: Filter states (ADDITIVE - not changing existing functionality)
  const [showCargo, setShowCargo] = useState(true);
  const [showNotStarted, setShowNotStarted] = useState(true);
  const [useSeparatedView, setUseSeparatedView] = useState(false);

  // Load saved settings and demo data
  useEffect(() => {
    const savedApiKey = localStorage.getItem('flightstat_apikey');
    const savedAirport = localStorage.getItem('flightstat_airport');
    
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedAirport) setAirport(savedAirport);
    
    // Initialize security manager
    setIsSecurityInitialized(true);
    
    // Load demo data on startup
    fetchFlights();
  }, []);

  // Save settings
  useEffect(() => {
    if (apiKey) localStorage.setItem('flightstat_apikey', apiKey);
    if (airport) localStorage.setItem('flightstat_airport', airport);
  }, [apiKey, airport]);

  // Listen for security events and track user activity
  useEffect(() => {
    const handleLogout = () => {
      setShowSettings(false);
    };

    const handleUserActivity = () => {
      if (isSecurityInitialized) {
        securityManager.updateActivity();
      }
    };

    // Security events
    window.addEventListener('security:logout', handleLogout);
    
    // User activity tracking
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      window.removeEventListener('security:logout', handleLogout);
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [isSecurityInitialized]);

  const fetchFlights = async () => {
    // Update security activity
    if (isSecurityInitialized) {
      securityManager.updateActivity();
    }
    
    setLoading(true);
    setError(null);
    setApiStatus('warning');

    // NEW: Multi-user support - get current user's API key and user ID
    const currentUser = securityManager.getCurrentUser();
    const effectiveApiKey = currentUser?.personalApiKey || apiKey;
    const userId = currentUser?.id || 'single_user';

    try {
      // If no API key, show demo data with helpful message
      if (!effectiveApiKey.trim()) {
        // 🎯 DEMO: Nur EN ROUTE Flüge (in der Luft) - gelandete Flüge sind irrelevant!
        const demoFlights: Flight[] = [
          {
            id: 'demo-1',
            ident: 'LH441',
            callsign: 'DLH441',
            registration: 'D-AIXA',
            aircraft_type: 'A350-900',
            operator: 'DLH',
            operator_iata: 'LH',
            origin: { code: 'KJFK', name: 'John F. Kennedy International', city: 'New York' },
            scheduled_in: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            estimated_in: new Date(Date.now() + 2.25 * 60 * 60 * 1000).toISOString(),
            status: 'En Route',
            progress_percent: 75,
            isMonitored: true,
            isNewOrUpdated: true
          },
          {
            id: 'demo-2',
            ident: 'BA903',
            callsign: 'BAW903',
            registration: 'G-STBA',
            aircraft_type: 'A320neo',
            operator: 'BAW',
            operator_iata: 'BA',
            origin: { code: 'EGLL', name: 'London Heathrow', city: 'London' },
            scheduled_in: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
            estimated_in: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
            status: 'Final Approach',
            progress_percent: 95,
            isMonitored: true,
            isNewOrUpdated: false
          },
          {
            id: 'demo-3',
            ident: 'AF1234',
            callsign: 'AFR1234',
            registration: 'F-HZUA',
            aircraft_type: 'A220-300',
            operator: 'AFR',
            operator_iata: 'AF',
            origin: { code: 'LFPG', name: 'Charles de Gaulle', city: 'Paris' },
            scheduled_in: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
            estimated_in: new Date(Date.now() + 3.5 * 60 * 60 * 1000).toISOString(),
            status: 'En Route (Delayed)',
            progress_percent: 60,
            isMonitored: false,
            isNewOrUpdated: false
          },
          {
            id: 'demo-4',
            ident: 'UAL789',
            callsign: 'UAL789',
            registration: 'N12345',
            aircraft_type: 'B787-9',
            operator: 'UAL',
            operator_iata: 'UA',
            origin: { code: 'KSFO', name: 'San Francisco International', city: 'San Francisco' },
            scheduled_in: new Date(Date.now() + 0.5 * 60 * 60 * 1000).toISOString(),
            estimated_in: new Date(Date.now() + 0.75 * 60 * 60 * 1000).toISOString(),
            status: 'Descending',
            progress_percent: 85,
            isMonitored: true,
            isNewOrUpdated: true
          }
        ];
        
        setFlights(demoFlights);
        setLastUpdate(new Date());
        setApiStatus('warning');
        setError('🎯 Demo-Modus: Zeigt nur EN ROUTE Flüge (in der Luft)! Für Live-Daten: FlightAware AeroAPI-Key in Settings eingeben');
        return;
      }

      console.log(`Fetching flights for ${airport} with API key: ${effectiveApiKey.substring(0, 8)}... (User: ${userId})`);
      
      // NEW: Include user ID in API request for tracking
      // CONSOLIDATED BACKEND - Next.js API Route (no external dependencies)
      apiUrl = `/api/flights?airport=${airport}&key=${encodeURIComponent(effectiveApiKey)}&user=${encodeURIComponent(userId)}`;
      
      const response = await fetch(apiUrl, { headers });
      const data = await response.json();

      console.log('🔍 DETAILED API Response:', JSON.stringify(data, null, 2));
      
      if (data.meta) {
        console.log('📊 API Meta Info:', data.meta);
      }
      
      if (data.discarded_preview) {
        console.log('🗑️ Discarded Flights Preview:', data.discarded_preview);
      }

      if (!response.ok) {
        throw new Error(data.details || data.error || 'API request failed');
      }

      // Handle both Railway Backend response and direct FlightAware response
      if (data.success && data.flights) {
        // Railway Backend response (already processed)
        setFlights(data.flights);
        console.log(`✅ Live data loaded: ${data.flights.length} flights from ${data.airport} via Railway Backend`);
      } else if (data.arrivals) {
        // Direct FlightAware API response (needs processing)
        const processedFlights = data.arrivals
          .filter((flight: any) => {
            const status = flight.status?.toLowerCase() || '';
            return status.includes('en route') || 
                   status.includes('approach') || 
                   status.includes('final') ||
                   status.includes('landing') ||
                   status.includes('arrived');
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
        
        setFlights(processedFlights);
        setLastUpdate(new Date());
        setApiStatus('active');
        setError(null);
        
        // NEW: Track API usage for multi-user compliance
        if (isSecurityInitialized && currentUser) {
          securityManager.trackApiUsage(currentUser.id, 1);
        }
        
        // Show success message if we got live data
        if (processedFlights.length > 0) {
          console.log(`✅ Live data loaded: ${processedFlights.length} flights from ${airport} (User: ${userId})`);
        }
      } else {
        throw new Error('No flight data received from FlightAware API');
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(`❌ ${err.message}`);
      setApiStatus('offline');
      
      // Enhanced demo data for Netlify deployment
      const demoFlights: Flight[] = [
        {
          id: 'demo-1',
          ident: 'LH441',
          callsign: 'DLH441',
          registration: 'D-AIXA',
          aircraft_type: 'A350-900',
          operator: 'DLH',
          operator_iata: 'LH',
          origin: { code: 'KJFK', name: 'John F. Kennedy International', city: 'New York' },
          scheduled_in: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          estimated_in: new Date(Date.now() + 2.25 * 60 * 60 * 1000).toISOString(),
          status: 'En Route',
          progress_percent: 75,
          isMonitored: true,
          isNewOrUpdated: true
        },
        {
          id: 'demo-2',
          ident: 'UA789',
          callsign: 'UAL789',
          registration: 'N12345',
          aircraft_type: 'B787-9',
          operator: 'UAL',
          operator_iata: 'UA',
          origin: { code: 'KSFO', name: 'San Francisco International', city: 'San Francisco' },
          scheduled_in: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
          estimated_in: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
          status: 'En Route',
          progress_percent: 85,
          isMonitored: false,
          isNewOrUpdated: false
        },
        {
          id: 'demo-3',
          ident: 'BA123',
          callsign: 'BAW123',
          registration: 'G-ABCD',
          aircraft_type: 'A320-200',
          operator: 'BAW',
          operator_iata: 'BA',
          origin: { code: 'EGLL', name: 'London Heathrow', city: 'London' },
          scheduled_in: new Date(Date.now() + 0.5 * 60 * 60 * 1000).toISOString(),
          estimated_in: new Date(Date.now() + 0.75 * 60 * 60 * 1000).toISOString(),
          status: 'Approach',
          progress_percent: 95,
          isMonitored: true,
          isNewOrUpdated: true
        },
        {
          id: 'demo-4',
          ident: 'AF456',
          callsign: 'AFR456',
          registration: 'F-WXYZ',
          aircraft_type: 'A330-300',
          operator: 'AFR',
          operator_iata: 'AF',
          origin: { code: 'LFPG', name: 'Charles de Gaulle', city: 'Paris' },
          scheduled_in: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
          estimated_in: new Date(Date.now() + 3.5 * 60 * 60 * 1000).toISOString(),
          status: 'En Route',
          progress_percent: 60,
          isMonitored: false,
          isNewOrUpdated: false
        },
        {
          id: 'demo-5',
          ident: 'KL789F',
          callsign: 'KLM789F',
          registration: 'PH-CARGO',
          aircraft_type: 'B747F',
          operator: 'KLM',
          operator_iata: 'KL',
          origin: { code: 'EHAM', name: 'Amsterdam Schiphol', city: 'Amsterdam' },
          scheduled_in: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          estimated_in: new Date(Date.now() + 4.25 * 60 * 60 * 1000).toISOString(),
          status: 'En Route',
          progress_percent: 45,
          isMonitored: false,
          isNewOrUpdated: false
        },
        {
          id: 'demo-6',
          ident: 'DL234',
          callsign: 'DAL234',
          registration: 'N567DL',
          aircraft_type: 'A330-900',
          operator: 'DAL',
          operator_iata: 'DL',
          origin: { code: 'KATL', name: 'Atlanta International', city: 'Atlanta' },
          scheduled_in: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          estimated_in: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          status: 'Delayed',
          progress_percent: 0,
          isMonitored: true,
          isNewOrUpdated: false
        }
      ];
      setFlights(demoFlights);
      console.log(`✅ Demo data loaded: ${demoFlights.length} flights for ${airport} (Netlify Demo Mode)`);
    } finally {
      setLoading(false);
    }
  };

  const toggleMonitor = (flightId: string) => {
    // Update security activity
    if (isSecurityInitialized) {
      securityManager.updateActivity();
    }
    
    setFlights(prev => prev.map(flight => 
      (flight.id || flight.ident) === flightId 
        ? { ...flight, isMonitored: !flight.isMonitored }
        : flight
    ));
  };

  // NEW: Filter and categorization logic (ADDITIVE - not changing existing)
  const filteredFlights = filterFlights(flights, { showCargo, showNotStarted });
  const flightCategories = categorizeFlights(filteredFlights);
  const flightStats = getFlightStats(flights);
  
  // NEW: Filter toggle handlers
  const handleToggleCargo = () => setShowCargo(!showCargo);
  const handleToggleNotStarted = () => setShowNotStarted(!showNotStarted);
  
  const monitoredCount = flights.filter(f => f.isMonitored).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-aviation-black via-aviation-dark to-aviation-gray">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <header className="glass-fallback p-6 mb-8 rounded-2xl">
        
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-aviation-blue to-aviation-blue-dark rounded-xl hover:scale-105 transition-transform duration-200">
                <Plane className="w-8 h-8 text-aviation-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-aviation-blue to-aviation-blue-light bg-clip-text text-transparent">
                  FlightStat Bot 2025
                </h1>
                <p className="text-gray-400">Professional Flight Monitoring</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <StatusIndicator 
                status={apiStatus} 
                label={apiStatus === 'active' ? 'Connected' : apiStatus === 'warning' ? 'Loading' : 'Offline'} 
              />
              <Button
                variant="glass"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </div>
        </header>

        {/* Secure Settings Modal */}
        {isSecurityInitialized && (
          <SecureSettings
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            airport={airport}
            onAirportChange={setAirport}
          />
        )}

        {/* Real-time Credit Display (NEW - only visible when user is logged in) */}
        <CreditDisplay className="mb-8" />

        {/* Controls */}
        <div className="glass rounded-glass p-6 mb-8 animate-slide-up">
        
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-aviation-blue" />
                <span className="text-lg font-semibold">{airport}</span>
                <span className="text-gray-400">Arrivals</span>
              </div>
              
              {lastUpdate && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  Last update: {lastUpdate.toLocaleTimeString()}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Monitored:</span>
                <span className="text-aviation-blue font-semibold">{monitoredCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* NEW: View Toggle Button */}
              {flights.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUseSeparatedView(!useSeparatedView)}
                  className="flex items-center gap-2"
                >
                  <Plane className="w-4 h-4" />
                  {useSeparatedView ? 'Unified View' : 'Separated View'}
                </Button>
              )}
              
              <Button
                onClick={fetchFlights}
                loading={loading}
                disabled={!(securityManager.getCurrentUser()?.personalApiKey || apiKey).trim()}
                className="flex items-center gap-2"
              >
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="glass rounded-glass p-4 mb-8 border-l-4 border-aviation-red animate-fade-in">
          
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-aviation-red" />
              <div>
                <h4 className="font-semibold text-aviation-red">Connection Error</h4>
                <p className="text-gray-300 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* NEW: Flight Filters (ADDITIVE - not changing existing functionality) */}
        {flights.length > 0 && (
          <FlightFilters
            showCargo={showCargo}
            showNotStarted={showNotStarted}
            onToggleCargo={handleToggleCargo}
            onToggleNotStarted={handleToggleNotStarted}
            cargoCount={flightStats.cargo}
            notStartedCount={flightStats.notStarted}
            className="mb-6 animate-fade-in"
          />
        )}

        {/* Flight Display - Enhanced with filtering and separation */}
        <div className="animate-slide-up-delayed">
          {useSeparatedView ? (
            // NEW: Separated view with smart categorization
            <FlightSeparator
              enRouteFlights={flightCategories.enRoute}
              notStartedFlights={flightCategories.notStarted}
              onFlightSelect={(flight) => {
                console.log('Selected flight:', flight);
                // TODO: Open flight details modal
              }}
              onToggleMonitor={toggleMonitor}
            />
          ) : (
            // EXISTING: Original FlightTable (unchanged functionality)
            <FlightTable
              flights={filteredFlights}
              onFlightSelect={(flight) => {
                console.log('Selected flight:', flight);
                // TODO: Open flight details modal
              }}
              onToggleMonitor={toggleMonitor}
            />
          )}
        </div>

        {/* Stats Footer */}
        {flights.length > 0 && (
          <div className="glass rounded-glass p-4 mt-8 animate-fade-in-delayed">
          
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-6">
                <span>Total: <span className="text-aviation-blue font-semibold">{flights.length}</span></span>
                <span>Visible: <span className="text-white font-semibold">{filteredFlights.length}</span></span>
                <span>Monitored: <span className="text-aviation-green font-semibold">{monitoredCount}</span></span>
                {flightStats.cargo > 0 && (
                  <span>Cargo: <span className="text-yellow-500 font-semibold">{flightStats.cargo}</span></span>
                )}
                {flightStats.notStarted > 0 && (
                  <span>Delayed: <span className="text-orange-500 font-semibold">{flightStats.notStarted}</span></span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-aviation-green" />
                <span>FlightAware API Connected</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// CHATGPT FIX: Export client-only component to avoid WebAuthn SSR issues
export default function FlightStatBot() {
  return <ClientOnlyFlightStatBot />;
}