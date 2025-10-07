'use client';

import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  acceptedTypes?: string[];
}

export default function ImageUploader({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    const newImages: string[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!acceptedTypes.includes(file.type)) {
          alert(`File ${file.name} is not a supported image format.`);
          continue;
        }
        
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 5MB.`);
          continue;
        }
        
        // Convert to base64 for now (in production, you'd upload to a storage service)
        const base64 = await convertToBase64(file);
        newImages.push(base64);
      }
      
      // Add new images to existing ones, respecting maxImages limit
      const updatedImages = [...images, ...newImages].slice(0, maxImages);
      onImagesChange(updatedImages);
    } catch (error) {
      console.error('Error processing images:', error);
      alert('Error processing images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
          dragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-neutral-300 hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || images.length >= maxImages}
        />
        
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mx-auto">
            {uploading ? (
              <div className="rounded-full h-6 w-6 border-b-2 border-primary"></div>
            ) : (
              <Upload className="h-8 w-8 text-primary" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-black text-neutral-900 mb-2">
              {uploading ? 'Uploading images...' : 'Upload Images'}
            </h3>
            <p className="text-neutral-600 text-sm">
              Drag and drop images here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary font-bold hover:underline"
                disabled={uploading || images.length >= maxImages}
              >
                browse files
              </button>
            </p>
            <p className="text-neutral-500 text-xs mt-2">
              Supports: JPEG, PNG, WebP (Max 5MB each, {maxImages} images total)
            </p>
          </div>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-neutral-200">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={`Uploaded image ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={() => {
                      // Handle image load error
                      console.error(`Failed to load image at index ${index}`);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-neutral-400" />
                  </div>
                )}
                
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              
              <p className="text-xs text-neutral-500 font-medium mt-2 text-center">
                Image {index + 1}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Images Counter */}
      <div className="text-center">
        <p className="text-sm text-neutral-600">
          {images.length} of {maxImages} images uploaded
        </p>
      </div>
    </div>
  );
}