"use client";

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { mapService } from '@/service/mapService';

const HeatMap = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        if (map.current) return; // Initialize map only once

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
            center: [4.497010, 52.160114],
            zoom: 11,
            minZoom: 3,      // Prevent zooming out to see the whole world
            maxZoom: 13      // Prevent zooming in too close
        });


        map.current.on('load', async () => {
            try {
                const token = localStorage.getItem("token");
                const data = await mapService.getHeatmapData(token);

                // Add GeoJSON source

                // Add GeoJSON source
                map.current.addSource('heatmap', {
                    type: 'geojson',
                    data: data
                });

                // Add circle layer for smoother heatmap
                map.current.addLayer({
                    id: 'heatmap-layer',
                    type: 'circle',
                    source: 'heatmap',
                    paint: {
                        'circle-radius': [
                            'interpolate',
                            ['exponential', 2],
                            ['zoom'],
                            8, 20,       // At zoom 8 and below, stay at 5px (cluster view)
                            12, 50,     // Match H3 Res 7 size (~1.1km radius) at zoom 12
                            15, 150     // Match H3 Res 7 size at zoom 15 (then stay fixed in pixels)
                        ],
                        'circle-color': [
                            'interpolate',
                            ['linear'],
                            ['get', 'count'],
                            1, '#3b82f6',   // Blue (1 user)
                            3, '#22c55e',   // Green (3 users)
                            8, '#eab308',   // Yellow (8 users)
                            15, '#f97316',  // Orange (15 users)
                            25, '#ef4444'   // Red (25+ users)
                        ],
                        'circle-opacity': 0.6,
                        'circle-blur': 0.5,
                        'circle-stroke-color': 'rgba(255,255,255,0.2)',
                        'circle-stroke-width': 1
                    }
                });

            } catch (error) {
                console.error('Map loading error:', error);
            }
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={mapContainer}
            style={{ width: '100%', height: '600px' }}
            className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
        />
    );
};

export default HeatMap;
