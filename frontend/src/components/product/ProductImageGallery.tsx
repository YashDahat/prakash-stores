import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  imageUrls: string[];
}

export default function ProductImageGallery({ imageUrls }: ProductImageGalleryProps) {
  const [mainImage, setMainImage] = useState<string>(imageUrls[0] || '');

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-96 bg-gray-200 rounded-lg">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-96 overflow-hidden rounded-lg border border-gray-200">
        <img
          src={mainImage}
          alt="Main product image"
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {imageUrls.map((url, index) => (
          <div
            key={index}
            className={cn(
              "w-full h-24 overflow-hidden rounded-lg border-2 cursor-pointer transition-all duration-200",
              mainImage === url ? "border-[#E87A00]" : "border-gray-200 hover:border-gray-400"
            )}
            onClick={() => setMainImage(url)}
          >
            <img
              src={url}
              alt={`Product thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}