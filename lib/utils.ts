import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Shared data across native device apps.
 * @param {Object} options
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function nativeShare(shareData: { title?: string, text?: string, url: string }) {
  // Check if the browser supports the basic Share API
  if (!navigator.share) {
    return { success: false, error: 'Web Share API not supported' };
  }

  // Execute the share sheet
  try {
    await navigator.share(shareData);
    return { success: true };
  } catch (error: any) {
    // Handle user cancellation gracefully
    if (error.name === 'AbortError') {
      return { success: false, error: 'User cancelled the share action' };
    }
    return { success: false, error: error.message };
  }
}

export async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text)
}