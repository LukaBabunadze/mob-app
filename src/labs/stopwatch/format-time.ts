export function formatTime(milliseconds: number) {
  const totalCentiseconds = Math.floor(Math.max(0, milliseconds) / 10);
  const centiseconds = totalCentiseconds % 100;
  const totalSeconds = Math.floor(totalCentiseconds / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
}
