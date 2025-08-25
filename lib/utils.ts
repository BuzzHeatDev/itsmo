import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get current UTC time from server
 * Since we're running on Vercel (UTC), this is reliable and simple
 */
export function getCurrentUTC(): Date {
  return new Date();
}

/**
 * Get current UTC date in YYYY-MM-DD format
 */
export function getCurrentUTCDate(): string {
  return new Date().toISOString().split('T')[0];
}
