import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Input, Form, Button } from '@tarojs/components'
import './index.styl'
import { getTodoList, setTodoList } from '@/apis/index'

export default function Index() {
  const date: Date = new Date()

  const [todoList, updateTodoList] = useState<TodoContent[]>([])
  const [inputVisible, setInputVisible] = useState<boolean>(false)
  const showList:TodoContent[] = useMemo(() => todoList.filter(item => !item.isDeleted) ,[todoList])

  useEffect(() => {
    initData()
  }, [])

  useEffect(() => {
    saveData()
  }, [todoList])

  function initData(): void {
    updateTodoList(getTodoList())
  }

  function saveData(): void {
    setTodoList(todoList)
    console.log('newList', todoList)
  }

  function add(): void {
    setInputVisible(true)
  }

  function deleteTodo(id: number): void {
    const newList = todoList.map(todo => todo.id === id ? {...todo, isDeleted: true} : todo)
    updateTodoList(newList)
  }

  function submit(e): void {
    setInputVisible(false)
    const {title} = e.detail.value
    if (title) {
      const newItem: TodoContent = {
        id: date.getTime(),
        title,
        isFinished: false,
        isDeleted: false
      }
      const newList: TodoContent[]= [newItem].concat(todoList)
      updateTodoList(newList)
    }
  }

  return (
    <View>
      <View className="add" onClick={add}>add</View>
      {inputVisible && <Form onSubmit={submit} >
        <Input type='text' name="title" placeholder='最大输入长度为 10' maxlength={10}/>
        <Button form-type="submit">submit</Button>
      </Form>}
      <View className="todo-list">
        {showList.map(todoItem => <View className="todo-item" key={todoItem.id}>
          <View className="todo-item-title">{todoItem.title}</View>
          <Button onClick={() => {deleteTodo(todoItem.id)}}>delete</Button>
        </View>)}
      </View>
    </View>
  )
}