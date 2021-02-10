import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Button, MovableArea, MovableView } from '@tarojs/components'
import { ITodoContent, FilterTag, MissionType } from '@/todoList/type'
import { showLoading, showModal } from '@/utils/common'
import {useReachBottom} from '@tarojs/taro'
import moment from 'moment'
import './todoListIndex.styl'
import { apiGetTodoList, apiEditTodo, apiAddTodo, apiDelTodo } from '@/apis/todoList'
import TodoForm from '@/todoList/components/TodoForm/TodoForm'
import Popup from '@/components/Popup/Popup'
let currentPage:number = 1
export default function Index() {
  // const date: Date = new Date()
  interface ITodoContentGroup {
    expectDate: string,
    list: ITodoContent[]
  }

  const [todoList, setTodoList] = useState<ITodoContent[]>([])  // 列表
  const [todoFormVisible, setTodoFormVisible] = useState<boolean>(false)  // 表单弹窗展示
  const [currentTodo, setCurrentTodo] = useState<ITodoContent | null>(null)  // 当前编辑的项目
  // const [spreadId, setSpreadId] = useState<string>('')  // 当前展开的项目id
  const [touchStartInfo, setTouchStartInfo] = useState<any>({}) 
  const [moveId, setMoveId] = useState<string>('')
  const [currentFilterTag, setCurrentFilterTag] = useState<FilterTag>(FilterTag.unfinished)  // 当前展开的项目id
  // 列表格式化
  const showList:ITodoContentGroup[] = useMemo(() => {
    // 排序
    todoList.sort((a, b) => a.updateAt - b.updateAt)
    // 已完成的放最下面
    todoList.sort(item => item.isFinished ? 1 : -1)
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
    // 按日期排序
    groupList.sort((b, a) => moment(a.expectDate).valueOf() - moment(b.expectDate).valueOf())
    return groupList
  }, [todoList])

  // 触底加载
  useReachBottom(() => {
    console.log('onReachBottom', currentPage)
    if (currentPage > 0) {
      currentPage += 1
      getTodoList()
    } else {
      console.log('到底了~')
    }
  })

  // 初始化
  useEffect(() => {
    setTodoList([])
    currentPage = 1
    getTodoList()
  }, [currentFilterTag])

  // 列表更新时保存
  useEffect(() => {
    // saveData()
  }, [todoList])

  // 获取列表
  async function getTodoList() {
    showLoading()
    try {
      const data: any  = await apiGetTodoList({filter: currentFilterTag, page: currentPage})
      console.log('page', currentPage, 'data', data)
      setTodoList(currentPage === 1 ? data.list : todoList.concat(data.list))
      if (data.list.length < 20) {
        currentPage = -1
      }
    } catch (error) {
      console.error(error)
    }
    showLoading('close')
  }

  // 滑动开始
  function touchS (id: string, e: any): void {
    const startX = e.touches[0].clientX
    setTouchStartInfo({
      id,
      startX
    })
  }

  // 右滑
  function touchM (e: any): void {
    const currenX = e.touches[0].clientX
    const distance = currenX - touchStartInfo.startX
    if (distance < -35) {
      setMoveId(touchStartInfo.id)
      // setSpreadId('')
    }
    if (distance > 35) {
      setMoveId('')
    }
  }

  // 展开详情
  // function spreadTodo(id: string): void {
  //   // setSpreadId(spreadId === id ? '' : id)
  //   if (spreadId === id) {
  //     setSpreadId('')
  //   } else {
  //     setSpreadId(id)
  //     setMoveId('')
  //   }
  // }

  // 增加项目
  function addTodo(): void {
    console.log('add')
    setCurrentTodo(null)
    setTodoFormVisible(true)
  }

  // 删除项目
  async function deleteTodo(id: string) {
    showModal({
      content: '咕咕咕？',
      confirmText: '咕咕咕！',
      cancelText: '容我三思',
      showCancel: true
    }).then(async res => {
      if (res.confirm) {
        console.log('deleteTodo')
        showLoading()
        await apiDelTodo({id})
        currentPage = 1
        await getTodoList()
        setMoveId('')
        // setSpreadId('')
        showLoading('close')
      }
    })
  }

  // 编辑项目
  function editTodo(id: string): void {
    console.log('editTodo')
    setCurrentTodo(todoList.find(todo => todo.id === id) || null)
    setTodoFormVisible(true)
    setMoveId('')
  }

  // 完成项目
  async function finishTodo(id: string) {
    console.log('finishTodo')
    showLoading()
    await apiEditTodo({id, isFinished: true})
    currentPage = 1
    await getTodoList()
    // setSpreadId('')
    setMoveId('')
    showLoading('close')
  }

  // 恢复项目
  async function renewTodo(id: string) {
    console.log('renewTodo')
    showLoading()
    await apiEditTodo({id, isFinished: false})
    currentPage = 1
    await getTodoList()
    // setSpreadId('')
    setMoveId('')
    showLoading('close')
  }

  // 编辑提交
  async function editSubmit(formDate) {
    console.log('editSubmit')
    setTodoFormVisible(false)
    showLoading()
    await apiEditTodo(formDate)
    currentPage = 1
    await getTodoList()
    showLoading('close')
  }

  // 增加提交
  async function addSubmit(formDate) {
    console.log('addSubmit', formDate)
    setTodoFormVisible(false)
    showLoading()
    await apiAddTodo(formDate)
    currentPage = 1
    await getTodoList()
    showLoading('close')
  }

  // tag 切换
  function changeFilterTag(tag: FilterTag) {
    if (tag !== currentFilterTag) {
      setCurrentFilterTag(tag)
      // setSpreadId('')
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
          <Button className="small" key="unfinished" type={currentFilterTag === FilterTag.unfinished ? 'primary' : 'default'} onClick={() => changeFilterTag(FilterTag.unfinished)}>未完成</Button>
          {/* <Button className="small" key="all" type={currentFilterTag === FilterTag.all ? 'primary' : 'default'} onClick={() => changeFilterTag(FilterTag.all)}>全部</Button> */}
          <Button className="small" key="finished" type={currentFilterTag === FilterTag.finished ? 'primary' : 'default'} onClick={() => changeFilterTag(FilterTag.finished)}>已完成</Button>
          {/* <Button className="small" key="rubbish" type={currentFilterTag === FilterTag.rubbish ? 'primary' : 'default'} onClick={() => changeFilterTag(FilterTag.rubbish)}>垃圾桶</Button> */}
        </View>
      </View>
      {/* 列表 */}
      <View className="todo-list">
        {showList.length === 0 && <View className="no-data">暂无数据</View>}
        {showList.map((group, index) => (<View key={index} className="group-item">
          <View className="group-date">
            <Text>{moment(group.expectDate).format('ll')}</Text>
          </View>
          <View className="group-list">
            {group.list.map(todoItem => <MovableArea className={`todo-item  ${moveId === todoItem.id && 'movable-active'}`} key={todoItem.id}>
              <MovableView  onTouchStart={e => touchS(todoItem.id, e)} onTouchMove={e => touchM(e)} direction="horizontal" className="movable-view" damping={0}>
                <View className={`todo-item-container`}>
                  <View className="item-tag">{
                    {
                      [MissionType.important]: '重要',
                      [MissionType.normal]: '一般',
                      [MissionType.alternative]: '次要',
                  }[todoItem.missionType]
                  }</View>
                  <View className="item-main">
                    <View className={`todo-item-title ${todoItem.isFinished && 'finished'}`}>{todoItem.title}</View>
                    <View className="finish-status">{todoItem.isFinished ? '已完成' : ''}</View>
                  </View>
                </View>
                <View className={`todo-item-right`}>
                  <View className="right-btns">
                    {todoItem.isFinished ? <View className="btn-item" onClick={() => {renewTodo(todoItem.id)}}>
                      <View className="t">恢复</View>
                    </View> : <View className="btn-item" onClick={() => {finishTodo(todoItem.id)}}>
                      <View className="t">完成</View>
                    </View>}
                    <View className="btn-item default" onClick={() => {editTodo(todoItem.id)}}>
                      <View className="t">编辑</View>
                    </View>
                    <View className="btn-item error" onClick={() => {deleteTodo(todoItem.id)}}>
                      <View className="t">删除</View>
                    </View>
                  </View>
                </View>
              </MovableView>
            </MovableArea>)}
          </View>
        </View>))}
      </View>
    </View>
  )
}