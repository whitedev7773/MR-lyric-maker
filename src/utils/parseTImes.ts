import { InvalidTimesError } from "$errors/invalidTimesError";

import type { Time } from "$types/times";

import { trim } from "$utils/string/trim";
import { map } from "./array/map";

const config = {
  fps: 60, // 프레임 수
};

function checkValidated(value: string): boolean {
  // Times 형태로 변환 가능한 올바른 값인지 검사
  const lines = trim(value).split("\n");
  for (const line of lines) {
    if (!/^\d{2}:\d{2}:\d{2}:\d{2}$/.test(trim(line))) {
      return false; // 형식이 올바르지 않은 경우
    }
    // const [hh, mm, ss, ff] = trim(line)
    //   .split(":")
    //   .map((part) => parseInt(part, 10));
    const [hh, mm, ss, ff] = map(trim(line).split(":"), (part) =>
      parseInt(part, 10)
    );
    if (mm < 0 || mm >= 60 || ss < 0 || ss >= 60 || ff < 0 || ff > config.fps) {
      return false; // 분, 초, 프레임이 올바르지 않은 경우
    }
  }
  return true;
}

// Time과 second를 받으면 해당 Time에 seconds를 더한 새로운 Time을 반환하는 함수
function addTime(time: Time, seconds: number): Time {
  const [hh, mm, ss, ff] = map(time.split(":"), (part) => parseInt(part, 10));
  let totalFrames =
    hh * 3600 * config.fps + mm * 60 * config.fps + ss * config.fps + ff;
  totalFrames += seconds * config.fps;
  const newHh = Math.floor(totalFrames / (3600 * config.fps));
  const newMm = Math.floor(
    (totalFrames % (3600 * config.fps)) / (60 * config.fps)
  );
  const newSs = Math.floor((totalFrames % (60 * config.fps)) / config.fps);
  const newFf = totalFrames % config.fps;
  return `${newHh}:${newMm}:${newSs}:${newFf}`;
}

export function parseTimes(value: string): Time[] {
  // 값이 올바른지 검사
  if (!checkValidated(value)) {
    throw new InvalidTimesError("Invalid times format");
  }

  // Times 형태로 변환
  const lines = trim(value).split("\n");
  // const times: Time[] = lines.map((line) => trim(line) as Time);
  const times: Time[] = map(lines, (line) => trim(line) as Time);

  // 안정성을 위에 7개의 Time을 마지막 Time에서부터 2초 간격으로 추가
  const lastTime = times[times.length - 1];
  for (let i = 1; i <= 7; i++) {
    const newTime = addTime(lastTime, i * 2);
    times.push(newTime);
  }

  return times;
}
