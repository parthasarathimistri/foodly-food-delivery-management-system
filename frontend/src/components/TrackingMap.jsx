import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const restaurantIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const customerIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const deliveryIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

function FitBounds({ positions }) {
    const map = useMap();
    useEffect(() => {
        if (positions && positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, positions]);
    return null;
}

/**
 * Props:
 *   restaurantPos: [lat, lng]
 *   customerPos: [lat, lng]
 *   deliveryPos: [lat, lng] (optional)
 *   restaurantName: string
 *   customerName: string
 */
export default function TrackingMap({ restaurantPos, customerPos, deliveryPos, restaurantName, customerName }) {
    const allPositions = [restaurantPos, customerPos, deliveryPos].filter(Boolean);
    const center = restaurantPos || [12.9716, 77.5946];

    const routePoints = deliveryPos
        ? [deliveryPos, restaurantPos, customerPos].filter(Boolean)
        : [restaurantPos, customerPos].filter(Boolean);

    return (
        <div style={{ height: '400px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FitBounds positions={allPositions} />

                {restaurantPos && (
                    <Marker position={restaurantPos} icon={restaurantIcon}>
                        <Popup>🍽️ <strong>{restaurantName || 'Restaurant'}</strong><br />Pickup Point</Popup>
                    </Marker>
                )}
                {customerPos && (
                    <Marker position={customerPos} icon={customerIcon}>
                        <Popup>🏠 <strong>{customerName || 'Customer'}</strong><br />Delivery Point</Popup>
                    </Marker>
                )}
                {deliveryPos && (
                    <Marker position={deliveryPos} icon={deliveryIcon}>
                        <Popup>🛵 Delivery Partner<br />En route</Popup>
                    </Marker>
                )}
                {routePoints.length > 1 && (
                    <Polyline positions={routePoints} color="#6366f1" weight={3} dashArray="8 4" />
                )}
            </MapContainer>
        </div>
    );
}
