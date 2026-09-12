import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  imageUrls: string[];
}

export default function ProductImageGallery({ imageUrls }: ProductImageGalleryProps): React.JSX.Element {
  const [mainImage, setMainImage] = useState<string>(imageUrls[0] || '');

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full overflow-hidden rounded-lg shadow-md">
        <img
          src={mainImage}
          alt="Main product image"
          className="w-full h-96 object-cover object-center transition-transform duration-300 ease-in-out hover:scale-105"
          data-testid="main-product-image"
        />
      </div>

      {/* Thumbnails */}
      {imageUrls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {imageUrls.map((url, index) => (
            <button
              key={index}
              onClick={() => setMainImage(url)}
              className={cn(
                "flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-200",
                mainImage === url ? "border-[#E87A00] shadow-md" : "border-gray-200 hover:border-gray-400"
              )}
              data-testid={`thumbnail-image-${index}`}
            >
              <img
                src={url}
                alt={`Product thumbnail ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}