export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(' ');
}

export function formatDate(value: string) {
  if (!value) return '--';
  return new Date(value).toLocaleDateString('vi-VN');
}

export function formatTime(value: string) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}
