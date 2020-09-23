export default function request(params) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      ...params
    }).then(res => {
      if (res.result && res.result.code === 0) {
        resolve(res.result.data)
      } else if (res.result) {
        reject(res.result)
      } else {
        reject(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}