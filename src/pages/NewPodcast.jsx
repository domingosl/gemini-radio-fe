import React, { useState } from 'react';
import DocumentCapture from '@/components/DocumentCapture';
import ScanningProcess from '@/components/ScanningProcess';
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PodcastGeneration from '@/components/PodcastGeneration';

const NewPodcast = () => {
    const [capturedDocuments, setCapturedDocuments] = useState([]);
    const [transcriptions, setTranscriptions] = useState([]);
    const [isCapturing, setIsCapturing] = useState(true);
    const [isScanning, setIsScanning] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPodcast, setGeneratedPodcast] = useState(null);

    const handleCapture = (imageData) => {
        setCapturedDocuments(prev => [...prev, imageData]);
    };

    const handleFinishCapture = () => {
        setIsCapturing(false);
    };

    const handleDelete = () => {
        if (deleteIndex !== null) {
            setCapturedDocuments(prev => prev.filter((_, i) => i !== deleteIndex));
            setDeleteIndex(null);
        }
    };

    const handleScanDocuments = () => {
        setIsScanning(true);
    };

    const handleScanComplete = (results) => {
        setTranscriptions(results);
        setIsScanning(false);
        setIsGenerating(true);
    };

    const handlePodcastGenerated = (podcast) => {
        setGeneratedPodcast(podcast);
        setIsGenerating(false);
    };


    if (isCapturing) {
        return (
            <div className="h-full">
                <DocumentCapture
                    onCapture={handleCapture}
                    onFinish={handleFinishCapture}
                    capturedCount={capturedDocuments.length}
                />
            </div>
        );
    }

    if (isScanning) {
        return <ScanningProcess images={capturedDocuments} onComplete={handleScanComplete} />;
    }

    if (isGenerating) {
        return <PodcastGeneration transcriptions={transcriptions} onComplete={handlePodcastGenerated} />;
    }

    if (generatedPodcast) {
        return (
            <div className="p-4 space-y-4">
                <h2 className="text-2xl font-bold">Podcast Generated</h2>
                <img src={generatedPodcast.imageURL} alt="Podcast Cover" className="w-full h-auto rounded-lg" />
                <h3 className="text-xl font-semibold">{generatedPodcast.title}</h3>
                <p className="text-sm text-muted-foreground">{generatedPodcast.synopsis}</p>
                <Button onClick={() => {/* Handle finish */}} className="w-full">
                    Listen/Download
                </Button>
            </div>
        );
    }

    return (
        <div className="h-full">
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Captured Documents ({capturedDocuments.length})</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {capturedDocuments.map((doc, index) => (
                        <div key={index} className="relative">
                            <img src={doc} alt={`Document ${index + 1}`} className="w-full h-40 object-cover rounded"/>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => setDeleteIndex(index)}
                            >
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between">
                    <Button onClick={() => setIsCapturing(true)} variant="secondary">
                        Capture More
                    </Button>
                    <Button onClick={handleScanDocuments} disabled={capturedDocuments.length === 0}>
                        Scan Documents
                    </Button>
                </div>

                <AlertDialog open={deleteIndex !== null} onOpenChange={() => setDeleteIndex(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the captured document.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default NewPodcast;