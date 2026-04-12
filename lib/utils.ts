import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Many image models require width and height divisible by 8. */
export function roundToMultipleOf8(
  value: number,
  min = 256,
  max = 1024,
): number {
  if (!Number.isFinite(value)) return max
  const clamped = Math.max(min, Math.min(max, Math.round(value)))
  let rounded = Math.round(clamped / 8) * 8
  if (rounded < min) rounded = min
  if (rounded > max) rounded = max
  return rounded
}
