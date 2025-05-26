import React, { useState, useRef, useEffect, useCallback } from 'react';
import Button from '../components/common/Button';

// Interfaces
interface EmotionData {
    [key: string]: number;
}
interface EmotionAnalysisResponse {
    dominant_emotion: string;
    emotions: EmotionData;
}
interface Task {
    id: string;
    description: string;
    associated_emotions: string[];
    created_at: string;
}
// Updated interface to expect a list of tasks
interface TaskSuggestionResponse {
    suggested_tasks: Task[]; // Changed from suggested_task: Task | null
    message: string;
}

const ANALYSIS_DURATION = 10000; // 10 seconds
const FRAME_CAPTURE_INTERVAL = 500; // Capture a frame every 1 second

const AnalyzeEmotionPage: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [emotionResponse, setEmotionResponse] = useState<EmotionAnalysisResponse | null>(null);
    const [isLoadingFrameAnalysis, setIsLoadingFrameAnalysis] = useState<boolean>(false); // For single frame
    const [isLoadingPeriodAnalysis, setIsLoadingPeriodAnalysis] = useState<boolean>(false); // For 10s period
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isVideoReady, setIsVideoReady] = useState<boolean>(false);

    // Updated state to hold a list of tasks and the message
    const [suggestedTasksList, setSuggestedTasksList] = useState<Task[]>([]);
    const [suggestionMessage, setSuggestionMessage] = useState<string>('');

    const [isAnalyzingPeriodActive, setIsAnalyzingPeriodActive] = useState<boolean>(false);
    const collectedEmotionDataRef = useRef<string[]>([]);
    const analysisIntervalRef = useRef<number | null>(null);
    const analysisTimeoutRef = useRef<number | null>(null);
    const [analysisCountdown, setAnalysisCountdown] = useState<number>(0);
    const [analysisModeUsed, setAnalysisModeUsed] = useState<'single' | 'period' | null>(null);
    const [periodAnalysisSummary, setPeriodAnalysisSummary] = useState<{ [key: string]: number } | null>(null);

    const clearAnalysisState = () => {
        setEmotionResponse(null);
        setSuggestedTasksList([]);
        setSuggestionMessage('');
        setAnalysisError(null);
        setAnalysisModeUsed(null);
        setPeriodAnalysisSummary(null);
    };

    const startCamera = useCallback(async () => {
        clearAnalysisState();
        setCameraError(null);
        setIsVideoReady(false);
        setIsAnalyzingPeriodActive(false);
        collectedEmotionDataRef.current = [];
        setAnalysisCountdown(0);
        if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
        if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);

        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        try {
            const newStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
            setStream(newStream);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setCameraError("Could not access camera. Please ensure permissions are granted.");
            setStream(null);
        }
    }, [stream]);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => {
                console.error("Video play error:", err);
                setCameraError("Could not automatically play video.");
            });
        } else if (videoRef.current && !stream) {
            videoRef.current.srcObject = null;
        }
        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
            if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
        };
    }, [stream]);

    const stopCameraAndAnalysis = () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
        setStream(null); 
        setIsVideoReady(false); 
        clearAnalysisState(); // Resets emotionResponse, suggestedTasksList, suggestionMessage, analysisError, analysisModeUsed, periodAnalysisSummary
        setIsAnalyzingPeriodActive(false); 
        setIsLoadingFrameAnalysis(false); // Ensure this is reset
        setIsLoadingPeriodAnalysis(false); // Ensure this is reset
        collectedEmotionDataRef.current = []; 
        setAnalysisCountdown(0);
        if (analysisIntervalRef.current) {
            clearInterval(analysisIntervalRef.current);
            analysisIntervalRef.current = null;
        }
        if (analysisTimeoutRef.current) {
            clearTimeout(analysisTimeoutRef.current);
            analysisTimeoutRef.current = null;
        }
    };

    const fetchTaskSuggestionsList = async (emotion: string) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/tasks/suggestion?emotion=${emotion.toLowerCase()}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to fetch task suggestions.');
            }
            const data: TaskSuggestionResponse = await response.json();
            setSuggestedTasksList(data.suggested_tasks || []);
            setSuggestionMessage(data.message || '');
        } catch (err) {
            console.error("Failed to fetch task suggestions:", err);
            setSuggestedTasksList([]);
            setSuggestionMessage(err instanceof Error ? err.message : "Could not fetch task suggestions.");
        }
    };

    const captureSingleFrameAndAnalyze = async () => {
        if (!videoRef.current || !canvasRef.current || !stream || !isVideoReady) {
            setAnalysisError("Camera/stream not ready for single frame analysis.");
            return;
        }
        setIsLoadingFrameAnalysis(true); clearAnalysisState();
        const video = videoRef.current; const canvas = canvasRef.current;
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (!context) { setAnalysisError("No canvas context."); setIsLoadingFrameAnalysis(false); return; }
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            if (!blob) { setAnalysisError("Frame capture failed."); setIsLoadingFrameAnalysis(false); return; }
            const formData = new FormData(); formData.append('image_file', blob, 'frame.png');
            try {
                const response = await fetch('http://localhost:8000/api/v1/analyze_face_emotion', { method: 'POST', body: formData });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Single frame analysis error.');
                }
                const data: EmotionAnalysisResponse = await response.json();
                setEmotionResponse(data); // This contains all emotion scores
                setAnalysisModeUsed('single'); // Set mode
                if (data.dominant_emotion) {
                    await fetchTaskSuggestionsList(data.dominant_emotion);
                }
            } catch (err) { setAnalysisError(err instanceof Error ? err.message : 'Analysis error.'); }
            finally { setIsLoadingFrameAnalysis(false); }
        }, 'image/png');
    };

    const captureAndSendFrameForPeriod = async () => { // Renamed for clarity
        if (!videoRef.current || !canvasRef.current || !stream || !isVideoReady) { return; }
        const video = videoRef.current; const canvas = canvasRef.current;
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (!context) { return; }
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
            if (!blob) { return; }
            const formData = new FormData(); formData.append('image_file', blob, 'frame.png');
            try {
                const response = await fetch('http://localhost:8000/api/v1/analyze_face_emotion', { method: 'POST', body: formData });
                if (response.ok) {
                    const data: EmotionAnalysisResponse = await response.json();
                    if (data.dominant_emotion) {
                        collectedEmotionDataRef.current.push(data.dominant_emotion);
                    }
                }
            } catch (err) { console.error('Error sending frame during period analysis:', err); }
        }, 'image/png');
    };

    const processCollectedEmotions = () => {
        setIsLoadingPeriodAnalysis(false);
        setIsAnalyzingPeriodActive(false);
        setAnalysisCountdown(0);
        const currentCollectedData = collectedEmotionDataRef.current;
        if (currentCollectedData.length === 0) {
            setAnalysisError("No emotion data collected during the 10-second analysis period.");
            clearAnalysisState(); // Clear everything
            collectedEmotionDataRef.current = [];
            return;
        }
        const emotionCounts: { [key: string]: number } = {};
        currentCollectedData.forEach(emotion => { emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1; });

        setPeriodAnalysisSummary(emotionCounts); // Store the frequency counts

        let overallDominantEmotion = "neutral"; let maxCount = 0;
        for (const emotion in emotionCounts) {
            if (emotionCounts[emotion] > maxCount) { maxCount = emotionCounts[emotion]; overallDominantEmotion = emotion; }
        }
        // For period analysis, emotionResponse will only store the overall dominant emotion
        // The detailed scores (frequencies) are in periodAnalysisSummary
        setEmotionResponse({ dominant_emotion: overallDominantEmotion, emotions: {} }); // emotions can be empty or just {overallDominantEmotion: 100}
        setAnalysisModeUsed('period'); // Set mode
        fetchTaskSuggestionsList(overallDominantEmotion);
        collectedEmotionDataRef.current = [];
    };

    const startAnalysisPeriod = () => {
        if (!stream || !isVideoReady) { setCameraError("Please start camera first."); return; }
        setIsAnalyzingPeriodActive(true); setIsLoadingPeriodAnalysis(true); clearAnalysisState();
        collectedEmotionDataRef.current = [];
        setAnalysisCountdown(ANALYSIS_DURATION / 1000);
        analysisIntervalRef.current = window.setInterval(() => { // Use window.setInterval for browser
            captureAndSendFrameForPeriod();
            setAnalysisCountdown(prev => Math.max(0, prev - (FRAME_CAPTURE_INTERVAL / 1000)));
        }, FRAME_CAPTURE_INTERVAL);
        analysisTimeoutRef.current = window.setTimeout(() => { // Use window.setTimeout
            if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
            processCollectedEmotions();
        }, ANALYSIS_DURATION);
    };

    return (
        <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl w-full max-w-2xl flex flex-col items-center animate-fadeIn">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-sky-400">TaskNova Facial Emotion Analyzer</h1>
            <div className="w-full mb-4 p-4 border border-gray-700 rounded-md bg-gray-850 text-center">
                {!stream && (<Button onClick={startCamera} variant="primary" className="w-full sm:w-auto px-6">Start Camera</Button>)}
                {stream && !isAnalyzingPeriodActive && (<p className="text-green-400 mb-2">Camera is ON. Choose an analysis mode.</p>)}
                {isAnalyzingPeriodActive && (<p className="text-yellow-400 animate-pulse">Continuous analysis in progress... {analysisCountdown}s</p>)}
                {cameraError && <p className="text-red-400 mt-2 text-center">{cameraError}</p>}
            </div>

            {stream && (
                <div className="w-full space-y-4">
                    <div className="relative w-full aspect-video bg-gray-700 rounded-md overflow-hidden">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" onLoadedMetadata={() => setIsVideoReady(true)} />
                        {!isVideoReady && stream && <p className="absolute inset-0 flex items-center justify-center text-yellow-400">Waiting for video...</p>}
                        <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button onClick={captureSingleFrameAndAnalyze} variant="secondary" className="w-full" disabled={!isVideoReady || isLoadingFrameAnalysis || isLoadingPeriodAnalysis || isAnalyzingPeriodActive}>
                            {isLoadingFrameAnalysis ? 'Analyzing Frame...' : 'Analyze Single Frame'}
                        </Button>
                        <Button onClick={startAnalysisPeriod} variant="primary" className="w-full" disabled={!isVideoReady || isLoadingFrameAnalysis || isLoadingPeriodAnalysis || isAnalyzingPeriodActive}>
                            {isLoadingPeriodAnalysis ? `Analyzing (${analysisCountdown}s)` : 'Start 10-Sec Analysis'}
                        </Button>
                    </div>
                    <Button onClick={stopCameraAndAnalysis} variant="danger" className="w-full mt-2">Stop Camera & Reset</Button>
                </div>
            )}

            {analysisError && <div className="w-full mt-4 p-3 bg-red-700 bg-opacity-50 text-red-300 rounded-md"><p>{analysisError}</p></div>}

            {emotionResponse && !isAnalyzingPeriodActive && (
                <div className="w-full mt-6 p-4 bg-gray-700 rounded-md space-y-3">
                    <h2 className="text-xl font-semibold text-sky-300">Analysis Result:</h2>
                    <p><strong className="font-medium text-gray-300">Detected Dominant Emotion:</strong> <span className="font-bold text-xl text-yellow-400">{emotionResponse.dominant_emotion}</span></p>

                    {analysisModeUsed === 'single' && emotionResponse.emotions && Object.keys(emotionResponse.emotions).length > 0 && (
                        <details className="text-sm text-gray-400 cursor-pointer">
                            <summary className="font-medium hover:text-sky-300">Detailed Scores (Single Frame)</summary>
                            <ul className="list-disc list-inside pl-4 mt-1">
                                {Object.entries(emotionResponse.emotions).map(([emotion, score]) => (
                                    <li key={emotion}>{emotion.charAt(0).toUpperCase() + emotion.slice(1)}: {score.toFixed(2)}%</li>
                                ))}
                            </ul>
                        </details>
                    )}

                    {analysisModeUsed === 'period' && periodAnalysisSummary && (
                        <details className="text-sm text-gray-400 cursor-pointer">
                            <summary className="font-medium hover:text-sky-300">Emotion Frequency (10-Sec Period)</summary>
                            <ul className="list-disc list-inside pl-4 mt-1">
                                {Object.entries(periodAnalysisSummary).map(([emotion, count]) => (
                                    <li key={emotion}>{emotion.charAt(0).toUpperCase() + emotion.slice(1)}: {count} frame(s)</li>
                                ))}
                            </ul>
                        </details>
                    )}

                    <h3 className="text-lg font-semibold text-sky-300 mt-3">Suggested Tasks:</h3>
                    {suggestionMessage && !suggestedTasksList.length && <p className="text-gray-400 italic">{suggestionMessage}</p>}
                    {suggestedTasksList.length > 0 ? (
                        <ul className="list-disc list-inside pl-4 space-y-1 text-teal-300">
                            {suggestedTasksList.map(task => (
                                <li key={task.id} className="font-semibold">{task.description}</li>
                            ))}
                        </ul>
                    ) : (
                        suggestionMessage && suggestedTasksList.length === 0 ? null : <p className="text-orange-400">No specific tasks found for this emotion.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AnalyzeEmotionPage;
