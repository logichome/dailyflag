/**
 * 补零
 * @param num： 被操作数
 * @param n： 固定的总位数
*/
export function prefixZero(num: number | string, n: number): string {
  return (Array(n).join('0') + num).slice(-n)
}

/**
 * 日期格式化
 * @param date 日期
 * @param formatTemp YYYY-MM-DD
*/
export function formatDate(date: Date = new Date(),formatTemp: string = 'YYYY-MM-DD') {
  const year = String(date.getFullYear())
  const month = prefixZero(date.getMonth() + 1, 2)
  const day = prefixZero(date.getDate(), 2)
  return formatTemp.replace(/YYYY/g, year).replace(/MM/g, month).replace(/DD/g, day)
}

/**
 * 转菊花
 * @param title 菊花下面的文字，为 close 时隐藏菊花
 */
export function showLoading(title: string = '加载中...', mask: boolean = true) {
  if (title === 'close') {
    wx.hideLoading()
  } else {
    wx.showLoading({
      title,
      mask
    })
  }
}