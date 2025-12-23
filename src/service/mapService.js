import { getApiBaseUrl } from "@/utils/apiHelper";

export const mapService = {
    getHeatmapData: async () => {
        try {
            const response = await fetch(`${getApiBaseUrl()}/api/heat-maps/geojson`);
            if (!response.ok) {
                throw new Error('Failed to fetch heatmap data');
            }
            return await response.json();
        } catch (error) {
            console.error('Heatmap fetch error:', error);
            throw error;
        }
    }
};
