import React from 'react';
import { GoogleMap, LoadScript, HeatmapLayer } from '@react-google-maps/api';

const center = { lat: 52.160114, lng: 4.497010 };

const containerStyle = {
    width: '100%',
    height: '600px',
};

// Simple example data
const sampleHeatmapData = [
    { lat: 52.160, lng: 4.497 },
    { lat: 52.161, lng: 4.498 },
    { lat: 52.159, lng: 4.496 },
    { lat: 52.162, lng: 4.495 },
];

const Heatmap = ({ heatmapPoints }) => {
    const data = heatmapPoints && heatmapPoints.length > 0 ? heatmapPoints : sampleHeatmapData;

    return (
        <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            libraries={['visualization']}
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={13}
            >
                <HeatmapLayer
                    data={data.map(p => ({ location: p, weight: p.weight || 1 }))}
                    options={{ radius: 40, opacity: 0.7 }}
                />
            </GoogleMap>
        </LoadScript>
    );
};

export default Heatmap;
