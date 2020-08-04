import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Input, Form, Button } from '@tarojs/components'
import './index.styl'
import { getTodoList, setTodoList } from '@/apis'
import TodoForm from '@/components/TodoForm/todoForm'
import Popup from '@/components/Popup/Popup'
export default function Index() {
  const date: Date = new Date()

  const [todoList, updateTodoList] = useState<TodoContent[]>([])
  const [inputVisible, setInputVisible] = useState<boolean>(false)
  const [todoFormVisible, setTodoFormVisible] = useState<boolean>(false)
  const showList:TodoContent[] = useMemo(() => todoList.filter(item => !item.isDeleted) ,[todoList])

  useEffect(() => {
    initData()
  }, [])

  useEffect(() => {
    saveData()
  }, [todoList])

  function initData(): void {
    console.log('initData')
    updateTodoList(getTodoList())
  }

  function saveData(): void {
    console.log('saveData')
    setTodoList(todoList)
    console.log('newList', todoList)
  }

  function add(): void {
    console.log('add')
    setTodoFormVisible(true)
  }

  function deleteTodo(id: number): void {
    console.log('deleteTodo')
    const newList = todoList.map(todo => todo.id === id ? {...todo, isDeleted: true} : todo)
    updateTodoList(newList)
  }

  function editTodo(id: number): void {
    console.log('editTodo')
    const newList = todoList.map(todo => todo.id === id ? {...todo, isEditing: true} : todo)
    updateTodoList(newList)
  }

  function editSubmit(e): void {
    console.log('editSubmit')
    const newList = todoList.map(todo => todo.isEditing ? {...todo, title: e.detail.value, isEditing: false} : todo)
    updateTodoList(newList)
  }

  function addSubmit(e): void {
    console.log('addSubmit')
    setInputVisible(false)
    const {title}: {title:string} = e.detail.value
    if (title) {
      const newItem: TodoContent = {
        id: date.getTime(),
        title,
        isFinished: false,
        isDeleted: false,
        isEditing: false
      }
      const newList: TodoContent[]= [newItem].concat(todoList)
      updateTodoList(newList)
    }
  }

  return (
    <View>
      <Popup visible={todoFormVisible} onTapMask={() => setTodoFormVisible(false)}>
        <TodoForm />
      </Popup>
      <View className="add" onClick={add}>add</View>
      {/* {inputVisible && <Form onSubmit={addSubmit} >
        <Input type='text' name="title" placeholder='最大输入长度为 10' maxlength={10}/>
        <Button form-type="submit">submit</Button>
      </Form>} */}
      <View className="todo-list">
        {showList.map(todoItem => <View className="todo-item" key={todoItem.id}>
          <View className="left">
            {todoItem.isEditing
            ? <Input type='text' name="title" onBlur={editSubmit} focus={todoItem.isEditing} value={todoItem.title} placeholder='最大输入长度为 10' maxlength={10}/>
            : <View className="todo-item-title">{todoItem.title}</View>}
          </View>
          <View className="right btns">
            {todoItem.isEditing
            ? <Button type='primary'>submit</Button>
            : <Button type='primary' onClick={() => {editTodo(todoItem.id)}}>edit</Button>}
            <Button onClick={() => {deleteTodo(todoItem.id)}}>delete</Button>
          </View>
        </View>)}
      </View>
    </View>
  )
}