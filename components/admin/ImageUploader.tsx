"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, Loader2, Copy, Eye, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  contentType: string;
  modelId?: string;
}

interface UploadedImage {
  url: string;
  filename: string;
}

export function ImageUploader({ contentType, modelId }: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetchedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!modelId) return;

    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/admin/image?contentType=${encodeURIComponent(contentType)}&id=${encodeURIComponent(modelId)}`,
        );
        if (response.ok) {
          const data = await response.json();
          setImages(data.images || []);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [contentType, modelId]);

  const uploadImage = useCallback(
    async (file: File) => {
      if (!modelId) {
        toast.error("Save the item first before uploading images ");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        return;
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("contentType", contentType);
        formData.append("id", modelId);

        const response = await fetch("/api/admin/image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          toast.error(error.error || "Failed to upload image");
          return;
        }

        const data = await response.json();
        setImages((prev) => [
          ...prev,
          {
            url: data.url,
            filename: data.filename.split("/").pop() || file.name,
          },
        ]);
        toast.success("Image uploaded");
      } catch (error) {
        console.error("Upload Error:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to upload image",
        );
      } finally {
        setIsUploading(false);
      }
    },
    [contentType, modelId],
  );

  const deleteImage = useCallback(async (url: string) => {
    setDeletingUrl(url);
    try {
      const response = await fetch("/api/admin/image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Failed to delete image");
      }

      setImages((prev) => prev.filter((img) => img.url !== url));
      toast.success("Image deleted");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete image",
      );
    } finally {
      setDeletingUrl(null);
    }
  }, []);

  const copyUrl = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success("URL copied to clipboard");
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (!modelId) {
        toast.error("Save the item first before uploading images");
        return;
      }

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      imageFiles.forEach((file) => uploadImage(file));
    },
    [uploadImage, modelId],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!modelId) {
        toast.error("Save the item first before uploading images");
        return;
      }

      const files = Array.from(e.target.files || []);
      files.forEach((file) => uploadImage(file));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [uploadImage, modelId],
  );

  if (!modelId) {
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Images</h4>
        <div className="border-2 border-dashed rounded-lg p-4 text-center text-muted-foreground">
          <p className="text-sm">Save first to enable image uploads</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">Images</h4>
        {isLoading ? (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        ) : images.length > 0 ? (
          <span className="text-xs text-muted-foreground">
            {images.length} uploaded
          </span>
        ) : null}
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          transition-colors duration-200
          ${
            isDragOver
              ? "border-cyan-500 bg-cyan-500/10"
              : "border-border hover:border-muted-foreground/50"
          }
          ${isUploading ? "pointer-events-none opacity-50" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        {isUploading ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground py-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Uploading...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-muted-foreground py-2">
            <Upload className="h-5 w-5" />
            <span className="text-sm">Drop images or click to upload</span>
          </div>
        )}
      </div>

      {/* Uploaded Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.map((image) => (
            <div
              key={image.url}
              className="relative group rounded-lg overflow-hidden border bg-muted/30"
            >
              <img
                src={image.url}
                alt={image.filename}
                className="w-full h-24 object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyUrl(image.url);
                  }}
                  className="h-8 w-8 p-0 text-white hover:text-white hover:bg-white/20"
                  title="Copy link"
                >
                  {copiedUrl === image.url ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(image.url, "_blank");
                  }}
                  className="h-8 w-8 p-0 text-white hover:text-white hover:bg-white/20"
                  title="View image"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteImage(image.url);
                  }}
                  disabled={deletingUrl === image.url}
                  className="h-8 w-8 p-0 text-white hover:text-red-400 hover:bg-white/20"
                  title="Delete image"
                >
                  {deletingUrl === image.url ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                <p className="text-[10px] text-white truncate">
                  {image.filename}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
