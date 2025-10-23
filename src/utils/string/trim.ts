// es5 환경에서는 String.prototype.trim이 없으므로 대체 함수 작성
export function trim(value: string): string {
  return value.replace(/^\s+|\s+$/g, "");
}
