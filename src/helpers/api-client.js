import axios from 'axios';
import pLimit from 'p-limit';

const limit = pLimit(2); // Limit to 2 concurrent requests

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'gemini-radio-client-version': '1'
    }
});

const scanLetter = async (image) => {
    try {
        const response = await apiClient.post('/scan', { image });
        return response.data;
    } catch (error) {
        console.error('Error scanning letter:', error);
        throw error;
    }
};

export default {
    getStatus: async () => {
        const res = await apiClient.get('/status');
        return res;
    },
    scanLetter,
    generatePodcast: async (letters) => {
        const response = await apiClient.post('/podcast/generate', { letters });
        return response.data;
    },
    getPodcasts: async () => {
        const response = await apiClient.get('/podcast')
        return response.data
    },
    getPodcastStatus: async (id) => {
        try {
            const response = await apiClient.get(`/podcast/${id}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return null; // Podcast not ready yet
            }
            console.error('Error getting podcast status:', error);
            throw error;
        }
    }
};