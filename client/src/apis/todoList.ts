import Taro from '@tarojs/taro'
import {ITodoContent, FilterTag}  from '../todoList/type'

export const apiGetTodoList = (data) => {
  const originList = Taro.getStorageSync('TODO_LIST') || []
  const filterList = originList.filter(item => {
    let flag: boolean = false
    switch (data.filter) {
      case FilterTag.all:
        flag = !item.isDeleted
        break
      case FilterTag.finished:
        flag = item.isFinished && !item.isDeleted
        break
      case FilterTag.unfinished:
        flag = !item.isFinished && !item.isDeleted
        break
      case FilterTag.rubbish:
        flag = item.isDeleted
        break
      }
    return flag
  })
  console.log('data.filter', data.filter, filterList)
  return Promise.resolve(filterList)
}

export const apiAddTodo = (data) => {
  // const originList = Taro.getStorageSync('TODO_LIST') || []
  // const date: Date = new Date()
  // const nowDate = date.getTime()
  // console.log('nowDate!!', nowDate)
  const newItem: ITodoContent = {
    // id: nowDate,
    // isFinished: false,
    // isDeleted: false,
    // createdAt: nowDate,
    // updateAt: nowDate,
    ...data
  }
  // originList.push(newItem)
  // Taro.setStorageSync('TODO_LIST', originList)
  wx.cloud.callFunction({
    name: 'todos_add',
    data: {
      todo: newItem
    }
  })
  return Promise.resolve()
}

export const apiEditTodo = (data: any) => {
  const originList = Taro.getStorageSync('TODO_LIST') || []
  const date: Date = new Date()
  const updateAt = date.getTime()
  const newList = originList.map(todo => todo.id === data.id ? {...todo, ...data, updateAt} : todo)
  Taro.setStorageSync('TODO_LIST', newList)
  return Promise.resolve()
}