/**
 * Formats a timestamp in milliseconds to a readable time string (MM:SS)
 * @param ms Timestamp in milliseconds
 * @returns Formatted time string
 */
export const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};