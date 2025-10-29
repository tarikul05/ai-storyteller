'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ImageGallery({ images, storyId }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) return null;

  const openLightbox = (index) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 font-story text-center">
          🎨 Story Scenes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((_, index) => (
            <div
              key={index}
              className="relative group cursor-pointer transform hover:scale-105 transition-transform duration-200"
              onClick={() => openLightbox(index)}
            >
              <img
                src={`/api/proxy-image?storyId=${storyId}&sceneNum=${index}`}
                alt={`Story scene ${index + 1}`}
                className="w-full h-48 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold">
                  View 🪄
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <img
            src={`/api/proxy-image?storyId=${storyId}&sceneNum=${selectedImage}`}
            alt={`Story scene ${selectedImage + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg"
          />

          <div className="absolute bottom-4 text-white text-center">
            Scene {selectedImage + 1} of {images.length}
          </div>
        </div>
      )}
    </>
  );
}