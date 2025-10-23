/// <reference types="types-for-adobe/AfterEffects/24.6"/>

// $types
import { Lyric } from "$types/lyrics";
import { Time } from "$types/times";

// $utils
import { parseLyrics } from "$utils/parseLyrics";
import { parseTimes } from "$utils/parseTImes";
import { TimecodeToSeconds } from "./utils/timecodeToSeconds";

// $windows
import { getLyricsInput } from "$windows/inputLyrics";
import { getTimesInput } from "$windows/inputTimes";

// 복제할 레이어
const initPronounceLayerName = "Initial Pronounce Layer";
const initTranslationLayerName = "Initial Translation Layer";
const comp = app.project.activeItem as CompItem;

// 생성된 레이어들을 담을 배열
const pronounceLayers: Layer[] = [];
const translationLayers: Layer[] = [];

export function main(thisObj?: Panel) {
  var lyrics: Lyric[] = [];
  var times: Time[] = [];

  // 가사 입력 받기
  var lyrics_input = getLyricsInput(thisObj);
  if (lyrics_input === "CANCEL") {
    alert("취소되었습니다.");
    return;
  }

  // 시간 입력 받기
  var times_input = getTimesInput(thisObj);
  if (times_input === "CANCEL") {
    alert("취소되었습니다.");
    return;
  }

  // 입력받은 데이터 처리
  lyrics = parseLyrics(lyrics_input);
  times = parseTimes(times_input);

  // 발음 레이어 생성 Undo 그룹 시작
  app.beginUndoGroup("Generate Layers");

  // 레이어 추가
  for (var i = 0; i < lyrics.length; i++) {
    var newTranslationLayer = comp.layer(initTranslationLayerName).duplicate();
    var newPronounceLayer = comp.layer(initPronounceLayerName).duplicate();

    newPronounceLayer.enabled = true;
    newTranslationLayer.enabled = true;

    newTranslationLayer.moveToBeginning();
    newPronounceLayer.moveToBeginning();

    var jp = lyrics[i][0];
    var pr = lyrics[i][1];
    var kr = lyrics[i][2];

    // 레이어 이름 변경
    newTranslationLayer.name = kr;
    newPronounceLayer.name = pr;

    // 번역 텍스트 변경
    var translationTextProp = newTranslationLayer
      .property("ADBE Text Properties")
      .property("ADBE Text Document") as any;
    var translation_td = new TextDocument(jp + "\r" + kr);
    translationTextProp.setValue(translation_td);

    // 발음 텍스트 변경
    var pronounceTextProp = newPronounceLayer
      .property("ADBE Text Properties")
      .property("ADBE Text Document") as any;
    var pronounce_td = new TextDocument(pr);
    pronounceTextProp.setValue(pronounce_td);

    // 번역 레이어 시작 시간 설정
    newTranslationLayer.startTime = TimecodeToSeconds(times[i + 3]);
    newTranslationLayer.outPoint = TimecodeToSeconds(times[i + 4]);

    // 발음 레이어 시작 시간 설정
    newPronounceLayer.startTime = TimecodeToSeconds(times[i]);
    newPronounceLayer.outPoint = TimecodeToSeconds(times[i + 5]) + 4;

    // 발음 레이어는 생성된 레이어 배열에 추가
    pronounceLayers.push(newPronounceLayer);
  }

  // 발음 레이어에 마커 추가
  const state = [
    "Pre-Enter",
    "Ready",
    "Focus",
    "Passed",
    "Post-Exit",
    "Post-Hide",
  ];
  for (var i = 0; i < lyrics.length; i++) {
    var marker = pronounceLayers[i].property("Marker") as Property;
    for (let j = 0; j <= 5; j++) {
      const t = TimecodeToSeconds(times[i + j + 1]);
      marker.setValueAtTime(t, new MarkerValue(state[j]));
    }
  }

  // 발음 레이어 생성 Undo 그룹 종료
  app.endUndoGroup();
}

main();
