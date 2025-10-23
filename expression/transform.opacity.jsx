const config = thisComp.layer("Config");

// ─────────────────────────────────────────────
// 레이어 설정
// ─────────────────────────────────────────────
var layer = [];
for (let i = 0; i <= 6; i++) {
  layer[i] = thisComp.layer("Lyrics " + i).transform.opacity;
}

// ─────────────────────────────────────────────
// Cubic Bezier 계산
// ─────────────────────────────────────────────
function cubicBezier(t) {
  const p0 = config.effect("Bezier Start Point")(1);
  const p1 = config.effect("Control Point 1")(1);
  const p2 = config.effect("Control Point 2")(1);
  const p3 = config.effect("Bezier End Point")(1);

  const u = 1 - t;
  const uu = u * u;
  const tt = t * t;
  return u * uu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + tt * t * p3;
}

// ─────────────────────────────────────────────
// 상태 정의
// ─────────────────────────────────────────────
const fadeTime = config.effect("Transition Duration (second)")(1);

const pre_hide = layer[6];
const pre_enter = layer[5];
const ready = layer[4];
const focus = layer[3];
const passed = layer[2];
const post_exit = layer[1];
const post_hide = layer[0];

// ─────────────────────────────────────────────
// 마커 등록 (0~5 + Focus)
// ─────────────────────────────────────────────
var marker = {
  pre_hide: thisLayer.startTime,
  pre_enter: 0,
  ready: 0,
  focus: 0,
  passed: 0,
  post_exit: 0,
  post_hide: 0,
};

if (thisLayer.marker.numKeys > 0) {
  for (var i = 1; i <= thisLayer.marker.numKeys; i++) {
    var key = thisLayer.marker.key(i);
    switch (key.comment) {
      case "Pre-Enter":
        marker.pre_enter = key.time;
        break;
      case "Ready":
        marker.ready = key.time;
        break;
      case "Focus":
        marker.focus = key.time;
        break;
      case "Passed":
        marker.passed = key.time;
        break;
      case "Post-Exit":
        marker.post_exit = key.time;
        break;
      case "Post-Hide":
        marker.post_hide = key.time;
        break;
    }
  }
}

// ─────────────────────────────────────────────
// 보간 함수
// ─────────────────────────────────────────────
function interpolate(start, end, t) {
  const ease = cubicBezier(t);
  return [
    linear(ease, 0, 1, start, end),
    // linear(ease, 0, 1, start[1], end[1]),
  ];
}

// Pre-Hide(thisLayer.startTime) → Pre-Enter → Ready → Focus → Passed → Post-Exit → Post-Hide

// ─────────────────────────────────────────────
// 시간 구간별 상태
// ─────────────────────────────────────────────
const t = time;

// Pre-Hide
if (t < marker.pre_enter) {
  pre_hide;
}

// Pre-Hide → Pre-Enter
else if (marker.pre_enter <= t && t <= marker.pre_enter + fadeTime) {
  const progress = (t - marker.pre_enter) / fadeTime;
  interpolate(pre_hide, pre_enter, progress);
}
// Pre-Enter
else if (marker.pre_enter + fadeTime <= t && t < marker.ready) {
  pre_enter;
}

// Pre-Enter → Ready
else if (marker.ready <= t && t <= marker.ready + fadeTime) {
  const progress = (t - marker.ready) / fadeTime;
  interpolate(pre_enter, ready, progress);
}
// Ready
else if (marker.ready + fadeTime <= t && t < marker.focus) {
  ready;
}

// Ready → Focus
else if (marker.focus <= t && t <= marker.focus + fadeTime) {
  const progress = (t - marker.focus) / fadeTime;
  interpolate(ready, focus, progress);
}
// Focus
else if (marker.focus + fadeTime <= t && t < marker.passed) {
  focus;
}

// Focus → Passed
else if (marker.passed <= t && t <= marker.passed + fadeTime) {
  const progress = (t - marker.passed) / fadeTime;
  interpolate(focus, passed, progress);
}
// Passed
else if (marker.passed + fadeTime <= t && t < marker.post_exit) {
  passed;
}

// Passed → Post-Exit
else if (marker.post_exit <= t && t <= marker.post_exit + fadeTime) {
  const progress = (t - marker.post_exit) / fadeTime;
  interpolate(passed, post_exit, progress);
}
// Post-Exit
else if (marker.post_exit + fadeTime <= t && t < marker.post_hide) {
  post_exit;
}

// Post-Exit → Post-Hide
else if (marker.post_hide <= t && t <= marker.post_hide + fadeTime) {
  const progress = (t - marker.post_hide) / fadeTime;
  interpolate(post_exit, post_hide, progress);
}
// Post-Hide
else {
  post_hide;
}
