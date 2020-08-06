import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Input, Form, Button } from '@tarojs/components'
import { ITodoContent, FilterTag } from '../../type' 
import Taro from '@tarojs/taro'
import moment from 'moment'
import './todoListIndex.styl'
import { apiGetTodoList, apiEditTodo, apiAddTodo } from '@/apis/todoList'
import TodoForm from '../../components/TodoForm/todoForm'
import Popup from '@/components/Popup/Popup'
export default function Index() {
  const date: Date = new Date()
  interface ITodoContentGroup {
    expectDate: string,
    list: ITodoContent[]
  }

  const [todoList, setTodoList] = useState<ITodoContent[]>([])  // 列表
  const [todoFormVisible, setTodoFormVisible] = useState<boolean>(false)  // 表单弹窗展示
  const [currentTodo, setCurrentTodo] = useState<ITodoContent | null>(null)  // 当前编辑的项目
  const [spreadId, setSpreadId] = useState<number>(0)  // 当前展开的项目id
  const [currentFilterTag, setCurrentFilterTag] = useState<FilterTag>(FilterTag.all)  // 当前展开的项目id

  // 列表格式化
  const showList:ITodoContentGroup[] = useMemo(() => {
    let groupList: ITodoContentGroup[] = []
    todoList.map(item => {
      // 查找是否已经存在该日期的项目
      const targetGroup: ITodoContentGroup | undefined = groupList.find(group => group.expectDate === item.expectDate)
      if (targetGroup) {
        targetGroup.list.push(item)
      } else {
        groupList.push({
          expectDate: item.expectDate,
          list: [item]
        })
      }
    })
    return groupList
  }, [todoList])

  // 初始化
  useEffect(() => {
    getTodoList()
  }, [currentFilterTag])

  // 列表更新时保存
  useEffect(() => {
    // saveData()
  }, [todoList])

  // 获取列表
  async function getTodoList() {
    try {
      const list = await apiGetTodoList({filter: currentFilterTag})
      setTodoList(list)
    } catch (error) {
      console.error(error)
    }
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
  async function deleteTodo(id: number) {
    Taro.showModal({
      content: '要咕咕咕了吗？'
    }).then(async res => {
      if (res.confirm) {
        console.log('deleteTodo')
        await apiEditTodo({id, isDeleted: true})
        getTodoList()
      }
    })
  }

  // 编辑项目
  function editTodo(id: number): void {
    console.log('editTodo')
    setCurrentTodo(todoList.find(todo => todo.id === id) || null)
    setTodoFormVisible(true)
  }

  // 完成项目
  async function finishTodo(id: number) {
    console.log('finishTodo')
    await apiEditTodo({id, isFinished: true})
    getTodoList()
  }

  // 编辑提交
  async function editSubmit(formDate) {
    console.log('editSubmit')
    setTodoFormVisible(false)
    await apiEditTodo(formDate)
    getTodoList()
  }

  // 增加提交
  async function addSubmit(formDate) {
    console.log('addSubmit', formDate)
    setTodoFormVisible(false)
    await apiAddTodo(formDate)
    getTodoList()
  }

  // tag 切换
  function changeFilterTag(tag: FilterTag) {
    if (tag !== currentFilterTag) {
      setCurrentFilterTag(tag)
      setSpreadId(0)
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
        <Button className="small add" type='primary' onClick={addTodo}>新增</Button>
        <View className="filter-list">
          <Button className="small" key="all" type={currentFilterTag === FilterTag.all ? 'primary' : 'default'} onClick={() => changeFilterTag(FilterTag.all)}>全部</Button>
          <Button className="small" key="finished" type={currentFilterTag === FilterTag.finished ? 'primary' : 'default'} onClick={() => changeFilterTag(FilterTag.finished)}>已完成</Button>
          <Button className="small" key="unfinished" type={currentFilterTag === FilterTag.unfinished ? 'primary' : 'default'} onClick={() => changeFilterTag(FilterTag.unfinished)}>未完成</Button>
          <Button className="small" key="rubbish" type={currentFilterTag === FilterTag.rubbish ? 'primary' : 'default'} onClick={() => changeFilterTag(FilterTag.rubbish)}>垃圾桶</Button>
        </View>
      </View>
      {/* 列表 */}
      <View className="todo-list">
        {showList.length === 0 && <View className="no-data">暂无数据</View>}
        {showList.map((group, index) => (<View key={index} className="group-item">
          <View className="group-date">{moment(group.expectDate).format('ll')}</View>
          {group.list.map(todoItem => <View className="todo-item" key={todoItem.id}>
            <View className="item-main" onClick={() => spreadTodo(todoItem.id)}>
              <View className={`todo-item-title ${todoItem.isFinished && 'finished'}`}>{todoItem.title}</View>
              <View className="finish-status">{todoItem.isFinished ? '已完成' : '未完成'}</View>
            </View>
            <View className={`item-detail ${spreadId === todoItem.id && 'show'}`}>
              <View className="item-info">
                <View className="info-item">
                  <View className="info-item-label">创建时间</View>
                  <View className="info-item-value">{moment(todoItem.createdAt).startOf('hour').fromNow()}</View>
                </View>
              </View>
              <View className="btns">
                <View className="left">
                  {!todoItem.isFinished && <Button className="small" type='primary' onClick={() => {finishTodo(todoItem.id)}}>完成</Button>}
                  <Button className="small" type='default' onClick={() => {editTodo(todoItem.id)}}>编辑</Button>
                  <Button className="small" type='warn' onClick={() => {deleteTodo(todoItem.id)}}>删除</Button>
                </View>
                <View className="right">
                  <View className="fold-btn" onClick={() => spreadTodo(todoItem.id)}>收起</View>
                </View>
              </View>
            </View>
          </View>)}
        </View>))}
      </View>
    </View>
  )
}