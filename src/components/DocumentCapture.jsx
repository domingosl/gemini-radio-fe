import React, { useState, useRef } from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { Camera as CameraIcon, Upload, X, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

const DocumentCapture = ({ onCapture, onFinish, capturedCount }) => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleTakePhoto = (dataUri) => {
        setCurrentImage(dataUri);
        setIsCameraOpen(false);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCurrentImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const confirmImage = () => {
        onCapture(currentImage);
        setCurrentImage(null);
    };

    const dismissImage = () => {
        setCurrentImage(null);
    };

    if (isCameraOpen) {
        return (
            <div className="fixed inset-0 z-50 bg-black" style={{ height: '100vh' }}>
                <Camera
                    onTakePhoto={handleTakePhoto}
                    isFullscreen={false}
                    idealFacingMode="environment"
                    imageType="jpg"
                    imageCompression={0.97}
                    isMaxResolution={true}
                    isSilentMode={true}
                    isDisplayStartCameraError={true}
                    sizeFactor={1}
                />
                <Button
                    onClick={() => setIsCameraOpen(false)}
                    className="absolute top-4 left-4 rounded-full"
                    variant="secondary"
                >
                    <X className="h-6 w-6" />
                </Button>
            </div>
        );
    }

    if (currentImage) {
        return (
            <div className="relative w-full h-full">
                <img src={currentImage} alt="Captured document" className="w-full h-full object-contain" />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                    <Button onClick={dismissImage} variant="secondary" size="lg" className="rounded-full">
                        <X className="h-6 w-6" />
                    </Button>
                    <Button onClick={confirmImage}  size="lg" className="rounded-full">
                        <Check className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Button onClick={() => setIsCameraOpen(true)} className="w-64 h-16 text-lg" variant="secondary">
                <CameraIcon className="mr-2 h-6 w-6" /> Capture Document
            </Button>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
            />
            <Button onClick={() => fileInputRef.current.click()} className="w-64 h-16 text-lg" variant="secondary">
                <Upload className="mr-2 h-6 w-6" /> Upload File
            </Button>
            {capturedCount > 0 && (
                <Button onClick={onFinish} className="w-64 h-16 text-lg" variant="default">
                    Finish ({capturedCount} scanned)
                </Button>
            )}
        </div>
    );
};

export default DocumentCapture;