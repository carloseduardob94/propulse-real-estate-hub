
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

interface PropertyImageGalleryProps {
  images: string[];
  initialImageIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyImageGallery({ 
  images, 
  initialImageIndex = 0, 
  isOpen, 
  onClose 
}: PropertyImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] max-h-[95vh] p-0 gap-0 bg-black/95 border-none"
        onKeyDown={handleKeyDown}
      >
        <div className="relative h-full flex flex-col">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-50 text-white hover:bg-white/20 rounded-full"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Main image container */}
          <div className="relative flex-1 flex items-center justify-center p-4">
            <img
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1} of ${images.length}`}
              className="max-h-[80vh] w-auto object-contain animate-fade-in"
            />
            
            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 text-white hover:bg-white/20 rounded-full"
                  onClick={handlePrevious}
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 text-white hover:bg-white/20 rounded-full"
                  onClick={handleNext}
                >
                  <ArrowRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 p-4 bg-black/80">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`h-16 w-16 rounded-md overflow-hidden border-2 transition-all ${
                    index === currentIndex 
                      ? "border-propulse-500 scale-110" 
                      : "border-transparent hover:border-white/50"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
