import { InvalidLyricsError } from "$errors/invalidLyricsError";

import type { Lyric } from "$types/lyrics";

import { replaceAll } from "$src/utils/string/replaceAll";
import { trim } from "$utils/string/trim";

// textarea 예시
/*
원문1
발음1
번역1

원문2
발음2
번역2

...
*/

function checkValidated(value: string): boolean {
  // LyricsStructure 형태로 변환 가능한 올바른 값인지 검사
  const lines = trim(value).split("\n");
  for (let i = 0; i < lines.length; i += 4) {
    if (i + 2 >= lines.length) {
      return false; // 발음과 번역이 없는 경우
    }
    if (
      trim(lines[i]) === "" ||
      trim(lines[i + 1]) === "" ||
      trim(lines[i + 2]) === ""
    ) {
      return false; // 원문, 발음, 번역 중 하나라도 빈 줄인 경우
    }
  }
  return true;
}

export function parseLyrics(value: string): Lyric[] {
  const blank = "/b";

  value = replaceAll(value, blank, "ㅤ");

  // 값이 올바른지 검사
  if (!checkValidated(value)) {
    throw new InvalidLyricsError("Invalid lyrics format");
  }

  // Lyrics 형태로 변환
  const lines = trim(value).split("\n");
  const lyrics: Lyric[] = [];

  lyrics.push(["", "", ""]);

  for (let i = 0; i < lines.length; i += 4) {
    const original = trim(lines[i]);
    const pronunciation = trim(lines[i + 1]);
    const translation = trim(lines[i + 2]);
    lyrics.push([original, pronunciation, translation]);
  }

  // 안정성을 위해 마지막에 빈 Lyric를 6개 추가
  lyrics.push(["", "", ""]);

  return lyrics;
}
