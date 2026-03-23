/** Deceleration curve: fast start that eases to a stop (cubic ease-out). */
export const easeOutCubic = (progress: number): number => 1 - (1 - progress) ** 3;
