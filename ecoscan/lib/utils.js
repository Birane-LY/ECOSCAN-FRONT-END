import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * cn — merge conditional class names and resolve Tailwind conflicts.
 *
 * @param {...import("clsx").ClassValue} inputs - Class values (strings, arrays, objects).
 * @returns {string} A single merged className string.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
