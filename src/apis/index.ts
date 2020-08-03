import Taro from '@tarojs/taro'

export const getTodoList = ():TodoContent[] => {
  return Taro.getStorageSync('TODO_LIST') || []
}

export const setTodoList = (list: TodoContent[]): void => {
  Taro.setStorageSync('TODO_LIST', list) || []
}