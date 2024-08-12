// src/hooks/useSettingsInitialization.js
import { useEffect } from 'react';

const defaultSettings = {
    podcastName: 'Gemini Podcast',
    hostOneName: 'Chipo',
    hostTwoName: 'Thandiwe',
    lettersAddress: '',
    backgroundMusic: '1',
    weatherInfo: 'Never',
};

const useSettingsInitialization = () => {
    useEffect(() => {
        const savedSettings = localStorage.getItem('podcastSettings');
        if (!savedSettings) {
            localStorage.setItem('podcastSettings', JSON.stringify(defaultSettings));
        }
    }, []);
};

export default useSettingsInitialization;