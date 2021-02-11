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

// 今日打卡记录
const getTodayRecord = _ => {
  return parseInt(new Date().getTime()/86400000) * 86400000
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

  // 新增打卡项
  app.router('add', async (ctx) => {
    const date = new Date()
    const nowDate = date.getTime()
    await db.collection('clocks').add({
      data: {
        _openid: wxContext.OPENID,
        status: 0,
        records: [],
        createdAt: nowDate,
        updateAt: nowDate,
        ...event.clock
      },
    })
    ctx.body = {
      code: 0,
      data: ctx.data,
      msg: 'success'
    }
  })


  // 获取打卡列表
  app.router('get', async (ctx) => {
    const MAX_LIMIT = 20
    const page = event.page ? event.page - 1 : 0
    const todayRec = getTodayRecord()
    const countResult = await db.collection('clocks')
      .where({
        _openid: wxContext.OPENID,
        status: 0
      })
      .count()
    const res = await db.collection('clocks').where({
      _openid: wxContext.OPENID,
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
          count: item.records.length,
          hasClockIn: item.records.indexOf(todayRec) > -1,
          createdAt: item.createdAt,
          updateAt: item.updateAt,
          status: item.status
        }))
      },
      msg: 'success'
    }
  })

  // 编辑打卡项
  app.router('edit', async (ctx) => {
    const date = new Date()
    const nowDate = date.getTime()
    const updateData = paramsFilter(event, ['title'])
    const res = await db.collection('clocks').where({
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

  // 删除打卡项
  app.router('delete', async (ctx) => {
    const date = new Date()
    const nowDate = date.getTime()
    const res = await db.collection('clocks').where({
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

  // 打卡
  app.router('clockin', async (ctx) => {
    try {
      const _ = db.command
      const date = new Date()
      const nowDate = date.getTime()
      const target = await db.collection('clocks').doc(event.id)
      const todayRec = getTodayRecord()
      const data = await target.get()
      console.log('data----', data, data.data)
      if (data.data.records.indexOf(todayRec) > -1) {
        throw(new Error('已经打过卡啦~'))
      } else if (data.data._openid !== wxContext.OPENID) {
        throw(new Error('不是你的别乱打'))
      } else {
        target.update({
          data: {
            updateAt: nowDate,
            records: _.push(getTodayRecord())
          },
        })
      }
      console.log('clockin--------', wxContext.OPENID)
      ctx.body = {
        code: 0,
        data: null,
        msg: 'success'
      }
    } catch (error) {
      console.log('clockin error', error)
      ctx.body = {
        code: -1,
        data: null,
        msg: error || '打卡失败'
      }
    }
  })

  return app.serve()

}