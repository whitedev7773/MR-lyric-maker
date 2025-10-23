// es5 환경에서는 String.prototype.replaceAll이 없으므로 대체 함수 작성
export function replaceAll(
  target: string,
  searchValue: string,
  replaceValue: string
): string {
  return target.split(searchValue).join(replaceValue);
}
