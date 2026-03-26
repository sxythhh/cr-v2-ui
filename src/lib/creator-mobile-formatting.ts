export function formatCurrency(amount: number, decimals = true): string {
  const isWholeNumber = amount % 1 === 0;
  const skipDecimals = !decimals || isWholeNumber;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: skipDecimals ? 0 : 2,
    maximumFractionDigits: skipDecimals ? 0 : 2,
  }).format(amount);
}
