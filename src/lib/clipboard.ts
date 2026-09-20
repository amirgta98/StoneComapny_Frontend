import { toast } from "sonner";

function fallbackCopyText(text: string): boolean {
  if (typeof document === "undefined") return false;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  let successful = false;
  try {
    successful = document.execCommand("copy");
  } catch (err) {
    successful = false;
  }
  document.body.removeChild(textarea);
  return successful;
}

/**
 * Safely copies text to the browser clipboard.
 * Always wraps `navigator.clipboard.writeText` in a try...catch block
 * and falls back to `document.execCommand` if writing fails, with
 * toast notifications for success and error.
 */
export async function copyToClipboard(
  text: string,
  successMessage: string = "لینک با موفقیت کپی شد",
  errorMessage: string = "خطا در کپی لینک؛ لطفاً به صورت دستی کپی کنید"
): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // 1. Try modern clipboard API if available
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(successMessage);
      return true;
    } catch (clipErr) {
      console.warn("navigator.clipboard.writeText failed, trying fallback:", clipErr);
    }
  }

  // 2. Fallback to execCommand
  try {
    const fallbackSuccess = fallbackCopyText(text);
    if (fallbackSuccess) {
      toast.success(successMessage);
      return true;
    }
  } catch (fallbackErr) {
    console.warn("Fallback execCommand copy failed:", fallbackErr);
  }

  toast.error(errorMessage);
  return false;
}
