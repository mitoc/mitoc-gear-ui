const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

export function fmtAmount(amount: number) {
  return currencyFormatter.format(amount);
}
