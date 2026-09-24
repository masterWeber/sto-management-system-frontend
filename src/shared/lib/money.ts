export function kopecksToRubles(kopecks: number): number {
  return kopecks / 100;
}

export function rublesToKopecks(rubles: number): number {
  return Math.round(rubles * 100);
}

const moneyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoney(kopecks: number): string {
  return moneyFormatter.format(kopecks / 100);
}
