// 잘못된 가사를 입력한 오류
export class InvalidLyricsError extends SyntaxError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidLyricError";
  }
}
