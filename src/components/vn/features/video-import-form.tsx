"use client";
// @ts-nocheck

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Select } from '@/components/vn/ui/select';
import { Button } from '@/components/vn/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/vn/ui/card';
import { Video } from '@/types/virality-nexus';

// Mock creators data (replaced hooks)
const mockCreators = [
  { id: '1', name: 'Creator One' },
  { id: '2', name: 'Creator Two' },
  { id: '3', name: 'Creator Three' },
];

interface VideoImportFormProps {
  onSuccess?: (videos: Video[]) => void;
}

export function VideoImportForm({ onSuccess }: VideoImportFormProps) {
  const router = useRouter();
  const creators = mockCreators;
  const loadingCreators = false;

  const [urlsText, setUrlsText] = useState('');
  const [selectedCreatorId, setSelectedCreatorId] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrapedVideos, setScrapedVideos] = useState<Video[]>([]);

  const creatorOptions = creators.map(creator => ({
    value: creator.id,
    label: creator.name,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccess(false);

    // Validate creator selection
    if (!selectedCreatorId) {
      setValidationError('Please select a creator');
      return;
    }

    // Parse URLs from textarea
    const urls = urlsText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urls.length === 0) {
      setValidationError('Please enter at least one video URL');
      return;
    }

    // Validate URL format
    const invalidUrls = urls.filter(url => {
      try {
        new URL(url);
        return false;
      } catch {
        return true;
      }
    });

    if (invalidUrls.length > 0) {
      setValidationError(`Invalid URL format: ${invalidUrls[0]}`);
      return;
    }

    // Mock scrape
    setScraping(true);
    setError(null);
    try {
      // Simulate scraping delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockVideos: Video[] = urls.map((url, i) => ({
        id: `mock-${i}`,
        title: `Imported Video ${i + 1}`,
        url,
        platform: url.includes('instagram') ? 'instagram' : 'tiktok',
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        creator_id: selectedCreatorId,
      }));
      setScrapedVideos(mockVideos);
      setSuccess(true);
      onSuccess?.(mockVideos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scrape videos');
    } finally {
      setScraping(false);
    }
  };

  const urlCount = urlsText
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0).length;

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-orange-400" />
            Import Videos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Creator Selection */}
          <Select
            label="Creator"
            placeholder="Select a creator..."
            options={creatorOptions}
            value={selectedCreatorId}
            onChange={(e) => setSelectedCreatorId(e.target.value)}
            disabled={loadingCreators || scraping}
          />

          {/* URL Input */}
          <div className="w-full">
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Video URLs
            </label>
            <textarea
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 min-h-[200px] resize-none font-mono text-sm"
              placeholder={`Paste video URLs here (one per line):\n\nhttps://www.instagram.com/reel/ABC123...\nhttps://www.tiktok.com/@user/video/123456...`}
              value={urlsText}
              onChange={(e) => setUrlsText(e.target.value)}
              disabled={scraping}
            />
            <div className="flex justify-between mt-2">
              <p className="text-xs text-zinc-500">
                Supports Instagram Reels and TikTok videos
              </p>
              <p className="text-xs text-zinc-400">
                {urlCount} URL{urlCount !== 1 ? 's' : ''} entered
              </p>
            </div>
          </div>

          {/* Progress/Status */}
          {scraping && (
            <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
              <div>
                <p className="text-sm font-medium text-zinc-100">
                  Scraping videos...
                </p>
                <p className="text-xs text-zinc-500">
                  This may take a moment depending on the number of URLs
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {(validationError || error) && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-400">Error</p>
                <p className="text-sm text-red-300/80">
                  {validationError || error}
                </p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && scrapedVideos.length > 0 && (
            <div className="flex items-start gap-3 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-400">
                  Successfully imported {scrapedVideos.length} video{scrapedVideos.length !== 1 ? 's' : ''}!
                </p>
                <p className="text-sm text-emerald-300/80">
                  Videos have been added to the database and are now visible in the Videos section.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={scraping}
          >
            Cancel
          </Button>
          <div className="flex gap-3">
            {success && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/videos')}
              >
                View Videos
              </Button>
            )}
            <Button
              type="submit"
              loading={scraping}
              disabled={scraping || urlCount === 0 || !selectedCreatorId}
            >
              Import {urlCount > 0 ? `${urlCount} Video${urlCount !== 1 ? 's' : ''}` : 'Videos'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
