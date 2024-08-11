import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '@/Navigation';

const Layout = () => {
    return (
        <div className="flex flex-col h-screen bg-background text-foreground font-sans">
            <header className="bg-gray-950 p-4 flex items-center">
                <div className="flex items-center space-x-2">
                    <div className="bg-white rounded-full p-1 w-8 h-8 flex items-center justify-center">
                        <span className="text-black text-xl font-bold">♪</span>
                    </div>
                    <span className="text-white text-xl font-light tracking-wide">Gemini Radio</span>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
            <Navigation />
        </div>
    );
};

export default Layout;