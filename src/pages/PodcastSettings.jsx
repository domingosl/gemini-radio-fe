import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Play, Pause } from 'lucide-react';
import apiClient from '@/helpers/api-client';
import ClickableTooltip from '@/components/ClickableTooltip';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PodcastSettings = () => {
    const [settings, setSettings] = useState({});
    const [musicOptions, setMusicOptions] = useState([]);
    const [currentSample, setCurrentSample] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const audioRef = React.useRef(new Audio());

    useEffect(() => {
        const loadSettings = async () => {
            const savedSettings = localStorage.getItem('podcastSettings');
            const initialSettings = savedSettings ? JSON.parse(savedSettings) : {};
            setSettings(initialSettings);

            try {
                const music = await apiClient.getBackgroundMusic();
                setMusicOptions(music);

                const currentMusicId = initialSettings.backgroundMusic || music[0]?.id.toString();
                const selectedMusic = music.find(m => m.id.toString() === currentMusicId) || music[0];

                if (selectedMusic) {
                    setCurrentSample(selectedMusic);
                    audioRef.current.src = `${API_BASE_URL}${selectedMusic.sample}`;
                    setSettings(prev => ({ ...prev, backgroundMusic: selectedMusic.id.toString() }));
                }
            } catch (error) {
                console.error('Failed to fetch music options:', error);
            }
        };

        loadSettings();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleMusicChange = (value) => {
        if(!value) return
        const selectedMusic = musicOptions.find(m => m.id.toString() === value);
        setSettings(prev => ({ ...prev, backgroundMusic: value }));
        setCurrentSample(selectedMusic);
        audioRef.current.src = `${API_BASE_URL}${selectedMusic.sample}`;
        setIsPlaying(false);
    };

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('podcastSettings', JSON.stringify(settings));
        setShowConfirmation(true);
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Podcast Settings</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Podcast Name</label>
                    <div className="flex items-center">
                        <Input
                            name="podcastName"
                            value={settings.podcastName}
                            onChange={handleInputChange}
                            className="flex-grow"
                        />
                        <ClickableTooltip content="This is the name that will be mentioned by the podcast hosts." />
                    </div>
                </div>

                <div>
                    <label className="block mb-1">Host One Name (Him)</label>
                    <div className="flex items-center">
                        <Input
                            name="hostOneName"
                            value={settings.hostOneName}
                            onChange={handleInputChange}
                            className="flex-grow"
                        />
                        <ClickableTooltip content="This will be the name of the male host of the podcast." />
                    </div>
                </div>

                <div>
                    <label className="block mb-1">Host Two Name (Her)</label>
                    <div className="flex items-center">
                        <Input
                            name="hostTwoName"
                            value={settings.hostTwoName}
                            onChange={handleInputChange}
                            className="flex-grow"
                        />
                        <ClickableTooltip content="This will be the name of the female host of the podcast." />
                    </div>
                </div>

                <div>
                    <label className="block mb-1">Letters Address</label>
                    <div className="flex items-center">
                        <Textarea
                            name="lettersAddress"
                            value={settings.lettersAddress}
                            onChange={handleInputChange}
                            className="flex-grow"
                        />
                        <ClickableTooltip content="This is the physical address where listeners need to send the letters that will be read during the podcast." />
                    </div>
                </div>

                <div>
                    <label className="block mb-1">Background Music</label>
                    <div className="flex items-center">
                        <Select
                            name="backgroundMusic"
                            value={settings.backgroundMusic}
                            onValueChange={handleMusicChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a song" />
                            </SelectTrigger>
                            <SelectContent>
                                {musicOptions.map(option => (
                                    <SelectItem key={option.id} value={option.id.toString()}>{option.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <ClickableTooltip content="This song will be used as the podcast background music." />
                    </div>
                    {currentSample && (
                        <div className="mt-2 p-2 bg-gray-800 rounded">
                            <div className="flex items-center justify-between">
                                <button onClick={togglePlay} type="button" className="p-1 bg-primary text-primary-foreground rounded">
                                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                                </button>
                                <div className="text-sm text-gray-300">
                                    <span className="font-semibold">{currentSample.tags}</span> by{' '}
                                    <a href={currentSample.attribution} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        {currentSample.author}
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block mb-1">Include Weather Information For</label>
                    <div className="flex items-center">
                        <Select
                            name="weatherInfo"
                            value={settings.weatherInfo}
                            onValueChange={(value) => handleInputChange({ target: { name: 'weatherInfo', value } })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select weather info frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Never">Never</SelectItem>
                                <SelectItem value="Today">Today</SelectItem>
                                <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                                <SelectItem value="Next Week">Next Week</SelectItem>
                            </SelectContent>
                        </Select>
                        <ClickableTooltip content="The podcast presenters will comment on the weather of the selected period starting from the date of the podcast generation." />
                    </div>
                </div>

                <Button type="submit" className="w-full">Save Settings</Button>
            </form>

            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Settings Saved</DialogTitle>
                        <DialogDescription>
                            Your podcast settings have been successfully saved.
                        </DialogDescription>
                    </DialogHeader>
                    <Button onClick={() => setShowConfirmation(false)}>OK</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PodcastSettings;