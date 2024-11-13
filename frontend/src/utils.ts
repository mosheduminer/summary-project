export function zip<T>(a: T[], b: T[]) {
  return Array.from(Array(Math.max(b.length, a.length)), (_, i) => [
    a[i],
    b[i],
  ]);
}
