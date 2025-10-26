import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { StyleSelector } from '@/components/StyleSelector';
import { QuantitySelector } from '@/components/QuantitySelector';
import { StickerPreview } from '@/components/StickerPreview';
import { PricingCalculator } from '@/components/PricingPlans';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Wand2, ArrowRight, ArrowLeft } from 'lucide-react';
import { generateImage } from '@/lib/api';
import { uploadToCloudinary } from '@/components/uploadToCloudinary';


interface GenerationState {
  uploadedImage: string | null;
  selectedStyle: string;
  selectedQuantity: number;
  stickerPack: string[];
  isGenerating: boolean;
  currentStep: number;
  pricingAccepted: boolean;
  customPrompt: string;  // Add this to track custom prompt
}

export const StickerGenerator: React.FC = () => {
  const { toast } = useToast();
  const [state, setState] = useState<GenerationState>({
    uploadedImage: null,
    selectedStyle: '',
    selectedQuantity: 1,
    stickerPack: [],
    isGenerating: false,
    currentStep: 4,
    pricingAccepted: false,
    customPrompt: ''
  });

  const steps = [
    { number: 1, title: 'Upload Photo', description: 'Add your beautiful selfie' },
    { number: 2, title: 'Choose Style', description: 'Pick your favorite look' },
    // { number: 3, title: 'Select Quantity', description: 'How many stickers?' },
    { number: 4, title: 'Review & Pay', description: 'Confirm pricing & payment' },
    { number: 5, title: 'Generate & Download', description: 'Get your stickers!' },
  ];

  // Map of style id => full prompt text. Professional and Cute prompts were
  // provided by the user. Magical and Chibi reuse the Cute prompt. Two extra
  // default prompts (cartoon, minimalist) are provided as sensible defaults.
  const stylePrompts: Record<string, string> = {
    professional: `A hyperrealistic vertical portrait shot in 1080x1920 format,
characterized by stark cinematic lighting and intense contrast. Captured with a slightly low, upward-facing angle that dramatizes the subject's jawline and neck, the composition evokes quiet dominance and sculptural elegance. The background is a deep, saturated crimson red, creating a bold visual clash with the model's luminous skin and dark wardrobe. Lighting is tightly directional, casting warm golden highlights on one side of the face while plunging the other into velvety shadow,
emphasizing bone structure with almost architectural precision.
The subject's expression is unreadable and cool-toned-eyes half-lidded, lips relaxed- suggesting detachment or quiet defiance. The model wears a heavy wool or felt overcoat, its texture richly defined against the skin's smooth, dewy glow. Minimal retouching preserves skin texture and slight imperfections, adding realism. Editorial tension is created through close cropping, tonal control, and the almost oppressive intimacy of the camera's proximity.
There are no props or accessories; the visual impact is created purely through light, shadow, color saturation, and posture - evoking high fashion, contemporary isolation, and`,

    cute: `Create ultra-high-resolution 8K photo-realistic images of the original person (100% exact facial likeness, no alterations). A young woman crouching down beside a rustic old wall with peeling paint and potted flowers, holding a compact digital camera toward the viewer to take a mirror-like selfie.
Outfit: She wears a soft ivory-white mini dress with a layered ruffled lace skirt, sheer fabric with delicate textures, spaghetti straps, and long-sleeve arm warmers. The dress has a sweet, romantic, doll-like aesthetic. She pairs the outfit with pastel white knee-high socks and cream-colored mary-jane shoes with a soft vintage vibe.
Hairstyle: Long, wavy brown-black hair styled to one side with soft bangs framing her face, decorated with a small white ribbon hair clip for a cute, feminine touch.
Makeup: youthful, doll-like style featuring soft pink blush across the cheeks, light eyeliner, fluttery lashes, and glossy pink lips. Her fair, porcelain-like skin enhances the innocent and dreamy atmosphere.
Accessories: White bow hair clip, plus a pastel pink-and-white beaded camera strap with charms, adding playful detail.
Pose: She crouches close to the ground, one hand resting against her cheek, gazing sweetly toward the camera she is holding up in her other hand. The pose conveys a mix of cuteness and intimacy, as if sharing a private candid moment.
Props & Environment: Old textured cement wall with cracks and plants climbing on the metal gate behind her. Small white flower pots with green leaves and pink blossoms placed beside her, adding color contrast. A vintage digital camera acts as the main prop, capturing her reflection.
Lighting: Soft natural daylight, slightly diffused, creating a pastel, natural skin tone with balanced highlights and shadows.
Mood & Tone: dreamy, playful, girlish aesthetic with a mix of urban vintage and sweet romantic charm. The atmosphere feels casual yet artistic, like a candid street portrait.
Camera angle: low-to-mid shot, close framing, giving focus to both the girl and the flowers at her side.
Camera style: DSLR or compact digital camera portrait, high resolution, natural lighting, realistic textures.`,

    // reuse Cute prompt for Magical and Chibi per request
    magical: ``,
    chibi: ``,

    // sensible defaults
    cartoon: `Vibrant stylized cartoon portrait with bold outlines, saturated colors, playful proportions, expressive eyes, and simplified textures; high detail in facial expression and clean composition suitable for sticker art.`,
    minimalist: `Minimalist vector-style portrait: flat colors, simple geometric shapes, limited palette, subtle gradients, and clean negative space for a modern sticker look.`,
  };

  // assign reuse of cute prompt for magical/chibi
  stylePrompts.magical = stylePrompts.cute;
  stylePrompts.chibi = stylePrompts.cute;

  const progress = ((state.currentStep - 1) / (steps.length - 1)) * 100;

  const handleImageUpload = async(file: File) => {
    // const url = URL.createObjectURL(file);
    const fileUploaded = await uploadToCloudinary(file);
    setState(prev => ({
      ...prev,
      uploadedImage: fileUploaded,
      currentStep: Math.max(prev.currentStep, 2)
    }));
    
    toast({
      title: "Photo uploaded! ✨",
      description: "Your image looks perfect for sticker creation!",
    });
  };


  const handleImageUrl = (url: string) => {
    setState(prev => ({
      ...prev,
      uploadedImage: url,
      currentStep: Math.max(prev.currentStep, 2)
    }));
    
    toast({
      title: "Image loaded! ✨",
      description: "Your image looks perfect for sticker creation!",
    });
  };

  const handleRemoveImage = () => {
    if (state.uploadedImage) {
      URL.revokeObjectURL(state.uploadedImage);
    }
    setState(prev => ({
      ...prev,
      uploadedImage: null,
      currentStep: 1,
      stickerPack: [],
      pricingAccepted: false
    }));
  };

  const handleStyleSelect = (styleId: string, customPrompt?: string) => {
    // For custom style, only advance if there's actual content in the prompt
    const shouldAdvance = styleId !== 'custom' || (customPrompt && customPrompt.trim().length > 0);
    
    setState(prev => ({
      ...prev,  
      selectedStyle: styleId,
      customPrompt: customPrompt || '',
      // Only advance to Review & Pay if it's not a custom style or if the custom prompt has content
      ...(shouldAdvance && { currentStep: Math.max(prev.currentStep, 4) }),
      pricingAccepted: false
    }));
  };

  const handleQuantitySelect = (quantity: number) => {
    setState(prev => ({
      ...prev,
      selectedQuantity: quantity,
      currentStep: 4,
      pricingAccepted: false
    }));
  };

  const handleAcceptPricing = () => {
    setState(prev => ({
      ...prev,
      pricingAccepted: true,
      currentStep: 5
    }));
    
    toast({
      title: "Pricing accepted! 💳",
      description: "Redirecting to secure payment...",
    });

    // TODO: Here you would integrate with Stripe for payment
    setTimeout(() => {
      toast({
        title: "Payment successful! ✅",
        description: "You can now generate your stickers!",
      });
    }, 2000);
  };
  const handleGenerateStickers = async () => {
    if (!state.uploadedImage || !state.selectedStyle || !state.pricingAccepted) {
      toast({
        title: "Missing information",
        description: "Please complete all steps including payment!",
        variant: "destructive",
      });
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true }));

    // Define a set of emotions
    const emotions = ["happy", "sad", "excited", "angry", "surprised", "confused", "calm", "joyful"];
    // Limit to max 4 images (API restriction)
    const numImages = Math.min(state.selectedQuantity, 4);

    try {
      // Base prompt comes from the selected style mapping. If not found,
      // fall back to a short description.
      const basePrompt = stylePrompts[state.selectedStyle] || `Make this image in ${state.selectedStyle} style`;

      // Compose prompt for multiple emotions if more than 1 sticker
      let prompt = basePrompt;
      if (numImages > 1) {
        const selectedEmotions = emotions.slice(0, numImages).join(", ");
        prompt += ` with these emotions: ${selectedEmotions}`;
      } else {
        prompt += ` with a ${emotions[0]} emotion`;
      }

      const result = await generateImage({
        prompt,
        image_url: state.uploadedImage,
        num_images: numImages,
      });

      const stickers = result.images?.map((img: any) => img.url) || [];

      setState(prev => ({
        ...prev,
        stickerPack: stickers,
        isGenerating: false
      }));

      toast({
        title: "Stickers generated! 🎉",
        description: `Your ${stickers.length} ${state.selectedStyle} stickers are ready!`,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isGenerating: false }));
      toast({
        title: "Generation failed",
        description: "Something went wrong. Please try again!",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download started! 📥",
      description: "Your sticker pack is being prepared for download.",
    });
    // In a real app, this would trigger the actual download
  };

  const handleShare = () => {
    toast({
      title: "Share options opened! 📱",
      description: "Choose your favorite platform to share your stickers.",
    });
    // In a real app, this would open share options
  };

  const canProceedToNextStep = () => {
    switch (state.currentStep) {
      case 1: return !!state.uploadedImage;
      case 2: return !!state.selectedStyle;
      case 3: return state.selectedQuantity > 0;
      case 4: return state.pricingAccepted;
      default: return true;
    }
  };

  const goToNextStep = () => {
    if (canProceedToNextStep() && state.currentStep < steps.length) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const goToPrevStep = () => {
    if (state.currentStep > 1) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary animate-glow-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Sticker Generator
            </h1>
            <Sparkles className="h-8 w-8 text-accent animate-glow-pulse" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your selfies into adorable custom stickers with AI magic! ✨
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-card to-muted/30">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Your Progress</h3>
              <Badge variant="secondary" className="bg-gradient-accent text-foreground">
                Step {state.currentStep} of {steps.length}
              </Badge>
            </div>
            
            <Progress value={progress} className="h-3" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`
                    text-center p-3 rounded-lg transition-all duration-300
                    ${state.currentStep >= step.number
                      ? 'bg-gradient-primary/10 text-primary'
                      : 'text-muted-foreground'
                    }
                  `}
                >
                  <div className={`
                    w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center text-sm font-bold
                    ${state.currentStep >= step.number
                      ? 'bg-gradient-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {step.number}
                  </div>
                  <p className="text-xs font-medium">{step.title}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Step 1: Image Upload */}
          {state.currentStep >= 1 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-primary bg-clip-text text-transparent">
                  Step 1: Upload Your Photo
                </h2>
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  onImageUrl={handleImageUrl}
                  uploadedImage={state.uploadedImage || undefined}
                  onRemoveImage={handleRemoveImage}
                />
            </Card>
          )}

          {/* Step 2: Style Selection */}
          {state.currentStep >= 2 && state.uploadedImage && (
            <Card className={`p-6 ${state.stickerPack.length > 0 ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="relative">
                {state.stickerPack.length > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Badge variant="secondary" className="bg-accent/90 text-foreground font-bold">
                      Step Completed
                    </Badge>
                  </div>
                )}
                <StyleSelector
                  selectedStyle={state.selectedStyle}
                  onStyleSelect={handleStyleSelect}
                />
              </div>
            </Card>
          )}

          {/* Step 3: Quantity Selection
              Temporarily commented out to simplify the flow. The app currently
              advances: Upload -> Choose Style -> Review & Pay -> Generate.
              If you want to re-enable quantity selection later, restore the
              block below and ensure `handleQuantitySelect` updates state.
          */}
          {false && (
            <Card className="p-6">
              <QuantitySelector
                selectedQuantity={state.selectedQuantity}
                onQuantitySelect={handleQuantitySelect}
              />
            </Card>
          )}

          {/* Step 4: Pricing & Payment */}
          {/* Note: quantity selection is currently disabled, so only require selectedStyle */}
          {state.currentStep >= 4 && state.selectedStyle && (
            // For custom style, only show pricing if we have a custom prompt
            state.selectedStyle !== 'custom' || state.customPrompt.trim().length > 0 ? (
              <Card className={`p-6 ${state.stickerPack.length > 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="relative">
                  {state.stickerPack.length > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <Badge variant="secondary" className="bg-accent/90 text-foreground font-bold">
                        Step Completed
                      </Badge>
                    </div>
                  )}
                  <PricingCalculator
                    selectedStyle={state.selectedStyle}
                    selectedQuantity={state.selectedQuantity}
                    onAcceptPricing={handleAcceptPricing}
                  />
                </div>
              </Card>
            ) : null
          )}

          {/* Step 5: Generation & Preview */}
          {state.currentStep >= 5 && state.pricingAccepted && (
            <Card className="p-6">
              {state.stickerPack.length === 0 && !state.isGenerating && (
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-bold bg-gradient-cute bg-clip-text text-transparent">
                    Payment Confirmed! Ready to Generate? ✨
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your payment has been processed. Click below to generate your {state.selectedQuantity} amazing {state.selectedStyle} stickers.
                  </p>
                  <Button
                    variant="cute"
                    size="lg"
                    onClick={handleGenerateStickers}
                    className="text-lg px-8 py-4"
                  >
                    <Wand2 className="h-6 w-6 mr-3" />
                    Generate My Stickers
                  </Button>
                </div>
              )}
              
              <div className="space-y-8">
                <StickerPreview
                  isGenerating={state.isGenerating}
                  stickerPack={state.stickerPack}
                  onDownload={handleDownload}
                  onShare={handleShare}
                  selectedStyle={state.selectedStyle}
                  selectedQuantity={state.selectedQuantity}
                />
                
                {state.stickerPack.length > 0 && (
                  <div className="text-center p-4 bg-accent/10 rounded-lg">
                    <p className="text-lg font-medium text-foreground">
                      ✨ Your stickers have been generated! ✨
                    </p>
                    <p className="text-muted-foreground mt-2">
                      To create new stickers, please refresh the page and start a new session.
                      <br />
                      Or use the "Remove Photo" button above to start over.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

  {/* Navigation Buttons Removed: Now each stage auto-advances on selection */}
      </div>
    </div>
  );
};