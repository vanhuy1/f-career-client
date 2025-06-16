'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface MapProps {
  coordinates: [number, number];
  address: string;
}

// Custom marker icon using SVG
const customIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4f46e5" width="36px" height="36px">
    <path d="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 7.94 8.5 15.5 8.5 15.5s8.5-7.56 8.5-15.5C20.5 3.81 16.69 0 12 0zm0 13a4.5 4.5 0 110-9 4.5 4.5 0 010 9z"/>
  </svg>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const Map = ({ coordinates, address }: MapProps) => {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    // Update map view when coordinates change
    if (mapRef.current) {
      mapRef.current.setView(coordinates, 15);
    }
  }, [coordinates]);

  return (
    <MapContainer
      center={coordinates}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
      key={`${coordinates[0]}-${coordinates[1]}`} // Force re-render on coordinate change
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={coordinates} icon={customIcon}>
        <Popup>{address}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
