export function dateFormat(date: Date) {
  return date.toISOString().slice(0, 10).replace('T', ' ');
}

export function toUTCTime(date: Date) {
  return Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  );
}
