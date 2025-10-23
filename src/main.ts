/// <reference types="types-for-adobe/AfterEffects/24.6"/>

// $types
import { Lyric } from "$types/lyrics";
import { Time } from "$types/times";

// $utils
import { parseLyrics } from "$utils/parseLyrics";
import { parseTimes } from "./utils/parseTImes";
import { TimecodeToSeconds } from "./utils/timecodeToSeconds";

// $windows
import { getLyricsInput } from "$windows/inputLyrics";
import { getTimesInput } from "$windows/inputTimes";
import {
  showProgressWindow,
  updateProgress,
  closeProgressWindow,
} from "$windows/progressWindow";

const initPronounceLayerName = "Initial Pronounce Layer";
const initTranslationLayerName = "Initial Translation Layer";
const comp = app.project.activeItem as CompItem;

const pronounceLayers: Layer[] = [];

export function main(thisObj?: Panel) {
  let lyrics: Lyric[] = [];
  let times: Time[] = [];

  // 가사 입력 받기
  const lyrics_input = getLyricsInput(thisObj);
  if (lyrics_input === "CANCEL") {
    alert("취소되었습니다.");
    return;
  }

  // 시간 입력 받기
  const times_input = getTimesInput(thisObj);
  if (times_input === "CANCEL") {
    alert("취소되었습니다.");
    return;
  }

  lyrics = parseLyrics(lyrics_input);
  times = parseTimes(times_input);

  // 진행률 창 열기
  const progressWin = showProgressWindow("레이어 생성 중...", lyrics.length);

  app.beginUndoGroup("Generate Layers");

  for (let i = 0; i < lyrics.length; i++) {
    // 진행률 업데이트
    updateProgress(progressWin, i + 1);

    const newTranslationLayer = comp
      .layer(initTranslationLayerName)
      .duplicate();
    const newPronounceLayer = comp.layer(initPronounceLayerName).duplicate();

    newPronounceLayer.enabled = true;
    newTranslationLayer.enabled = true;
    newTranslationLayer.moveToBeginning();
    newPronounceLayer.moveToBeginning();

    const [jp, pr, kr] = lyrics[i];

    newTranslationLayer.name = kr;
    newPronounceLayer.name = pr;

    const translationTextProp = newTranslationLayer
      .property("ADBE Text Properties")
      .property("ADBE Text Document") as any;
    const translation_td = new TextDocument(jp + "\r" + kr);
    translationTextProp.setValue(translation_td);

    const pronounceTextProp = newPronounceLayer
      .property("ADBE Text Properties")
      .property("ADBE Text Document") as any;
    const pronounce_td = new TextDocument(pr);
    pronounceTextProp.setValue(pronounce_td);

    newTranslationLayer.startTime = TimecodeToSeconds(times[i + 3]);
    newTranslationLayer.outPoint = TimecodeToSeconds(times[i + 4]);
    newPronounceLayer.startTime = TimecodeToSeconds(times[i]);
    newPronounceLayer.outPoint = TimecodeToSeconds(times[i + 5]) + 4;

    pronounceLayers.push(newPronounceLayer);
  }

  const state = [
    "Pre-Enter",
    "Ready",
    "Focus",
    "Passed",
    "Post-Exit",
    "Post-Hide",
  ];

  for (let i = 0; i < lyrics.length; i++) {
    const marker = pronounceLayers[i].property("Marker") as Property;
    for (let j = 0; j <= 5; j++) {
      const t = TimecodeToSeconds(times[i + j + 1]);
      marker.setValueAtTime(t, new MarkerValue(state[j]));
    }
  }

  app.endUndoGroup();

  // 진행 완료 후 창 닫기
  closeProgressWindow(progressWin);
}

main();
