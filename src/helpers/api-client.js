import axios from 'axios'

const getJudgeCode = () => localStorage.getItem('judgeCode');


const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'gemini-radio-client-version': '1'
    }
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        alert(error.response.data.message || "Access forbidden")
        return Promise.reject(error);
    }
);

apiClient.interceptors.request.use(config => {
    const judgeCode = getJudgeCode();
    if (judgeCode) {
        config.headers['x-code'] = judgeCode;
    }
    return config;
}, error => {
    return Promise.reject(error);
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
        const response = await apiClient.post('/podcast/generate', { letters, config: JSON.parse(localStorage.getItem('podcastSettings')) });
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
    },
    getBackgroundMusic: async () => {
        try {
            const response = await apiClient.get('/music');
            return response.data;
        } catch (error) {
            console.error('Error fetching background music:', error);
            throw error;
        }
    },
};