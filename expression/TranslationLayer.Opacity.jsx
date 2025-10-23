fadeDur = 0.4; // 페이드 지속 시간(초)
fadeInMax = 40; // 페이드인 시 최종 Opacity
fadeOutMax = 40; // 페이드아웃 시작 시 Opacity

tIn = inPoint;
tOut = outPoint;

if (time < tIn) {
  0;
} else if (time < tIn + fadeDur) {
  ease(time, tIn, tIn + fadeDur, 0, fadeInMax);
} else if (time < tOut - fadeDur) {
  fadeInMax;
} else if (time < tOut) {
  ease(time, tOut - fadeDur, tOut, fadeOutMax, 0);
} else {
  0;
}
