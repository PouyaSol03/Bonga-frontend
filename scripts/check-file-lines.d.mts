export function countPhysicalLines(text: string): number;
export function collectOversizedFiles(
  paths: string[],
  maximum?: number,
): Array<{ path: string; lines: number }>;
