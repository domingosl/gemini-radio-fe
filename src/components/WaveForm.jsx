import React from 'react';

const WaveForm = ({ waveform, progress, duration }) => {
    const progressPercentage = (progress / duration) * 100;

    return (
        <svg width="100%" height="100%" className="absolute top-0 left-0">
            {waveform.map((amplitude, i) => {
                const height = amplitude * 70; // Increased scale for better visibility
                return (
                    <rect
                        key={i}
                        x={`${(i / waveform.length) * 100}%`}
                        y={`${90 - height}%`} // This makes the bar grow upwards
                        width={`${100 / waveform.length}%`}
                        height={`${height}%`}
                        fill={(i / waveform.length) * 100 <= progressPercentage ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)'}
                    />
                );
            })}
        </svg>
    );
};

export default WaveForm;