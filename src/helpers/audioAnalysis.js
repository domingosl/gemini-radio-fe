export const analyzeAudio = async (url) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const channelData = audioBuffer.getChannelData(0);
    const samples = 500; // Number of samples for the waveform
    const blockSize = Math.floor(channelData.length / samples);
    const waveform = [];

    for (let i = 0; i < samples; i++) {
        let blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(channelData[blockStart + j]);
        }
        waveform.push(sum / blockSize);
    }

    // Normalize the waveform
    const multiplier = Math.pow(Math.max(...waveform), -1);
    return waveform.map(n => n * multiplier);
};