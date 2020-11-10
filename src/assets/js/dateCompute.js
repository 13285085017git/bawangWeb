
var ONE_MINUTE = 60000;
var ONE_HOUR = 3600000;
var ONE_DAY = 86400000;
var ONE_WEEK = 604800000;


var ONE_SECOND_AGO = "秒前";
var ONE_MINUTE_AGO = "分钟前";
var ONE_HOUR_AGO = "小时前";
var ONE_DAY_AGO = "天前";
var ONE_MONTH_AGO = "个月前";
var ONE_YEAR_AGO = "年前";

const getTimeDuration = (datetime) => {
  const time = datetime * 1000;
  const now = new Date().getTime();
  const res = now-time;

  if (res < 1 * ONE_MINUTE) {
    return "刚刚";
  }
  if (res < 60 * ONE_MINUTE){
    const minutes = toMinutes(res);
    return Math.floor(minutes <= 0 ? 1 : minutes).toString() + ONE_MINUTE_AGO;
  }
  if (res < 24 * ONE_HOUR){
    const hours = toHours(res);
    return Math.floor(hours <= 0 ? 1 : hours).toString() + ONE_HOUR_AGO;
  }
  if (res < 48 * ONE_HOUR){
    return "昨天";
  }else {
    return getTimeDate(datetime);
  }
}

export const toSeconds = (date) => {
  return date / 1000;
}
export const toMinutes = (date) => {
  return toSeconds(date) / 60;
}
export const toHours = (date) => {
  return toMinutes(date) / 60;
}
export const toDays = (date) => {
  return toHours(date) / 24;
}
export const toMonths = (date) => {
  return toDays(date) / 30;
}
export const toYears = (date) => {
  return toMonths(date) / 365;
}

export const getTimeDate = (comTime) => {
  const comparMonth = new Date(comTime * 1000).getMonth();
  const comparDate = new Date(comTime * 1000).getDate();
  const comparDay = new Date(comTime * 1000).getDay();
  var day = '';
  switch (comparDay) {
    case 0:
      day = "星期天";
      break;
    case 1:
      day = "星期一";
      break;
    case 2:
      day = "星期二";
      break;
    case 3:
      day = "星期三";
      break;
    case 4:
      day = "星期四";
      break;
    case 5:
      day = "星期五";
      break;
    case 6:
      day = "星期六";
  }
  var month = '';
  switch (comparMonth) {
    case 0:
      month = "1月";
      break;
    case 1:
      month = "2月";
      break;
    case 2:
      month = "3月";
      break;
    case 3:
      month = "4月";
      break;
    case 4:
      month = "5月";
      break;
    case 5:
      month = "6月";
      break;
    case 6:
      month = "7月";
      break;
    case 7:
      month = "8月";
      break;
    case 8:
      month = "9月";
      break;
    case 9:
      month = "10月";
      break;
    case 10:
      month = "11月";
      break;
    case 11:
      month = "12月";
  }
  return month + comparDate + '日  ' + day;
}
export default {
  getTimeDuration
}
