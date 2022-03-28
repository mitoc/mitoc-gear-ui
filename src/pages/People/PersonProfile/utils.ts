export function getNextExpirationDate() {
  const now = new Date();
  const expirationDate = new Date(now);
  expirationDate.setFullYear(now.getFullYear() + 1);
  expirationDate.setDate(now.getDate() - 1);
  return expirationDate;
}
