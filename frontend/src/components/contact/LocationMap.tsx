import React from 'react';

interface LocationMapProps {
  latitude: number;
  longitude: number;
}

export function LocationMap({ latitude, longitude }: LocationMapProps): React.JSX.Element {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    console.error("Google Maps API key is not set. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file.");
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg text-gray-600">
        Map not available. Please check API key configuration.
      </div>
    );
  }

  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${latitude},${longitude}&zoom=15`;

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapSrc}
        title="Store Location Map"
        data-testid="location-map"
      ></iframe>
    </div>
  );
}