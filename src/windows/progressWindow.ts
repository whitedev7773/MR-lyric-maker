/// <reference types="types-for-adobe/AfterEffects/24.6"/>

/**
 * 진행률 표시 창 생성
 * @param title 창 제목
 * @param total 전체 단계 수
 * @returns {Window} 생성된 윈도우 객체
 */
export function showProgressWindow(title: string, total: number): Window {
  const w = new Window("palette", title, undefined, { closeButton: false });
  w.orientation = "column";
  w.alignChildren = ["fill", "fill"];

  const progressText = w.add("statictext", undefined, "0 / " + total);
  const progressBar = w.add("progressbar", undefined, 0, total);
  progressBar.preferredSize.width = 300;

  w.center();
  w.show();

  (w as any).progressText = progressText;
  (w as any).progressBar = progressBar;

  return w;
}

/**
 * 진행률 갱신
 * @param win showProgressWindow()로 생성된 Window
 * @param current 현재 진행 단계
 */
export function updateProgress(win: Window, current: number) {
  const progressText = (win as any).progressText as StaticText;
  const progressBar = (win as any).progressBar as Progressbar;

  progressText.text = current + " / " + progressBar.maxvalue;
  progressBar.value = current;
  // call update if available on the host Window object
  if ((win as any).update) (win as any).update();
}

/**
 * 진행 완료 후 창 닫기
 * @param win 진행 창
 */
export function closeProgressWindow(win: Window) {
  if (win && win instanceof Window) {
    win.close();
  }
}
