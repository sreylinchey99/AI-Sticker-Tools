import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface QuantityOption {
  count: number;
  label: string;
  description: string;
  recommended?: boolean;
}

interface QuantitySelectorProps {
  selectedQuantity: number;
  onQuantitySelect: (quantity: number) => void;
}

const quantityOptions: QuantityOption[] = [
  {
    count: 1,
    label: '1 Sticker',
    description: 'Single emotion sticker',
    // recommended: true,
  },
//  {
//     count: 2,
//     label: '2 Stickers',
//     description: 'Two unique emotions',
//     // recommended: true,
//   },
//   {
//     count: 3,
//     label: '3 Stickers',
//     description: 'Three expressive stickers',
    
//   },
//   {
//     count: 4,
//     label: '4 Stickers',
//     description : 'Essential expressions pack',
//     recommended: true,
//   },
];

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  selectedQuantity,
  onQuantitySelect,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
          How Many Stickers?
        </h2>
        <p className="text-muted-foreground">
          Choose the perfect pack size for your needs
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quantityOptions.map((option) => (
          <Card
            key={option.count}
            className={`
              relative p-6 cursor-pointer transition-all duration-300 group text-center
              ${selectedQuantity === option.count
                ? 'ring-2 ring-accent shadow-cute bg-gradient-secondary/10 scale-105'
                : 'hover:shadow-soft hover:scale-105 border-2 border-transparent hover:border-accent/20'
              }
            `}
            onClick={() => onQuantitySelect(option.count)}
          >
            {option.recommended && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 bg-gradient-cute text-primary-foreground font-bold text-xs animate-glow-pulse"
              >
                Popular
              </Badge>
            )}
            
            <div className="space-y-3">
              <div className={`
                text-3xl font-bold transition-all duration-300
                ${selectedQuantity === option.count
                  ? 'text-accent animate-bounce-cute'
                  : 'text-foreground group-hover:text-accent'
                }
              `}>
                {option.count}
              </div>
              
              <h3 className="font-semibold text-lg">{option.label}</h3>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {option.description}
              </p>
            </div>
            
            {selectedQuantity === option.count && (
              <div className="absolute inset-0 rounded-lg bg-gradient-secondary opacity-5 pointer-events-none" />
            )}
          </Card>
        ))}
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Each sticker will have unique expressions and poses
        </p>
        <div className="flex justify-center space-x-2">
          {['😊', '😢', '😲', '🤔', '😍', '😤'].slice(0, selectedQuantity).map((emoji, index) => (
            <span key={index} className="text-lg animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};