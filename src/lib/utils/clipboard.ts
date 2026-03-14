/**
 * Safely copies text to the clipboard, with a fallback for non-secure contexts (HTTP).
 * @param text The text to copy to the clipboard.
 * @returns A promise that resolves to true if the copy was successful, otherwise false.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try the modern Clipboard API first (requires HTTPS or localhost)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Clipboard API failed, falling back to execCommand:", err);
    }
  }

  // Fallback for HTTP or older browsers
  return fallbackCopyToClipboard(text);
}

/**
 * Fallback method using a temporary textarea and document.execCommand('copy').
 */
function fallbackCopyToClipboard(text: string): boolean {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Ensure the textarea is not visible but part of the DOM
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);

  textArea.focus();
  textArea.select();

  let successful = false;
  try {
    successful = document.execCommand("copy");
  } catch (err) {
    console.error("Fallback copy failed:", err);
    successful = false;
  }

  document.body.removeChild(textArea);
  return successful;
}
