import { InvalidTimesError } from "$errors/invalidTimesError";
import type { Time } from "$types/times";

const config = {
  fps: 60, // 프레임 수
};

function checkValidated(value: string): boolean {
  // Times 형태로 변환 가능한 올바른 값인지 검사
  const lines = value.trim().split("\n");
  for (const line of lines) {
    if (!/^\d{2}:\d{2}:\d{2}:\d{2}$/.test(line.trim())) {
      return false; // 형식이 올바르지 않은 경우
    }
    const [hh, mm, ss, ff] = line
      .trim()
      .split(":")
      .map((part) => parseInt(part, 10));
    if (mm < 0 || mm >= 60 || ss < 0 || ss >= 60 || ff < 0 || ff > config.fps) {
      return false; // 분, 초, 프레임이 올바르지 않은 경우
    }
  }
  return true;
}

export function parseTimes(value: string): Time[] {
  // 값이 올바른지 검사
  if (!checkValidated(value)) {
    throw new InvalidTimesError("Invalid times format");
  }

  // Times 형태로 변환
  const lines = value.trim().split("\n");
  const times: Time[] = lines.map((line) => line.trim() as Time);
  return times;
}
