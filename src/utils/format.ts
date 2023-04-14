const K = 1024;

export function formatSize(bytes: number | undefined): string {
  if (bytes === undefined) return '';
  const units = ['iB', 'KiB', 'MiB', 'GiB', 'TiB'];
  let ratio = 1;
  let tryRatio = K;
  let unitIndex = 0;

  while (unitIndex < units.length - 1 && bytes / tryRatio > 1) {
    ratio = tryRatio;
    tryRatio *= K;
    unitIndex++;
  }

  const value = numberWithCommas(Math.round(bytes / ratio));
  const unit = units[unitIndex];
  return `${value}${unit}`;
}

function numberWithCommas(n: number | string): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
