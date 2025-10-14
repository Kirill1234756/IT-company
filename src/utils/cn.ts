import { twMerge } from 'tailwind-merge'

type ClassValue = string | number | null | undefined | false | Record<string, boolean> | Array<ClassValue>

function toClassName(value: ClassValue): string {
  if (!value) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (Array.isArray(value)) return value.map(toClassName).filter(Boolean).join(' ')
  if (typeof value === 'object') {
    return Object.keys(value)
      .filter((key) => (value as Record<string, boolean>)[key])
      .join(' ')
  }
  return ''
}

export function cn(...inputs: ClassValue[]) {
  const cls = inputs.map(toClassName).filter(Boolean).join(' ')
  return twMerge(cls)
}


