import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges multiple CSS classes and resolves Tailwind CSS conflicts.
 * @param  {...any} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
