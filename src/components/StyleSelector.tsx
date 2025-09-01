import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Smile, Sparkles } from 'lucide-react';

export interface StickerStyle {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  preview: string;
  popular?: boolean;
}

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleSelect: (styleId: string) => void;
}

const stickerStyles: StickerStyle[] = [
  {
    id: 'kawaii',
    name: 'Kawaii Cute',
    description: 'Adorable anime-style with big eyes and sweet expressions',
    icon: <Heart className="h-5 w-5" />,
    preview: '(◕‿◕)♡',
    popular: true,
  },
  {
    id: 'chibi',
    name: 'Chibi Style',
    description: 'Super deformed cute characters with exaggerated features',
    icon: <Star className="h-5 w-5" />,
    preview: '(´｡• ᵕ •｡`)',
  },
  {
    id: 'emoji',
    name: 'Emoji Expression',
    description: 'Fun and expressive emoji-style reactions',
    icon: <Smile className="h-5 w-5" />,
    preview: '(≧∇≦)/',
    popular: true,
  },
  {
    id: 'magical',
    name: 'Magical Girl',
    description: 'Sparkly and dreamy with magical elements',
    icon: <Sparkles className="h-5 w-5" />,
    preview: '✨(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',
  },
];

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onStyleSelect,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Choose Your Style
        </h2>
        <p className="text-muted-foreground">
          Pick the perfect style for your sticker pack
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stickerStyles.map((style) => (
          <Card
            key={style.id}
            className={`
              relative p-6 cursor-pointer transition-all duration-300 group
              ${selectedStyle === style.id
                ? 'ring-2 ring-primary shadow-cute bg-gradient-primary/5 scale-105'
                : 'hover:shadow-soft hover:scale-105 border-2 border-transparent hover:border-primary/20'
              }
            `}
            onClick={() => onStyleSelect(style.id)}
          >
            {style.popular && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 bg-gradient-accent text-foreground font-bold animate-float"
              >
                Popular
              </Badge>
            )}
            
            <div className="flex items-start space-x-4">
              <div className={`
                p-3 rounded-full transition-all duration-300
                ${selectedStyle === style.id
                  ? 'bg-gradient-primary text-primary-foreground animate-bounce-cute'
                  : 'bg-gradient-secondary text-accent-foreground group-hover:animate-float'
                }
              `}>
                {style.icon}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{style.name}</h3>
                  <span className="text-2xl">{style.preview}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {style.description}
                </p>
              </div>
            </div>
            
            {selectedStyle === style.id && (
              <div className="absolute inset-0 rounded-lg bg-gradient-primary opacity-5 pointer-events-none" />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};