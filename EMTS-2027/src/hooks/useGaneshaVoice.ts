import { useCallback, useEffect, useRef, useState } from 'react';
import type { GaneshaState } from '@/components/Ganesha/GaneshaOrb';

export type LanguagePreference = 'auto' | 'en' | 'hi';

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

interface UseGaneshaVoiceOptions {
  language: LanguagePreference;
  muted: boolean;
  onTranscript: (text: string) => void;
  onError: (message: string) => void;
}

export function useGaneshaVoice({
  language,
  muted,
  onTranscript,
  onError,
}: UseGaneshaVoiceOptions) {
  const [voiceState, setVoiceState] = useState<GaneshaState>('idle');
  const [interimText, setInterimText] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastSpokenTextRef = useRef<{ text: string; lang: string }>({
    text: '',
    lang: 'en',
  });

  const stopMeter = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const startMicMeter = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) return null;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamRef.current = stream;

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i += 1) sum += data[i];
        const avg = sum / data.length / 255;
        setAudioLevel(avg);
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    }
    return stream;
  }, []);

  const stopSpeaking = useCallback(() => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
      activeAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setVoiceState((prev) => (prev === 'speaking' ? 'idle' : prev));
  }, []);

  const speakWithBrowserTts = useCallback(
    (text: string, detectedLang: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setVoiceState('idle');
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const wantHindi =
        detectedLang === 'hi-devanagari' ||
        detectedLang === 'hi' ||
        (language === 'hi' && detectedLang !== 'en');

      const preferredVoice = wantHindi
        ? voices.find((v) => v.lang.toLowerCase().startsWith('hi')) ||
          voices.find((v) => v.lang.toLowerCase() === 'en-in')
        : voices.find((v) => v.lang.toLowerCase() === 'en-in') ||
          voices.find((v) => v.lang.toLowerCase().startsWith('en'));

      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.lang = wantHindi ? 'hi-IN' : 'en-IN';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setAutoplayBlocked(false);
        setVoiceState('speaking');
      };
      utterance.onend = () => setVoiceState('idle');
      utterance.onerror = () => {
        setVoiceState('idle');
      };

      try {
        setVoiceState('speaking');
        window.speechSynthesis.speak(utterance);
      } catch {
        setAutoplayBlocked(true);
        setVoiceState('idle');
      }
    },
    [language]
  );

  const speak = useCallback(
    async (text: string, detectedLang = 'en') => {
      lastSpokenTextRef.current = { text, lang: detectedLang };
      if (muted || !text.trim()) return;

      stopSpeaking();

      try {
        const res = await fetch('/api/ganesha/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, language: detectedLang }),
        });

        const contentType = res.headers.get('Content-Type') || '';
        if (res.ok && contentType.includes('audio/')) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          activeAudioRef.current = audio;
          setVoiceState('speaking');
          audio.onended = () => {
            URL.revokeObjectURL(url);
            activeAudioRef.current = null;
            setVoiceState('idle');
          };
          audio.onerror = () => {
            URL.revokeObjectURL(url);
            activeAudioRef.current = null;
            speakWithBrowserTts(text, detectedLang);
          };
          try {
            await audio.play();
            setAutoplayBlocked(false);
          } catch {
            setAutoplayBlocked(true);
            setVoiceState('idle');
          }
          return;
        }
      } catch {
        // Fallback smoothly to browser SpeechSynthesis
      }

      speakWithBrowserTts(text, detectedLang);
    },
    [muted, speakWithBrowserTts, stopSpeaking]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop race
      }
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    stopMeter();
    setInterimText('');
    setVoiceState((prev) => (prev === 'listening' ? 'idle' : prev));
  }, [stopMeter]);

  const startListening = useCallback(async () => {
    stopSpeaking();

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRec) {
      try {
        await startMicMeter();
      } catch {
        onError('Microphone access was denied. Please allow microphone permissions or type your question.');
        return;
      }

      const recognition = new SpeechRec();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      setVoiceState('listening');
      setInterimText('');

      let finalTranscript = '';
      recognition.onresult = (event) => {
        let interim = '';
        for (let i = 0; i < event.results.length; i += 1) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interim += result[0].transcript;
          }
        }
        setInterimText(interim || finalTranscript);
      };

      recognition.onerror = (event) => {
        stopMeter();
        setVoiceState('idle');
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
          onError(`Speech recognition error (${event.error}). You can type your question below.`);
        }
      };

      recognition.onend = () => {
        stopMeter();
        recognitionRef.current = null;
        setVoiceState('idle');
        const cleaned = finalTranscript.trim();
        setInterimText('');
        if (cleaned) {
          onTranscript(cleaned);
        }
      };

      recognition.start();
      return;
    }

    // Fallback: MediaRecorder -> /api/ganesha/stt (OpenAI Whisper when configured)
    try {
      const stream = await startMicMeter();
      if (!stream || typeof MediaRecorder === 'undefined') {
        onError('Voice input is not supported in this browser. Please type your question below.');
        return;
      }

      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      setVoiceState('listening');

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        stopMeter();
        setVoiceState('thinking');
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const dataUrl = String(reader.result || '');
          const base64 = dataUrl.split(',')[1] || '';
          try {
            const res = await fetch('/api/ganesha/stt', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64, mimeType: blob.type }),
            });
            const data = await res.json();
            setVoiceState('idle');
            if (res.ok && data.transcript) {
              onTranscript(data.transcript);
            } else {
              onError(
                data.message ||
                  'Browser speech recognition unavailable and Whisper STT requires OPENAI_API_KEY in .env.'
              );
            }
          } catch {
            setVoiceState('idle');
            onError('Unable to transcribe audio. Please type your question below.');
          }
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();
    } catch {
      stopMeter();
      setVoiceState('idle');
      onError('Microphone permission is required for voice input.');
    }
  }, [language, onError, onTranscript, startMicMeter, stopMeter, stopSpeaking]);

  const replayLast = useCallback(() => {
    const { text, lang } = lastSpokenTextRef.current;
    if (text) {
      speak(text, lang);
    }
  }, [speak]);

  useEffect(() => {
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, [stopListening, stopSpeaking]);

  return {
    voiceState,
    setVoiceState,
    interimText,
    audioLevel,
    autoplayBlocked,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    replayLast,
  };
}

