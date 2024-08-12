import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import { Play, Pause, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePodcastStore } from '@/store/podcastStore';
import WaveForm from '@/components/WaveForm';
import { analyzeAudio } from '@/helpers/audioAnalysis';

const PodcastPlayer = () => {
    const { id } = useParams();
    const {
        currentPodcast,
        isPlaying,
        audioRef: storeAudioRef,
        setCurrentPodcast,
        setIsPlaying,
        setAudioRef,
        playPodcast,
        refresh,
        podcasts,
        stopPlayback
    } = usePodcastStore();

    const location = useLocation();
    const shouldAutoplay = location.state?.autoplay;
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [waveform, setWaveform] = useState([]);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        if(!podcasts.length)
            refresh().then(()=> {
                setIsLoading(false)
            })
        else
            setIsLoading(false)
    }, []);

    useEffect(() => {
        setCurrentPodcast(id);
        setAudioRef(audioRef.current);
    }, [id, setCurrentPodcast, setAudioRef, isLoading]);

    useEffect(() => {
        if (currentPodcast) {
            audioRef.current.src = currentPodcast.audioURL;
            audioRef.current.pause(); // Explicitly pause the audio
            audioRef.current.currentTime = 0; // Reset the playback to the start
            setIsPlaying(false); // Ensure the play state is set to false

            audioRef.current.addEventListener('loadedmetadata', () => {
                setDuration(audioRef.current.duration);
            });
            audioRef.current.addEventListener('timeupdate', updateProgress);
            audioRef.current.addEventListener('ended', () => setIsPlaying(false));

            // Analyze the audio
            analyzeAudio(currentPodcast.audioURL).then(setWaveform);
        }

        return () => {
            audioRef.current.removeEventListener('timeupdate', updateProgress);
            audioRef.current.removeEventListener('ended', () => setIsPlaying(false));
        };
    }, [currentPodcast, setIsPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.play();
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (shouldAutoplay && audioRef.current) {
            audioRef.current.play();
        }
    }, [shouldAutoplay]);

    const updateProgress = () => {
        setProgress(audioRef.current.currentTime);
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            stopPlayback();
        } else {
            playPodcast(id);
        }
    };

    const handleProgressChange = (newValue) => {
        const [newTime] = newValue;
        audioRef.current.currentTime = newTime;
        setProgress(newTime);
    };

    const handleDownload = () => {
        if (currentPodcast) {
            window.open(currentPodcast.audioURL, '_blank');
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if(isLoading || !currentPodcast) return (<>load</>)

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            <div className="relative">
                <img
                    src={currentPodcast.imageURL}
                    alt={currentPodcast.title}
                    className="w-full h-64 object-cover"
                />
            </div>
            <div className="bg-card p-4 space-y-4 flex-grow">
                <div className="relative h-16">
                    <WaveForm waveform={waveform} progress={progress} duration={duration} />
                    <Slider
                        value={[progress]}
                        max={duration}
                        step={1}
                        onValueChange={handleProgressChange}
                        className="absolute bottom-0 w-full"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Button variant="outline" size="icon" onClick={togglePlayPause}>
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    <span className="text-sm text-muted-foreground">
            {formatTime(progress)} / {formatTime(duration)}
          </span>
                    <Button onClick={handleDownload} variant="default" size="sm">
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                </div>
                <h2 className="text-2xl font-semibold">{currentPodcast.title}</h2>
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Transcription</h3>
                    { currentPodcast.script.split("\n").map(line => {
                        const [speaker, text] = line.split(": ");
                        if(!speaker) return
                        return (
                            <p className="text-sm text-muted-foreground">
                                <strong>{speaker}:</strong> {text}
                            </p>
                        );
                    }) }
                </div>
            </div>
        </div>
    );
};

export default PodcastPlayer;