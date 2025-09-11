// Using Sri Lankan Rupees (LKR) formatting; values passed should be in whole rupees
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-LK", {
  currency: "LKR",
  style: "currency",
  minimumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount);
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-LK");

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}
