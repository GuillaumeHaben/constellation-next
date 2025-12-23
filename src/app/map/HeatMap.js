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
            zoom: 11
        });


        map.current.on('load', async () => {
            try {
                const data = await mapService.getHeatmapData();

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
                            ['linear'],
                            ['zoom'],
                            5, 15,
                            12, 50
                        ],
                        'circle-color': [
                            'interpolate',
                            ['linear'],
                            ['get', 'count'],
                            1, '#ccefff',
                            2, '#66d9ff',
                            5, '#00bfff',
                            10, '#0099ff',
                            20, '#0066cc'
                        ],
                        'circle-opacity': 0.4,
                        'circle-stroke-color': 'rgba(255,255,255,0)',
                        'circle-stroke-width': 0
                    }
                });

                // Add popup on click
                map.current.on('click', 'heatmap-layer', (e) => {
                    const count = e.features[0].properties.count;
                    new maplibregl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(`<strong>Users in this area:</strong> ${count}`)
                        .addTo(map.current);
                });

                // Change cursor on hover
                map.current.on('mouseenter', 'heatmap-layer', () => {
                    map.current.getCanvas().style.cursor = 'pointer';
                });
                map.current.on('mouseleave', 'heatmap-layer', () => {
                    map.current.getCanvas().style.cursor = '';
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
