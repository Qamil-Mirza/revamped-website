import React from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import Image from "next/image";

interface GalleryProps {
  city?: string;
  description?: string;
  images: string[];
}

function Gallery({ city, description, images }: GalleryProps) {
  return (
    <section id="photos">
      <div className="columns-2 gap-4 sm:columns-3">
        {images.map((imageUrl, idx) => (
          <BlurFade key={imageUrl} delay={0.25 + idx * 0.05} inView>
            <Image
              src={imageUrl}
              alt={`${city} image ${idx + 1}`}
              width={400}
              height={300}
              className="mb-4 size-full rounded-lg object-contain"
              loading="lazy" // This enables lazy loading
            />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}

export default Gallery;
