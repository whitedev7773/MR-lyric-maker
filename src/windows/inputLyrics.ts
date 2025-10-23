/// <reference types="types-for-adobe/AfterEffects/24.6" />
/// <reference path="./scriptui-fix.d.ts" />

export function buildUI(thisObj?: Panel): Window | Panel {
  const win = (thisObj ||
    new Window("palette", "My Script", undefined)) as Window;

  const grp = win.add("group", undefined) as Group;
  grp.orientation = "row";

  const btn = grp.add("button", undefined, "Click Me") as Button;
  btn.onClick = () => alert("clicked!");

  if (win instanceof Window) {
    win.center();
    win.show();
  }

  return win;
}

buildUI();
