import React, { useState, useEffect } from 'react';
import apiClient from '@/helpers/api-client';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from 'lucide-react';

const ScanningProcess = ({ images, onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState([]);
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        const scanImages = async () => {
            const totalImages = images.length;
            let processedImages = 0;

            const updatedResults = await Promise.all(images.map(async (image, index) => {
                try {
                    const result = await apiClient.scanLetter(image);
                    processedImages++;
                    setProgress((processedImages / totalImages) * 100);
                    return { ...result, image };
                } catch (error) {
                    processedImages++;
                    setProgress((processedImages / totalImages) * 100);
                    return { error: error.message || "API call failed", image };
                }
            }));

            setResults(updatedResults);
            setIsScanning(false);
        };

        scanImages();
    }, [images]);

    const handleTextChange = (index, newText) => {
        const newResults = [...results];
        newResults[index].text = newText;
        setResults(newResults);
    };

    const handleComplete = () => {
        onComplete(results.map(r => r.text).filter(Boolean));
    };

    if (isScanning) {
        return (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-card p-6 rounded-lg shadow-lg w-80">
                    <h2 className="text-xl font-semibold mb-4">Scanning Documents</h2>
                    <Progress value={progress} className="w-full mb-4" />
                    <p className="text-sm text-muted-foreground">Please wait while we process your documents.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-2xl font-bold">Scanned Documents</h2>
            {results.map((result, index) => (
                <div key={index} className={`p-4 rounded-lg ${result.error ? 'bg-destructive/10' : 'bg-card'} border border-border`}>
                    <div className="flex items-start space-x-4">
                        <img src={result.image} alt={`Document ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-grow">
                            <h3 className="font-semibold mb-2">Document {index + 1}</h3>
                            {result.error ? (
                                <div className="flex items-center text-destructive">
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    <p>{result.error}</p>
                                </div>
                            ) : (
                                <Textarea
                                    value={result.text}
                                    onChange={(e) => handleTextChange(index, e.target.value)}
                                    rows={4}
                                    className="w-full"
                                />
                            )}
                        </div>
                    </div>
                </div>
            ))}
            <Button onClick={handleComplete} className="w-full">Generate Podcast</Button>
        </div>
    );
};

export default ScanningProcess;