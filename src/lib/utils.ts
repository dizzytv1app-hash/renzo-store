export function formatPrice(price: number): string {
  return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
}

export function formatPriceShort(price: number): string {
  if (price >= 1000000) {
    return (price / 1000000).toFixed(1).replace('.0', '') + ' mln so\'m';
  }
  if (price >= 1000) {
    return Math.round(price / 1000) + ' ming so\'m';
  }
  return price + ' so\'m';
}

export function getEffectivePrice(product: { price: number; discount_price: number | null }): number {
  return product.discount_price ?? product.price;
}

export function getDiscountPercent(product: { discount_percent: number | null; price: number; discount_price: number | null }): number {
  if (product.discount_percent) return product.discount_percent;
  if (product.discount_price && product.discount_price < product.price) {
    return Math.round((1 - product.discount_price / product.price) * 100);
  }
  return 0;
}

export function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${y}${m}${d}-${rand}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
