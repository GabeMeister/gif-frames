import roundTo from 'round-to';

// Calculate the percent progress. (For example, index 1 out of 4 should return
// 25, for 25% progress)
export function getPercent(index, total) {
  return roundTo((index / total) * 100, 1);
}