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
const initLayerName = "Initial Layer";
const comp = app.project.activeItem as CompItem;

// 생성된 레이어들을 담을 배열
const layers: Layer[] = [];

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

  // Undo 그룹 시작
  app.beginUndoGroup("Generate Lyric Layers");

  // 레이어 추가
  for (var i = 0; i < lyrics.length; i++) {
    var newLayer = comp.layer(initLayerName).duplicate();
    newLayer.moveToBeginning();

    var jp = lyrics[i][0];
    var pr = lyrics[i][1];
    var kr = lyrics[i][2];

    // 레이어 이름 변경
    newLayer.name = kr;

    // 텍스트 변경
    var textProp = newLayer
      .property("ADBE Text Properties")
      .property("ADBE Text Document") as any;
    var td = new TextDocument(jp + "\r" + pr + "\r" + kr);
    textProp.setValue(td);

    // 레이어 시작 시간 설정
    newLayer.startTime = TimecodeToSeconds(times[i]);
    newLayer.outPoint = TimecodeToSeconds(times[i + 5]) + 4;

    // 생성된 레이어 배열에 추가
    layers.push(newLayer);
  }

  // 마커 추가
  for (var i = 0; i < lyrics.length; i++) {
    var marker = layers[i].property("Marker") as Property;
    for (let j = 1; j <= 5; j++) {
      const t = TimecodeToSeconds(times[i + j]);
      marker.setValueAtTime(t, new MarkerValue(j == 3 ? "Focus" : String(j)));
    }
  }

  // Undo 그룹 종료
  app.endUndoGroup();
}

main();
