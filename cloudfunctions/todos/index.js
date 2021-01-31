const TcbRouter = require('tcb-router')
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const paramsFilter = (obj, arr) => {
  const res = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && arr.indexOf(key) > -1) {
      res[key] = obj[key]
    }
  }
  return res
}

exports.main = (event, context) => {
  const app = new TcbRouter({
    event
  })
  const wxContext = cloud.getWXContext()

  // app.use 表示该中间件会适用于所有的路由
  app.use(async (ctx, next) => {
    ctx.data = {}
    await next() // 执行下一中间件
  })

  // 新增待办选项
  app.router('add', async (ctx) => {
    const date = new Date()
    const nowDate = date.getTime()
    await db.collection('todos').add({
      data: {
        _openid: wxContext.OPENID,
        isFinished: false,
        status: 0,
        createdAt: nowDate,
        updateAt: nowDate,
        ...event.todo
      },
    })
    ctx.body = {
      code: 0,
      data: ctx.data,
      msg: 'success'
    }
  })


  // 获取待办列表
  app.router('get', async (ctx) => {
    // filter 0--all 1--finished 2--unfinished 3--rubbish
    let params = {}
    switch (event.filter) {
      case 1:
        // 已完成
        params = {
          isFinished: true,
          status: 0
        }
        break
      case 2:
        // 未完成
        params = {
          isFinished: false,
          status: 0
        }
        break
      case 3:
        // 垃圾桶
        params = {
          status: 49
        }
        break
      case 0:
      default:
        // 全部
        params = {
          status: 0
        }
        break
    }
    const MAX_LIMIT = 20
    const page = event.page ? event.page - 1 : 0
    const countResult = await db.collection('todos')
    .where({
      _openid: wxContext.OPENID,
      ...params
    })
    .count()
    const res = await db.collection('todos').where({
      _openid: wxContext.OPENID,
      ...params
    })
    .orderBy('createdAt', 'desc')
    .skip((page) * MAX_LIMIT).limit(MAX_LIMIT).get()
    console.log('get--------------', wxContext.OPENID, res)
    ctx.body = {
      code: 0,
      data: {
        total: countResult.total,
        list: res.data.map(item => ({
          id: item._id,
          title: item.title,
          missionType: item.missionType,
          isFinished: item.isFinished,
          expectDate: item.expectDate,
          createdAt: item.createdAt,
          updateAt: item.updateAt,
          status: item.status
        }))
      },
      msg: 'success'
    }
  })

  // 编辑待办选项
  app.router('edit', async (ctx) => {
    const date = new Date()
    const nowDate = date.getTime()
    const updateData = paramsFilter(event, ['title', 'expectDate', 'missionType', 'isFinished'])
    const res = await db.collection('todos').where({
      _openid: wxContext.OPENID,
      _id: event.id
    }).update({
      data: {
        updateAt: nowDate,
        ...updateData
      },
    })
    console.log('edit--------', wxContext.OPENID, res)
    ctx.body = {
      code: 0,
      data: null,
      msg: 'success'
    }
  })

  // 删除待办选项
  app.router('delete', async (ctx) => {
    const date = new Date()
    const nowDate = date.getTime()
    const res = await db.collection('todos').where({
      _openid: wxContext.OPENID,
      _id: event.id
    }).update({
      data: {
        status: 49,
        updateAt: nowDate
      },
    })
    console.log('delete--------', wxContext.OPENID, res)
    ctx.body = {
      code: 0,
      data: null,
      msg: 'success'
    }
  })

  return app.serve()

}