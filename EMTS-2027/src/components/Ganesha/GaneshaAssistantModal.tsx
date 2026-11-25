import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import {
  Mic,
  MicOff,
  RotateCcw,
  Send,
  Square,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { GaneshaOrb } from './GaneshaOrb';
import { VoiceWaveform } from './VoiceWaveform';
import {
  useGaneshaVoice,
  type LanguagePreference,
} from '@/hooks/useGaneshaVoice';

export const OPENING_GREETING = "Hey! I'm Ganesha. How can I help you?";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  language?: string;
  sources?: string[];
  engine?: string;
}

interface GaneshaAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_QUESTIONS = [
  'What is ETIMS 2027?',
  'Conference kab hone wala hai?',
  'What is the registration fee for UG students?',
  'What are the eight research tracks?',
  'Is publication guaranteed?',
  'Who is the conference convenor?',
];

export function GaneshaAssistantModal({
  isOpen,
  onClose,
}: GaneshaAssistantModalProps) {
  const prefersReduced = useReducedMotion();
  const [language, setLanguage] = useState<LanguagePreference>('auto');
  const [muted, setMuted] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [engineBadge, setEngineBadge] = useState<'openai-vector-rag' | 'pdf-lexical-rag'>(
    'pdf-lexical-rag'
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const greetedForOpenRef = useRef(false);
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  const sendQuestion = useCallback(
    async (questionText: string) => {
      const cleaned = questionText.trim();
      if (!cleaned || isLoading) return;

      setErrorMsg(null);
      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: cleaned,
      };

      const historyPayload = messagesRef.current.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setInputText('');

      try {
        const res = await fetch('/api/ganesha/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: cleaned,
            history: historyPayload,
            language,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.message || 'Unable to reach Ganesha AI service.');
        }

        const assistantMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          language: data.language,
          sources: data.sources,
          engine: data.engine,
        };

        if (data.engine === 'openai-rag') {
          setEngineBadge('openai-vector-rag');
        }

        setMessages((prev) => [...prev, assistantMsg]);
        setIsLoading(false);
        await speak(data.reply, data.language || 'en');
      } catch (err) {
        setIsLoading(false);
        setErrorMsg(
          err instanceof Error
            ? err.message
            : 'Unable to contact Ganesha backend. Ensure the server is running.'
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, language]
  );

  const {
    voiceState,
    interimText,
    audioLevel,
    autoplayBlocked,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    replayLast,
  } = useGaneshaVoice({
    language,
    muted,
    onTranscript: (text) => {
      sendQuestion(text);
    },
    onError: (msg) => {
      setErrorMsg(msg);
    },
  });

  // Trigger mandatory opening greeting whenever assistant opens cleanly
  const startNewSession = useCallback(() => {
    stopListening();
    stopSpeaking();
    setErrorMsg(null);
    setMessages([
      {
        id: `greeting-${Date.now()}`,
        role: 'assistant',
        content: OPENING_GREETING,
        language: 'en',
        sources: ['Official Conference Assistant'],
      },
    ]);
    speak(OPENING_GREETING, 'en');
  }, [speak, stopListening, stopSpeaking]);

  useEffect(() => {
    if (!isOpen) {
      greetedForOpenRef.current = false;
      stopListening();
      stopSpeaking();
      return;
    }

    fetch('/api/ganesha/status')
      .then((r) => r.json())
      .then((d) => {
        if (d?.ragEngine) setEngineBadge(d.ragEngine);
      })
      .catch(() => {});

    if (!greetedForOpenRef.current) {
      greetedForOpenRef.current = true;
      startNewSession();
    }
  }, [isOpen, startNewSession, stopListening, stopSpeaking]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendQuestion(inputText);
  };

  const orbState = isLoading ? 'thinking' : voiceState;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ganesha-assistant-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            aria-hidden="true"
          />

          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: prefersReduced ? 0 : 0.24 }}
            className="relative z-10 flex h-[100dvh] w-full max-w-4xl flex-col overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white shadow-2xl sm:h-[88dvh] sm:rounded-2xl sm:border sm:border-white/15"
          >
            {/* Top Bar */}
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-3 sm:px-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-amber-500 font-serif text-xs font-bold text-white">
                    G
                  </span>
                  <h2
                    id="ganesha-assistant-title"
                    className="font-serif text-lg font-bold tracking-wide text-white sm:text-xl"
                  >
                    GANESHA
                  </h2>
                  <span className="hidden rounded-full border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/80 sm:inline-block">
                    {engineBadge === 'openai-vector-rag' ? 'OpenAI RAG' : 'PDF RAG'}
                  </span>
                </div>
                <p className="truncate text-[11px] text-slate-300 sm:text-xs">
                  Your Intelligent ETIMS 2027 Conference Assistant
                </p>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Language Selector */}
                <label htmlFor="ganesha-lang" className="sr-only">
                  Language preference
                </label>
                <select
                  id="ganesha-lang"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as LanguagePreference)}
                  className="min-h-[38px] rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs font-medium text-white focus:border-amber-300 focus:outline-none"
                >
                  <option value="auto" className="bg-slate-900 text-white">
                    Auto (EN/HI)
                  </option>
                  <option value="en" className="bg-slate-900 text-white">
                    English
                  </option>
                  <option value="hi" className="bg-slate-900 text-white">
                    Hindi / Hinglish
                  </option>
                </select>

                {/* Stop Speaking */}
                <button
                  type="button"
                  onClick={stopSpeaking}
                  disabled={voiceState !== 'speaking'}
                  aria-label="Stop voice playback"
                  title="Stop voice playback"
                  className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white transition-colors hover:bg-rose-500/30 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                </button>

                {/* Mute / Unmute */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !muted;
                    setMuted(next);
                    if (next) stopSpeaking();
                  }}
                  aria-label={muted ? 'Unmute Ganesha voice' : 'Mute Ganesha voice'}
                  title={muted ? 'Unmute voice' : 'Mute voice'}
                  className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  {muted ? (
                    <VolumeX className="h-4 w-4 text-rose-300" aria-hidden="true" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                  )}
                </button>

                {/* New Session */}
                <button
                  type="button"
                  onClick={startNewSession}
                  aria-label="Start new conversation"
                  title="New conversation"
                  className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </button>

                {/* Close */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Ganesha AI Assistant"
                  className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </header>

            {/* Central Orb + Voice Waveform */}
            <div className="border-b border-white/10 bg-white/[0.02] px-4 py-3 text-center">
              <GaneshaOrb state={orbState} audioLevel={audioLevel} />
              <VoiceWaveform state={orbState} audioLevel={audioLevel} />

              {interimText && (
                <p className="mt-1 text-xs italic text-emerald-300">
                  “{interimText}”
                </p>
              )}

              {autoplayBlocked && !muted && (
                <button
                  type="button"
                  onClick={replayLast}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-400/15 px-3 py-1 text-xs font-medium text-amber-200 hover:bg-amber-400/25"
                >
                  <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Tap to hear Ganesha&apos;s greeting</span>
                </button>
              )}

              {voiceState === 'speaking' && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-rose-400/40 bg-rose-500/20 px-3.5 py-1 text-xs font-semibold text-rose-200 hover:bg-rose-500/30"
                  >
                    <Square className="h-3 w-3 fill-current" aria-hidden="true" />
                    <span>Stop Speaking</span>
                  </button>
                </div>
              )}
            </div>

            {/* Conversation History */}
            <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:px-5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[78%] ${
                      msg.role === 'user'
                        ? 'bg-rose-800/90 text-white'
                        : 'border border-white/10 bg-white/[0.07] text-slate-100'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.content}</div>

                    {msg.role === 'assistant' && (
                      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2">
                        <div className="flex flex-wrap gap-1">
                          {msg.sources?.slice(0, 2).map((src) => (
                            <span
                              key={src}
                              className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300"
                            >
                              {src}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => speak(msg.content, msg.language || 'en')}
                          aria-label="Replay answer"
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-amber-200 hover:bg-white/10"
                        >
                          <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Replay</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-xs text-slate-300">
                    Retrieving official ETIMS 2027 brochure details...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Sample Questions */}
            <div className="border-t border-white/10 bg-white/[0.02] px-3 py-2 sm:px-5">
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {SAMPLE_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendQuestion(q)}
                    className="shrink-0 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs text-slate-200 transition-colors hover:border-amber-300/50 hover:bg-white/15"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div
                role="alert"
                className="mx-3 mb-2 rounded-lg border border-rose-400/40 bg-rose-500/15 px-3 py-2 text-xs text-rose-200 sm:mx-5"
              >
                {errorMsg}
              </div>
            )}

            {/* Input Bar: Voice Mic + Text Input */}
            <form
              onSubmit={handleFormSubmit}
              className="flex items-center gap-2 border-t border-white/10 bg-black/40 px-3 py-3 sm:px-5"
            >
              <button
                type="button"
                onClick={() =>
                  voiceState === 'listening' ? stopListening() : startListening()
                }
                aria-label={
                  voiceState === 'listening'
                    ? 'Stop listening'
                    : 'Ask Ganesha by voice'
                }
                title={
                  voiceState === 'listening'
                    ? 'Stop listening'
                    : 'Tap to speak (English / Hindi)'
                }
                className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all ${
                  voiceState === 'listening'
                    ? 'border-emerald-300 bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                    : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {voiceState === 'listening' ? (
                  <MicOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Mic className="h-5 w-5" aria-hidden="true" />
                )}
              </button>

              <label htmlFor="ganesha-text-input" className="sr-only">
                Ask Ganesha a question about ETIMS 2027
              </label>
              <input
                id="ganesha-text-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Ganesha in English, Hindi, or Hinglish..."
                className="min-h-[44px] min-w-0 flex-1 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-sm text-white placeholder:text-slate-400 focus:border-amber-300 focus:outline-none"
              />

              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                aria-label="Send message to Ganesha"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-700 text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:gap-1.5 sm:px-4"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                <span className="hidden text-sm font-semibold sm:inline">Ask</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
