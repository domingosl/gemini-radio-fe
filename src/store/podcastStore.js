import { create } from 'zustand'

export const usePodcastStore = create((set, get) => ({
    podcasts: [],
    currentPodcast: null,
    isPlaying: false,
    audioRef: null,
    setCurrentPodcast: (id) => set(state => ({
        currentPodcast: state.podcasts.find(p => p.id === id)
    })),
    setPodcasts: podcasts => set({ podcasts }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setAudioRef: (audioRef) => set({ audioRef }),
    playPodcast: (id) => {
        const { audioRef, currentPodcast } = get();
        if (audioRef) {
            audioRef.pause();
        }
        set(state => ({
            currentPodcast: state.podcasts.find(p => p.id === id),
            isPlaying: true
        }));
    },
    stopPlayback: () => {
        const { audioRef } = get();
        if (audioRef) {
            audioRef.pause();
        }
        set({ isPlaying: false });
    }
}));