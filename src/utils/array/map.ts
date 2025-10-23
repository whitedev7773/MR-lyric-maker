// es5에는 Array.prototype.map() 메서드가 없으므로 대체 함수 작성
export function map<T, U>(
  array: T[],
  callback: (value: T, index: number, array: T[]) => U
): U[] {
  const result: U[] = [];
  for (let i = 0; i < array.length; i++) {
    result.push(callback(array[i], i, array));
  }
  return result;
}
