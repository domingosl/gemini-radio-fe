import React, { useState, useEffect } from 'react';
import apiClient from '@/helpers/api-client';
import PodcastGenerationStatus from './PodcastGenerationStatus';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

const PodcastGeneration = ({ transcriptions, onComplete }) => {
    const [podcastInfo, setPodcastInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const generatePodcast = async () => {
            try {
                const formattedLetters = transcriptions.map((text, index) =>
                    `LETTER ${index + 1} BEGIN\n${text.replace(/\n/g, ' ')}\nLETTER ${index + 1} ENDS`
                ).join('\n');

                const result = await apiClient.generatePodcast(formattedLetters);
                setPodcastInfo(result.podcast);
            } catch (err) {
                setError(err.message || 'An error occurred while initiating podcast generation.');
            }
        };

        generatePodcast();
    }, [transcriptions]);

    if (error) {
        return (
            <div className="p-4 space-y-4">
                <div className="flex items-center text-destructive">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    <p>{error}</p>
                </div>
                <Button onClick={() => window.location.reload()} className="w-full">
                    Try Again
                </Button>
            </div>
        );
    }

    if (podcastInfo) {
        return <PodcastGenerationStatus podcastInfo={podcastInfo} onComplete={onComplete} />;
    }

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-lg font-medium">Initiating podcast generation...</p>
            </div>
        </div>
    );
};

export default PodcastGeneration;