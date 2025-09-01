import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X, Link, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  onImageUrl: (url: string) => void;
  uploadedImage?: string;
  onRemoveImage: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  onImageUrl,
  uploadedImage,
  onRemoveImage,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
    setIsDragActive(false);
  }, [onImageUpload]);

  const handleUrlSubmit = useCallback(async () => {
    if (!imageUrl.trim()) return;
    
    setIsLoadingUrl(true);
    try {
      // Simple URL validation
      const url = new URL(imageUrl);
      onImageUrl(imageUrl);
      setImageUrl('');
    } catch (error) {
      console.error('Invalid URL:', error);
    } finally {
      setIsLoadingUrl(false);
    }
  }, [imageUrl, onImageUrl]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  if (uploadedImage) {
    return (
      <Card className="relative p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
        <div className="relative group">
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="w-full h-64 object-cover rounded-lg shadow-soft"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={onRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-3">
          Perfect! Your photo is ready for sticker magic ✨
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Image URL
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-6">
          <Card
            {...getRootProps()}
            className={`
              p-8 border-2 border-dashed cursor-pointer transition-all duration-300 
              ${isDragActive 
                ? 'border-primary bg-gradient-primary/10 scale-105 shadow-cute' 
                : 'border-primary/30 hover:border-primary/60 hover:bg-primary/5 hover:scale-105'
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className={`
                p-4 rounded-full bg-gradient-primary/10 transition-all duration-300
                ${isDragActive ? 'animate-bounce-cute' : 'hover:animate-float'}
              `}>
                {isDragActive ? (
                  <ImageIcon className="h-8 w-8 text-primary animate-glow-pulse" />
                ) : (
                  <Upload className="h-8 w-8 text-primary" />
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">
                  {isDragActive ? 'Drop your photo here!' : 'Upload Your Photo'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Drag & drop your selfie or click to browse. We'll transform it into adorable stickers!
                </p>
              </div>
              
              <Button variant="cute" size="lg" className="mt-4">
                <Upload className="h-5 w-5 mr-2" />
                Choose Photo
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG, WebP (max 10MB)
              </p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="url" className="mt-6">
          <Card className="p-8 border-2 border-dashed">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-full bg-gradient-primary/10">
                <Link className="h-8 w-8 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">
                  Add Image URL
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Paste a direct link to your image from the web.
                </p>
              </div>
              
              <div className="w-full max-w-md space-y-3">
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="text-center"
                />
                
                <Button 
                  variant="cute" 
                  size="lg" 
                  onClick={handleUrlSubmit}
                  disabled={!imageUrl.trim() || isLoadingUrl}
                  className="w-full"
                >
                  {isLoadingUrl ? (
                    <>Loading...</>
                  ) : (
                    <>
                      <Link className="h-5 w-5 mr-2" />
                      Load Image
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Make sure the URL points directly to an image file
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};