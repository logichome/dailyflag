import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Input, Form, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.styl'
import { getTodoList, setTodoList } from '@/apis'
import TodoForm from '@/components/TodoForm/todoForm'
import Popup from '@/components/Popup/Popup'
export default function Index() {
  const date: Date = new Date()

  const [todoList, updateTodoList] = useState<TodoContent[]>([])  // 列表
  const [todoFormVisible, setTodoFormVisible] = useState<boolean>(false)  // 表单弹窗展示
  const [currentTodo, setCurrentTodo] = useState<TodoContent | null>(null)  // 当前编辑的项目
  const [spreadId, setSpreadId] = useState<number>(0)  // 当前展开的项目id
  const showList:TodoContent[] = useMemo(() => todoList.filter(item => !item.isDeleted) ,[todoList])

  // 初始化
  useEffect(() => {
    initData()
  }, [])

  // 列表更新时保存
  useEffect(() => {
    saveData()
  }, [todoList])

  // 初始化列表
  function initData(): void {
    console.log('initData')
    updateTodoList(getTodoList())
  }

  // 保存列表
  function saveData(): void {
    console.log('saveData')
    setTodoList(todoList)
    console.log('newList', todoList)
  }

  // 展开详情
  function spreadTodo(id: number): void {
    setSpreadId(spreadId === id ? 0 : id)
  }

  // 增加项目
  function addTodo(): void {
    console.log('add')
    setCurrentTodo(null)
    setTodoFormVisible(true)
  }

  // 删除项目
  function deleteTodo(id: number): void {
    Taro.showModal({
      content: 'you sure?'
    }).then(res => {
      if (res.confirm) {
        console.log('deleteTodo')
        const newList = todoList.map(todo => todo.id === id ? {...todo, isDeleted: true} : todo)
        updateTodoList(newList)
      }
    })
  }

  // 编辑项目
  function editTodo(id: number): void {
    console.log('editTodo')
    setCurrentTodo(todoList.find(todo => todo.id === id) || null)
    setTodoFormVisible(true)
  }

  function finishTodo(id: number): void {
    console.log('finishTodo')
    const newList = todoList.map(todo => todo.id === id ? {...todo, isFinished: true} : todo)
    updateTodoList(newList)
  }

  // 编辑提交
  function editSubmit(e): void {
    console.log('editSubmit')
    setTodoFormVisible(false)
    const {title}: {title:string} = e.detail.value
    const newList = todoList.map(todo => currentTodo && todo.id === currentTodo.id ? {...todo, title} : todo)
    updateTodoList(newList)
  }

  // 增加提交
  function addSubmit(e): void {
    console.log('addSubmit')
    setTodoFormVisible(false)
    const {title}: {title:string} = e.detail.value
    if (title) {
      const newItem: TodoContent = {
        id: date.getTime(),
        title,
        isFinished: false,
        isDeleted: false,
      }
      const newList: TodoContent[]= [newItem].concat(todoList)
      updateTodoList(newList)
    }
  }

  return (
    <View>
      {/* 表单弹窗 */}
      <Popup visible={todoFormVisible} onTapMask={() => setTodoFormVisible(false)}>
        <TodoForm onSubmit={currentTodo ? editSubmit : addSubmit} currentTodo={currentTodo}  />
      </Popup>
      {/* 菜单栏 */}
      <View className="menu">
        <Button className="small add" type='primary' onClick={addTodo}>new</Button>
      </View>
      {/* 列表 */}
      <View className="todo-list">
        {showList.map(todoItem => <View className="todo-item" key={todoItem.id}>
          <View className="item-main" onClick={() => spreadTodo(todoItem.id)}>
            <View className={`todo-item-title ${todoItem.isFinished && 'finished'}`}>{todoItem.title}</View>
            <View className="finish-status">{todoItem.isFinished ? 'finished' : 'gogogo'}</View>
          </View>
          <View className={`item-detail ${spreadId === todoItem.id && 'show'}`}>
            <View className="btns">
              <Button className="small" type='primary' onClick={() => {finishTodo(todoItem.id)}}>finish</Button>
              <Button className="small" type='default' onClick={() => {editTodo(todoItem.id)}}>edit</Button>
              <Button className="small" type='warn' onClick={() => {deleteTodo(todoItem.id)}}>delete</Button>
            </View>
          </View>
        </View>)}
      </View>
    </View>
  )
}