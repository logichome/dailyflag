export const request = ({data = {}, url = '', method = 'GET'}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      method,
      success(res) {
        console.log(url, 'success', res)
        if (res.data?.code === 0) {
          console.log(url, 'success', res)
          resolve(res.data)
        } else {
          console.error(url, 'error', res)
          reject(res)
        }
      },
      fail(err) {
        console.error(url, 'error', err)
        reject(err)
      }
    })
  })
}

export const requestJson = ({data = {}, url = '', method = 'GET'}) => {
  const t = parseInt(String(new Date().getTime() / 60000))
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + `?t=${t}`,
      data,
      method,
      success(res) {
        console.log(url, 'success(json)', res)
        resolve(res.data)
      },
      fail(err) {
        console.error(url, 'error(json)', err)
        reject(err)
      }
    })
  })
}
