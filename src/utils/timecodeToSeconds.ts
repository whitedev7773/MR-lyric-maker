import { Time } from "$src/types/times";

export function TimecodeToSeconds(timecode: Time): number {
  var timeArray = timecode.split(":");
  var hours = parseInt(timeArray[0], 10);
  var minutes = parseInt(timeArray[1], 10);
  var seconds = parseInt(timeArray[2], 10);
  var frames = parseInt(timeArray[3], 10);

  return hours * 3600 + minutes * 60 + seconds + frames / 60;
}
