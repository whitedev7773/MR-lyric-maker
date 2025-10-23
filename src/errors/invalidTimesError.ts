// 잘못된 시간을 입력한 오류
export class InvalidTimesError extends SyntaxError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTimesError";
  }
}
