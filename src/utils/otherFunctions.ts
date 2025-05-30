import { useMediaQuery } from "@vueuse/core";

export const isDesktop = () => useMediaQuery("(min-width: 1024px)");
export const isMobile = () => useMediaQuery("(max-width: 1023px)");

export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}

export function share(text: string): void {
  if (navigator.share) {
    navigator.share({
      title: "Share",
      text,
    });
  }
}

export function formattedValue(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}
