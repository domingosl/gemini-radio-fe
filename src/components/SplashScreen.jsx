import React from 'react';
import { Loader2 } from 'lucide-react';
import logoImage from '@/assets/logo.png';

const SplashScreen = ({ isLoading }) => (
    <div className={`fixed inset-0 flex flex-col items-center justify-center ${isLoading ? 'animate__animated animate__fadeIn' : 'animate__animated animate__fadeOut animate__faster'}`}>
        {/* Video background */}
        <video
            className="absolute inset-0 object-cover w-full h-full"
            src="/splash-video.mp4"
            autoPlay
            loop
            muted
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-60" />
        {/* Content */}
        <div className="z-10 flex flex-col items-center space-y-8">
            <img src={logoImage} alt="Gemini Radio Logo" className="w-32 h-32" />
            <Loader2 className="h-16 w-16 animate-spin text-white" />
        </div>
    </div>
);

export default SplashScreen;