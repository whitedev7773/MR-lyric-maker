// 유저가 취소했을 때
export class UserInterrupt extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserInterrupt";
  }
}
