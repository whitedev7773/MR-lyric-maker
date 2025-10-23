/// <reference types="types-for-adobe/AfterEffects/24.6" />
/// <reference path="./.scriptui-fix.d.ts" />

export function getTimesInput(thisObj?: Panel): string {
  var userInput = "";

  var window = new Window("dialog", "시간 입력");

  // 타이틀
  var titleGroup = window.add("group", undefined);
  titleGroup.add("statictext", undefined, "시간를 입력해주세요.");
  titleGroup.add("statictext", undefined, "시간의 예시는 아래와 같아요.");

  // 설명
  var descGroup = window.add("group");
  descGroup.add("statictext", undefined, "00:00:00:00");
  descGroup.add("statictext", undefined, "00:00:02:23");
  descGroup.add("statictext", undefined, "00:00:05:41");

  // 입력창
  var textInput = window.add("edittext" as any, undefined, "", {
    multiline: true,
    scrolling: true,
  }) as EditText;
  textInput.size = [400, 150];

  // 버튼
  var buttonGroup = window.add("group");
  var okButton = buttonGroup.add("button", undefined, "다음");
  var cancelButton = buttonGroup.add("button", undefined, "취소");

  // 버튼 동작
  okButton.onClick = function () {
    userInput = textInput.text;
    window.close();
  };

  cancelButton.onClick = function () {
    userInput = "CANCEL";
    window.close();
  };

  // 최종 표시
  window.show();

  return userInput; // 입력된 가사 반환
}
