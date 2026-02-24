"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Send, Play, Pause, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
    onSend: (audioBlob: Blob) => void;
    onCancel: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSend, onCancel }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingDuration(0);

            timerRef.current = setInterval(() => {
                setRecordingDuration(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Could not access microphone. Please check permissions.');
            onCancel();
        }
    };

    useEffect(() => {
        startRecording();
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const handleTogglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-2 w-full bg-slate-100 p-2 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
            {isRecording ? (
                <>
                    <div className="flex items-center gap-2 flex-1 px-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm font-mono text-gray-700">{formatTime(recordingDuration)}</span>
                        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-red-400 animate-[shimmer_2s_infinite]" style={{ width: '100%' }} />
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onCancel} className="text-gray-500 hover:text-red-600">
                        <Trash2 className="h-5 w-5" />
                    </Button>
                    <Button size="icon" onClick={stopRecording} className="bg-red-500 hover:bg-red-600 rounded-full h-10 w-10">
                        <Square className="h-4 w-4 fill-white" />
                    </Button>
                </>
            ) : audioUrl ? (
                <>
                    <div className="flex items-center gap-3 flex-1 px-2">
                        <Button variant="ghost" size="icon" onClick={handleTogglePlay} className="h-8 w-8 text-blue-600">
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>
                        <div className="flex-1 text-sm text-gray-600 font-medium">
                            Voice message ({formatTime(recordingDuration)})
                        </div>
                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            onEnded={handleAudioEnded}
                            onPause={() => setIsPlaying(false)}
                            onPlay={() => setIsPlaying(true)}
                            className="hidden"
                        />
                    </div>
                    <Button variant="ghost" size="icon" onClick={onCancel} className="text-gray-500 hover:text-red-600">
                        <Trash2 className="h-5 w-5" />
                    </Button>
                    <Button
                        size="icon"
                        onClick={() => audioBlob && onSend(audioBlob)}
                        className="bg-blue-600 hover:bg-blue-700 rounded-full h-10 w-10"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </>
            ) : (
                <div className="flex items-center justify-center flex-1 py-1 italic text-gray-400 text-sm">
                    Preparing recorder...
                </div>
            )}
        </div>
    );
};
