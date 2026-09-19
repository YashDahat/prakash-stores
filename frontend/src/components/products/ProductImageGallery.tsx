import type { JSX } from 'react';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  imageUrls: string[];
}

const ProductImageGallery = ({ imageUrls }: ProductImageGalleryProps): React.JSX.Element => {
  const [mainImage, setMainImage] = useState<string>(imageUrls[0] || '');

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <span className="text-gray-500">No Image Available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-lg shadow-md aspect-square">
        <img
          src={mainImage}
          alt="Product main image"
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {imageUrls.map((url, index) => (
          <button
            key={index}
            className={cn(
              "w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200",
              mainImage === url ? "border-[#E87A00]" : "border-transparent hover:border-gray-300"
            )}
            onClick={() => setMainImage(url)}
            data-testid={`thumbnail-${index}`}
          >
            <img
              src={url}
              alt={`Product thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;