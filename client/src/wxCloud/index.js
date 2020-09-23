
let hasInit = false
export function initCloud() {
  if (process.env.TARO_ENV === 'weapp' && wx.cloud && !hasInit) {
    wx.cloud.init({
      traceUser: true
    })
    hasInit = true
    wx.cloud.callFunction({
      name: 'login',
    })
  }
}