import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Smile, Sparkles, Camera, Feather } from 'lucide-react';

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
  onStyleSelect: (styleId: string, customPrompt?: string) => void;
}

const stickerStyles: StickerStyle[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Hyperrealistic, editorial fashion portrait with dramatic lighting',
    icon: <Camera className="h-5 w-5" />,
    preview: '📸',
    popular: true,
  },
  {
    id: 'cute',
    name: 'Cute',
    description: 'Sweet, dreamy, photoreal portrait with soft lighting',
    icon: <Heart className="h-5 w-5" />,
    preview: '(◕‿◕)♡',
    popular: true,
  },
  {
    id: 'magical',
    name: 'Magical',
    description: 'Sparkly, dreamy magical-girl aesthetic (uses Cute prompt)',
    icon: <Sparkles className="h-5 w-5" />,
    preview: '✨',
  },
  {
    id: 'chibi',
    name: 'Chibi',
    description: 'Chibi / super-deformed cute character (uses Cute prompt)',
    icon: <Star className="h-5 w-5" />,
    preview: '(´｡• ᵕ •｡`)',
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    description: 'Vibrant, stylized cartoon portrait with bold outlines and colors',
    icon: <Feather className="h-5 w-5" />,
    preview: '🖍️',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, flat-color minimalist portrait with simple shapes',
    icon: <Smile className="h-5 w-5" />,
    preview: '▫️',
  },
];


export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onStyleSelect,
}) => {
  const [customPrompt, setCustomPrompt] = useState("");
  const [showNextStep, setShowNextStep] = useState(false);

  useEffect(() => {
    // When custom style is selected and we have a previous prompt, trigger the callback
    if (selectedStyle === "custom" && customPrompt.trim().length > 0) {
      onStyleSelect("custom", customPrompt);
    }
  }, [selectedStyle, customPrompt, onStyleSelect]);

  const handleCustomPromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomPrompt(value);
    setShowNextStep(!!value);
    // Only call onStyleSelect if there's actual text in the prompt
    if (value.trim().length > 0) {
      onStyleSelect("custom", value);
    }
  };

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

        {/* Custom Prompt Card - Temporarily disabled
        <Card
          key="custom"
          className={`
            relative p-6 cursor-pointer transition-all duration-300 group
            ${selectedStyle === "custom"
              ? 'ring-2 ring-primary shadow-cute bg-gradient-primary/5 scale-105'
              : 'hover:shadow-soft hover:scale-105 border-2 border-transparent hover:border-primary/20'
            }
          `}
          onClick={() => onStyleSelect("custom")}
        >
          <div className="flex items-start space-x-4">
            <div className={`
              p-3 rounded-full transition-all duration-300
              ${selectedStyle === "custom"
                ? 'bg-gradient-primary text-primary-foreground animate-bounce-cute'
                : 'bg-gradient-secondary text-accent-foreground group-hover:animate-float'
              }
            `}>
              <span className="text-2xl">📝</span>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Custom Prompt</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Write your own style prompt for the sticker
              </p>
            </div>
          </div>

          {selectedStyle === "custom" && (
            <div className="mt-4">
              <input
                type="text"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe your style..."
                value={customPrompt}
                onChange={handleCustomPromptChange}
                onFocus={() => {
                  // Re-trigger the style selection if we have existing content
                  if (customPrompt.trim().length > 0) {
                    onStyleSelect("custom", customPrompt);
                  }
                }}
              />

            </div>
          )}
        </Card>
        */}
      </div>
    </div>
  );
};