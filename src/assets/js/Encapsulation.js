import covers from '../img/user/default_avatar.jpg'
export const time = (time = +new Date()) => {
  var date = new Date(time + 8 * 3600 * 1000) // 增加8小时

  return date.toJSON().substr(0, 19).replace('T', ' ')
} // 时间戳转换为时间
export const formatSeconds = (value) => {
  let result = parseInt(value)
  const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
  const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
  const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
  result = `${h}:${m}:${s}`
  return result
}
export const isHttp = (str, cover) => {
  if (!str) {
    if (cover) {
      return covers
    } else {
      return ''
    }
  }
  if (str.slice(0, 4) === 'http') {
    return str
  } else {
    return process.env.VUE_APP_API_ROOT + str
  }
}
