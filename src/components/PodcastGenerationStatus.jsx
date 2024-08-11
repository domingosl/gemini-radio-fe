import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/helpers/api-client';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

const PodcastGenerationStatus = ({ podcastInfo, onComplete }) => {
    const [podcast, setPodcast] = useState(podcastInfo);
    const [error, setError] = useState(null);
    const [isGenerating, setIsGenerating] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const result = await apiClient.getPodcastStatus(podcastInfo.id);
                if (result) {
                    setPodcast(prevState => ({ ...prevState, ...result }));
                    if (result.audioURL) {
                        setIsGenerating(false);
                    }
                }
            } catch (err) {
                setError('An error occurred while checking podcast status.');
                setIsGenerating(false);
            }
        };

        const intervalId = setInterval(checkStatus, 5000);

        return () => clearInterval(intervalId);
    }, [podcastInfo.id]);

    useEffect(() => {
        if (!isGenerating) {
            onComplete(podcast);
        }
    }, [isGenerating, podcast, onComplete]);

    const handleListenDownload = () => {
        navigate(`/player/${podcast.id}`, { state: { autoplay: true } });
    };

    if (!isGenerating) {
        return (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-card rounded-lg shadow-lg w-full max-w-md overflow-hidden">
                    <div
                        className="w-full h-[150px] bg-cover bg-center"
                        style={{ backgroundImage: `url(${podcast.imageURL})` }}
                    />
                    <div className="p-6 space-y-4">
                        <h2 className="text-2xl font-bold text-center">{podcast.title}</h2>
                        <p className="text-sm text-muted-foreground text-center">{podcast.synopsis}</p>
                        <Button onClick={handleListenDownload} className="w-full">
                            Listen/Download
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-lg w-full max-w-md">
                <div className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-center">Generating Podcast</h2>
                    {error ? (
                        <p className="text-destructive text-center">{error}</p>
                    ) : (
                        <>
                            <div className="flex justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                            <div className="space-y-4">
                                {podcast.imageURL && (
                                    <div
                                        className="w-full h-[150px] bg-cover bg-center rounded-lg"
                                        style={{ backgroundImage: `url(${podcast.imageURL})` }}
                                    />
                                )}
                                {podcast.title && <h3 className="text-xl font-semibold text-center">{podcast.title}</h3>}
                                {podcast.synopsis && <p className="text-sm text-muted-foreground text-center">{podcast.synopsis}</p>}
                            </div>
                            <p className="text-center text-muted-foreground">
                                Please wait while we generate your podcast audio...
                            </p>
                        </>

                    )}
                </div>
            </div>
        </div>
    );
};

export default PodcastGenerationStatus;