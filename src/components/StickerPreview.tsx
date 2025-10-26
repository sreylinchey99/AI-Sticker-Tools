import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Share2, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface StickerPreviewProps {
  isGenerating: boolean;
  stickerPack: string[];
  onDownload: () => void;
  onShare: () => void;
  selectedStyle: string;
  selectedQuantity: number;
}

export const StickerPreview: React.FC<StickerPreviewProps> = ({
  isGenerating,
  stickerPack,
  onDownload,
  onShare,
  selectedStyle,
  selectedQuantity,
}) => {
  const [downloading, setDownloading] = useState(false);

  // helper: fetch a url and trigger a download with a filename
  const downloadBlob = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('downloadBlob error:', err);
      // fallback: open the image in a new tab
      window.open(url, '_blank');
    }
  };

  // helper: attempt to save to gallery using Web Share API (files) when available,
  // otherwise fallback to a normal download
  const shareOrSaveToGallery = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      // create a File for the share API
      // @ts-ignore
      const file = new File([blob], filename, { type: blob.type });

      // prefer native share if supported and canShare files
      // @ts-ignore
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        // @ts-ignore
        await navigator.share({ files: [file], title: filename, text: 'My sticker' });
        return;
      }

      // fallback to downloading the file
      await downloadBlob(url, filename);
    } catch (err) {
      console.error('shareOrSaveToGallery error:', err);
      await downloadBlob(url, filename);
    }
  };

  const downloadAll = async () => {
    if (!stickerPack || stickerPack.length === 0) return;
    setDownloading(true);
    try {
      // download sequentially to reduce simultaneous connections and UI churn
      for (let i = 0; i < stickerPack.length; i++) {
        const url = stickerPack[i];
        const filename = `sticker-${i + 1}.png`;
        // wait for each download to complete (fetch+trigger)
        // don't block too long in case of many images; this is a simple strategy
        // for zipping, consider adding JSZip as a dependency later.
        // eslint-disable-next-line no-await-in-loop
        await downloadBlob(url, filename);
      }
    } finally {
      setDownloading(false);
    }
  };
  if (isGenerating) {
    return (
      <Card className="p-8 text-center space-y-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="space-y-4">
          <div className="relative">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-bounce-cute">
              <Sparkles className="h-8 w-8 text-primary-foreground animate-glow-pulse" />
            </div>
            <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-primary rounded-full opacity-20 animate-ping" />
          </div>
          
          <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Creating Your Stickers...
          </h3>
          
          <p className="text-muted-foreground max-w-md mx-auto">
            Our AI is working its magic to transform your photo into adorable {selectedStyle} style stickers!
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-center space-x-1">
              {Array.from({ length: selectedQuantity }).map((_, index) => (
                <div
                  key={index}
                  className="w-3 h-3 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: `${index * 0.2}s` }}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Generating {selectedQuantity} unique stickers...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (stickerPack.length === 0) {
    return (
      <Card className="p-8 text-center space-y-4 bg-muted/30">
        <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-muted-foreground">
          Your stickers will appear here
        </h3>
        <p className="text-sm text-muted-foreground">
          Complete the steps above to generate your custom sticker pack
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-cute bg-clip-text text-transparent">
          Your Sticker Pack is Ready! 🎉
        </h2>
        <Badge variant="secondary" className="bg-gradient-accent text-foreground font-bold">
          {selectedQuantity} {selectedStyle} stickers
        </Badge>
      </div>
      
      <Card className="p-6 bg-gradient-to-br from-card to-muted/20">
        <div className={`
          grid gap-4
          ${selectedQuantity === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'}
        `}>
          {stickerPack.map((sticker, index) => (
            <div
              key={index}
              className="w-full h-full min-h-[200px] bg-white rounded-2xl border-4 border-primary/20 shadow-soft hover:shadow-cute transition-all duration-300 hover:scale-105 overflow-hidden group relative flex items-center justify-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={sticker}
                alt={`Sticker ${index + 1}`}
                className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                style={{ width: '100%', height: '100%' }}
              />

              {/* Overlay controls: download / save to gallery */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                  type="button"
                  onClick={async () => {
                    const filename = `sticker-${index + 1}.png`;
                    await downloadBlob(sticker, filename);
                  }}
                  className="inline-flex items-center px-3 py-2 rounded-md bg-white/90 text-sm shadow-sm hover:bg-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    const filename = `sticker-${index + 1}.png`;
                    await shareOrSaveToGallery(sticker, filename);
                  }}
                  className="inline-flex items-center px-3 py-2 rounded-md bg-white/90 text-sm shadow-sm hover:bg-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {/* <Button
          variant="cute"
          size="lg"
          onClick={downloadAll}
          className="flex-1 sm:flex-none"
          disabled={downloading}
        >
          {downloading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="h-5 w-5 mr-2" />
              Download Pack
            </>
          )}
        </Button> */}
        {/*
        <Button
          variant="kawaii"
          size="lg"
          onClick={onShare}
          className="flex-1 sm:flex-none"
          disabled
        >
          <Share2 className="h-5 w-5 mr-2" />
          Share Stickers
        </Button>
        */}
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Download your awesome generated image here!
        </p>
        <div className="flex justify-center space-x-2">
          {['📱', '✨', "🫧", "🌸", "💫"].map((emoji, index) => (
            <span key={index} className="text-lg animate-float" style={{ animationDelay: `${index * 0.3}s` }}>
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};