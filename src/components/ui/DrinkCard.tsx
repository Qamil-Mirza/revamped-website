"use client";

import Image from "next/image";
import type { Drink } from "@/lib/drinks-logic";

function formatDate(date: string): string {
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function DrinkCard({
  drink,
  featured,
}: {
  drink: Drink;
  featured: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl bg-black/30 backdrop-blur-sm ring-1 ring-white/10 transition-all ${
        featured ? "shadow-2xl" : ""
      }`}
    >
      <div className="relative aspect-square w-full">
        <Image
          src={drink.imageUrl}
          alt={drink.name}
          fill
          sizes="(max-width: 768px) 70vw, 360px"
          className="object-cover"
        />
      </div>
      <div className="p-4 text-left">
        <p className="text-xs uppercase tracking-wider text-primaryText/60">
          {formatDate(drink.date)}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-primaryText">{drink.name}</h3>
        {featured && drink.note && (
          <p className="mt-1 text-sm text-primaryText/80">{drink.note}</p>
        )}
      </div>
    </div>
  );
}
