"use client";
// @ts-nocheck

import { useState } from 'react';
import {
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/vn/ui/card';
import { Button } from '@/components/vn/ui/button';
import { Badge } from '@/components/vn/ui/badge';
import { Video, TranscriptStatus } from '@/types/virality-nexus';

interface ScriptSectionProps {
  video: Video;
  onTranscriptUpdate?: (transcript: string) => void;
}

/**
 * Split transcript text into sentences for better readability
 */
function splitIntoSentences(text: string): string[] {
  // Split by sentence-ending punctuation followed by space or end of string
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 0)
    .map(s => s.trim());

  return sentences;
}

export function ScriptSection({ video, onTranscriptUpdate }: ScriptSectionProps) {
  const [transcribing, setTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [localTranscript, setLocalTranscript] = useState(video.transcript || null);
  const [localStatus, setLocalStatus] = useState<TranscriptStatus>(video.transcript_status || 'pending');

  const handleTranscribe = async () => {
    setTranscribing(true);
    setError(null);

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: video.id }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Transcription failed');
      }

      setLocalTranscript(data.transcript);
      setLocalStatus('completed');
      onTranscriptUpdate?.(data.transcript);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transcription failed');
      setLocalStatus('failed');
    } finally {
      setTranscribing(false);
    }
  };

  const getStatusBadge = () => {
    switch (localStatus) {
      case 'completed':
        return <Badge variant="default" className="bg-emerald-500/20 text-emerald-400">Transcribed</Badge>;
      case 'processing':
        return <Badge variant="default" className="bg-amber-500/20 text-amber-400">Processing</Badge>;
      case 'failed':
        return <Badge variant="default" className="bg-red-500/20 text-red-400">Failed</Badge>;
      default:
        return <Badge variant="default" className="bg-zinc-500/20 text-zinc-400">Not Transcribed</Badge>;
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-zinc-400" />
          <CardTitle>Script</CardTitle>
          {getStatusBadge()}
        </div>
        {!localTranscript && localStatus !== 'processing' && video.direct_video_url && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleTranscribe}
            disabled={transcribing}
          >
            {transcribing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Transcribing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Transcribe
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {!video.direct_video_url && !localTranscript && (
          <p className="text-zinc-500 text-sm">
            No video URL available for transcription. The video needs a direct playable URL.
          </p>
        )}

        {localTranscript ? (
          <div className="space-y-4">
            <div className="relative">
              <div
                className={`space-y-3 ${
                  !showFullTranscript ? 'max-h-40 overflow-hidden' : ''
                }`}
              >
                {/* Split transcript into sentences and display as paragraphs */}
                {splitIntoSentences(localTranscript).map((sentence, index) => (
                  <p key={index} className="text-zinc-300 text-sm leading-relaxed">
                    {sentence}
                  </p>
                ))}
              </div>
              {!showFullTranscript && localTranscript.length > 300 && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zinc-900 to-transparent" />
              )}
            </div>
            {localTranscript.length > 300 && (
              <button
                onClick={() => setShowFullTranscript(!showFullTranscript)}
                className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {showFullTranscript ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show full transcript
                  </>
                )}
              </button>
            )}
          </div>
        ) : localStatus === 'processing' || transcribing ? (
          <div className="flex items-center gap-3 py-4">
            <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
            <span className="text-zinc-400">Transcribing video...</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
