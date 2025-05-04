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

export function isDesktop() {
  return window.innerWidth > 1024;
}

export function isTablet() {
  return window.innerWidth < 1024 && window.innerWidth > 768;
}

export function isMobile() {
  return window.innerWidth < 768;
}

export function formattedValue(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value)); // ← on retourne le résultat
}
