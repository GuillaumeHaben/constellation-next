import { getApiBaseUrl } from "@/utils/apiHelper";

export const mapService = {
    getHeatmapData: async (token) => {
        try {
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${getApiBaseUrl()}/api/heat-maps/geojson`, {
                headers
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Heatmap fetch failed:', response.status, errorData);
                throw new Error('Failed to fetch heatmap data');
            }
            return await response.json();
        } catch (error) {
            console.error('Heatmap fetch error:', error);
            throw error;
        }
    }
};
