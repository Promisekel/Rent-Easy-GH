import React, { useEffect } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-photo-view/dist/react-photo-view.css';

interface GalleryModalProps {
  images: { url: string; id: string }[];
  activeIndex: number;
  onClose: () => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ images, activeIndex, onClose }) => {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90">
      <PhotoProvider
        speed={() => 300}
        easing={(type) => (type === 2 ? 'cubic-bezier(0.36, 0, 0.66, -0.56)' : 'cubic-bezier(0.34, 1.56, 0.64, 1)')}
        maskOpacity={0.9}
        onIndexChange={(index) => {
          // Optional: track index changes
        }}
        onVisibleChange={(visible) => {
          if (!visible) onClose();
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-60 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
          aria-label="Close gallery"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image counter */}
        <div className="absolute top-4 left-4 z-60 px-3 py-1 bg-black bg-opacity-50 text-white rounded-full text-sm">
          {activeIndex + 1} / {images.length}
        </div>

        {/* Main image view */}
        <div className="flex items-center justify-center h-full p-4">
          <PhotoView src={images[activeIndex]?.url}>
            <img
              src={images[activeIndex]?.url}
              alt={`Gallery image ${activeIndex + 1}`}
              className="max-w-full max-h-full object-contain cursor-zoom-in"
            />
          </PhotoView>
        </div>

        {/* Navigation arrows - only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const prevIndex = activeIndex > 0 ? activeIndex - 1 : images.length - 1;
                // Update active index in parent component
                window.dispatchEvent(new CustomEvent('gallery-nav', { detail: { index: prevIndex } }));
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                const nextIndex = activeIndex < images.length - 1 ? activeIndex + 1 : 0;
                // Update active index in parent component
                window.dispatchEvent(new CustomEvent('gallery-nav', { detail: { index: nextIndex } }));
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Thumbnail navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 p-2 bg-black bg-opacity-50 rounded-lg max-w-full overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={(e) => {
                  e.stopPropagation();
                  window.dispatchEvent(new CustomEvent('gallery-nav', { detail: { index: idx } }));
                }}
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  idx === activeIndex 
                    ? 'border-white scale-110' 
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img 
                  src={img.url} 
                  alt={`Thumbnail ${idx + 1}`} 
                  className="w-full h-full object-cover" 
                />
              </button>
            ))}
          </div>
        )}
      </PhotoProvider>
    </div>
  );
};

export default GalleryModal;
