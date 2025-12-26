import { request } from "./apiBase";

/**
 * mapService.js
 * Handles geospatial data and heatmap generation.
 * Endpoint: /api/heat-maps
 */
export const mapService = {
    /**
     * Fetches heatmap data in GeoJSON format.
     * Role: Authenticated / Public (depending on backend config)
     */
    getHeatmapData: async (token) => {
        return await request("heat-maps/geojson", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
    }
};
