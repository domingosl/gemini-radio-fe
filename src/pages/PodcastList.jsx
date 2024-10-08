import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {Loader2, PlusCircle} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePodcastStore } from '@/store/podcastStore';
import apiClient from "@/helpers/api-client.js";
import { formatDistanceToNow } from 'date-fns';

const truncateWords = (text, maxWords) => {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
};

const PodcastCard = ({ podcast }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <Card className="hover:bg-accent transition">
            <CardContent className="flex p-4">
                <div className="w-32 h-32 mr-4 relative flex-shrink-0">
                    {!imageLoaded && (
                        <Skeleton className="w-full h-full rounded absolute top-0 left-0" />
                    )}
                    <div
                        className="w-full h-full rounded bg-center bg-cover bg-no-repeat"
                        style={{
                            backgroundImage: `url(${podcast.imageURL})`,
                            display: imageLoaded ? 'block' : 'none'
                        }}
                    />
                    <img
                        src={podcast.imageURL}
                        alt={podcast.title}
                        className="hidden"
                        onLoad={() => setImageLoaded(true)}
                    />
                </div>
                <div className="flex flex-col justify-between flex-grow">
                    <div>
                        <CardTitle className="text-lg mb-2 line-clamp-2 overflow-hidden">
                            {podcast.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2 overflow-hidden">
                            {podcast.synopsis}
                        </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{formatDistanceToNow(new Date(podcast.date), { addSuffix: true })}</p>
                </div>
            </CardContent>
        </Card>
    );
};

const PodcastList = () => {
    const { podcasts, playPodcast, setPodcasts } = usePodcastStore();
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        apiClient.getPodcasts().then(
            (pods)=> {
                setPodcasts(pods)
                setIsLoading(false)
            }
        )
    }, []);

    if(isLoading)
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto"/>
                </div>
            </div>
        )

    if (!isLoading && podcasts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-muted-foreground mb-4">No podcasts available</p>
                <Link to="/new-podcast">
                    <Button variant="outline" size="lg">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Podcast
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Podcasts episodes</h1>
                <Link to="/new-podcast">
                    <Button variant="outline" size="icon">
                        <PlusCircle className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
            <div className="space-y-2">
                {podcasts.map((podcast, index) => (
                    <Link
                        key={podcast.id}
                        to={`/player/${podcast.id}`}
                        onClick={() => playPodcast(podcast.id)}
                        className="block mb-2 animate__animated animate__fadeInRight animate__very-fast"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <PodcastCard podcast={podcast} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PodcastList;