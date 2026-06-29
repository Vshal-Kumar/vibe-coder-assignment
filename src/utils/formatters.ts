export function formatFollowers(count: number | undefined): string {
  if (count === undefined || count === null) return "0";
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return count.toLocaleString();
}

export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined || rate === null) return "N/A";
  // If rate is given as a decimal like 0.0345 (3.45%)
  const percentage = rate <= 1 ? rate * 100 : rate;
  return percentage.toFixed(2) + "%";
}

export function formatNumber(count: number | undefined): string {
  if (count === undefined || count === null) return "N/A";
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return count.toLocaleString();
}

