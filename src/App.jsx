import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import Layout from '@/Layout';

import useSettingsInitialization from '@/hooks/useSettingsInitialization';

import PodcastList from '@/pages/PodcastList';
import PodcastPlayer from '@/pages/PodcastPlayer';
import NewPodcast from '@/pages/NewPodcast';
import PodcastSettings from '@/pages/PodcastSettings';

import SplashScreen from '@/components/SplashScreen';
import apiClient from '@/helpers/api-client';
import { Toaster } from "@/components/ui/toaster";

const SPLASH_SCREEN_ENABLED = import.meta.env.VITE_ENABLE_SPLASH_SCREEN === 'true';
const MIN_SPLASH_DURATION = 3000; // 3 seconds in milliseconds

const App = () => {

    useSettingsInitialization()

    const [isLoading, setIsLoading] = useState(SPLASH_SCREEN_ENABLED);
    const [showSplash, setShowSplash] = useState(SPLASH_SCREEN_ENABLED);

    useEffect(() => {
        if (!SPLASH_SCREEN_ENABLED) {
            return;
        }

        const startTime = Date.now();

        const checkApiStatus = async () => {
            try {
                await apiClient.getStatus();
            } catch (error) {
                console.error('API status check failed:', error);
            } finally {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, MIN_SPLASH_DURATION - elapsedTime);

                setTimeout(() => {
                    setIsLoading(false);
                    setTimeout(() => setShowSplash(false), 500); // Wait for fade-out animation
                }, remainingTime);
            }
        };

        checkApiStatus();
    }, []);


    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            {showSplash && <SplashScreen isLoading={isLoading} />}
            {!isLoading && (
                <Router>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<PodcastList />} />
                            <Route path="player/:id" element={<PodcastPlayer />} />
                            <Route path="new-podcast" element={<NewPodcast />} />
                            <Route path="settings" element={<PodcastSettings />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            )}
            <Toaster />
        </ThemeProvider>
    );
};

export default App;