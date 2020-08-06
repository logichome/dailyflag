import Taro from '@tarojs/taro'

export const getTodoList = ():ITodoContent[] => {
  return Taro.getStorageSync('TODO_LIST') || []
}

export const setTodoList = (list: ITodoContent[]): void => {
  Taro.setStorageSync('TODO_LIST', list) || []
}