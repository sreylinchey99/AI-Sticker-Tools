import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Share2, Loader2, Sparkles } from 'lucide-react';

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
          ${selectedQuantity === 4 ? 'grid-cols-2' : selectedQuantity === 6 ? 'grid-cols-3' : selectedQuantity === 8 ? 'grid-cols-4' : 'grid-cols-4 md:grid-cols-6'}
        `}>
          {stickerPack.map((sticker, index) => (
            <div
              key={index}
              className="aspect-square bg-white rounded-2xl border-4 border-primary/20 shadow-soft hover:shadow-cute transition-all duration-300 hover:scale-105 overflow-hidden group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={sticker}
                alt={`Sticker ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="cute"
          size="lg"
          onClick={onDownload}
          className="flex-1 sm:flex-none"
        >
          <Download className="h-5 w-5 mr-2" />
          Download Pack
        </Button>
        
        <Button
          variant="kawaii"
          size="lg"
          onClick={onShare}
          className="flex-1 sm:flex-none"
        >
          <Share2 className="h-5 w-5 mr-2" />
          Share Stickers
        </Button>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Perfect for WhatsApp, Telegram, Discord, and more!
        </p>
        <div className="flex justify-center space-x-2">
          {['📱', '💬', '✨'].map((emoji, index) => (
            <span key={index} className="text-lg animate-float" style={{ animationDelay: `${index * 0.3}s` }}>
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};