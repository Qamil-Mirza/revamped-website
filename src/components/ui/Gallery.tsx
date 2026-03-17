import React from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import Image from "next/image";

interface GalleryProps {
  city?: string;
  description?: string;
  images: string[];
}

function Gallery({ city, description, images }: GalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <section className="mb-10">
      {city && (
        <h2 className="text-primaryText text-2xl font-semibold mb-2 text-center">
          {city}
        </h2>
      )}
      {description && (
        <p className="text-primaryText/80 text-sm mb-4 text-center">
          {description}
        </p>
      )}
      <div className="columns-2 gap-4 sm:columns-3">
        {images.map((imageUrl, idx) => (
          <BlurFade key={imageUrl} delay={0.25 + idx * 0.05} inView>
            <Image
              src={imageUrl}
              alt={`${city ?? "photo"} image ${idx + 1}`}
              width={400}
              height={300}
              className="mb-4 size-full rounded-lg object-contain"
              loading="lazy"
            />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}

export default Gallery;
