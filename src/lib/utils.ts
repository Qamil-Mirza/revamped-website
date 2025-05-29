import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names conditionally and merges Tailwind CSS classes.
 * 
 * @param inputs - Class names to combine.
 * @returns A single string of class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
