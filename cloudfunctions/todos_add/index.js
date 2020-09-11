import resuest from '../midware/result'
// import { resolve } from 'url';
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
function addTodo(data) {
  const wxContext = cloud.getWXContext()
  new Promise((resolve, reject) => {
    const date = new Date()
    const nowDate = date.getTime()
    db.collection('todos').add({
      data: {
        _openid: wxContext.OPENID,
        isFinished: false,
        isDeleted: false,
        createdAt: nowDate,
        updateAt: nowDate,
        ...data
      },
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}
exports.main = async (event, context) => {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const res = await addTodo(event.todo)
  return resuest.success(res)
}
