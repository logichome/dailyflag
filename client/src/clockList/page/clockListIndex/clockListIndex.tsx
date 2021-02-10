import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Button, MovableArea, MovableView } from '@tarojs/components'
import { showLoading, showModal } from '@/utils/common'
import {useReachBottom} from '@tarojs/taro'
import moment from 'moment'
import './clockListIndex.styl'
import { apiGetClockList, apiEditClock, apiAddClock, apiDelClock } from '@/apis/clockList'
import { IClockContent } from '@/clockList/type'
import ClockForm from '@/clockList/components/ClockForm/ClockForm'
import Popup from '@/components/Popup/Popup'
let currentPage:number = 1
export default function Index() {
  const [clockList, setclockList] = useState<IClockContent[]>([])  // 列表
  const [clockFormVisible, setclockFormVisible] = useState<boolean>(false)  // 表单弹窗展示
  const [currentclock, setCurrentclock] = useState<IClockContent | null>(null)  // 当前编辑的项目
  const [touchStartInfo, setTouchStartInfo] = useState<any>({})
  const [moveId, setMoveId] = useState<string>('')

  // 触底加载
  useReachBottom(() => {
    console.log('onReachBottom', currentPage)
    if (currentPage > 0) {
      currentPage += 1
      getclockList()
    } else {
      console.log('到底了~')
    }
  })

  // // 初始化
  // useEffect(() => {
  //   setclockList([])
  //   currentPage = 1
  //   getclockList()
  // })

  // 获取列表
  async function getclockList() {
    showLoading()
    try {
      const data: any  = await apiGetClockList({page: currentPage})
      console.log('page', currentPage, 'data', data)
      setclockList(currentPage === 1 ? data.list : clockList.concat(data.list))
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

  // 增加项目
  function addclock(): void {
    console.log('add')
    setCurrentclock(null)
    setclockFormVisible(true)
  }

  // 删除项目
  async function deleteclock(id: string) {
    showModal({
      content: '咕咕咕？',
      confirmText: '咕咕咕！',
      cancelText: '容我三思',
      showCancel: true
    }).then(async res => {
      if (res.confirm) {
        console.log('deleteclock')
        showLoading()
        await apiDelClock({id})
        currentPage = 1
        await getclockList()
        setMoveId('')
        // setSpreadId('')
        showLoading('close')
      }
    })
  }

  // 编辑项目
  function editclock(id: string): void {
    console.log('editclock')
    setCurrentclock(clockList.find(clock => clock.id === id) || null)
    setclockFormVisible(true)
    setMoveId('')
  }

  // 完成项目
  async function finishclock(id: string) {
    console.log('finishclock')
    showLoading()
    await apiEditClock({id, isFinished: true})
    currentPage = 1
    await getclockList()
    // setSpreadId('')
    setMoveId('')
    showLoading('close')
  }

  // 恢复项目
  async function renewclock(id: string) {
    console.log('renewclock')
    showLoading()
    await apiEditClock({id, isFinished: false})
    currentPage = 1
    await getclockList()
    // setSpreadId('')
    setMoveId('')
    showLoading('close')
  }

  // 编辑提交
  async function editSubmit(formDate) {
    console.log('editSubmit')
    setclockFormVisible(false)
    showLoading()
    await apiEditClock(formDate)
    currentPage = 1
    await getclockList()
    showLoading('close')
  }

  // 增加提交
  async function addSubmit(formDate) {
    console.log('addSubmit', formDate)
    setclockFormVisible(false)
    showLoading()
    await apiAddClock(formDate)
    currentPage = 1
    await getclockList()
    showLoading('close')
  }


  return (
    <View>
      {/* 表单弹窗 */}
      <Popup visible={clockFormVisible} onTapMask={() => setclockFormVisible(false)}>
        <ClockForm onSubmit={currentclock ? editSubmit : addSubmit} currentclock={currentclock}  />
      </Popup>
      {/* 菜单栏 */}
      <View className="menu">
        <Button className="small add" type='primary' onClick={addclock}>新增</Button>
      </View>
      {/* 列表 */}
      <View className="clock-list">
        {clockList.length === 0 && <View className="no-data">暂无数据</View>}
        {clockList.map(clockItem => <MovableArea className={`clock-item  ${moveId === clockItem.id && 'movable-active'}`} key={clockItem.id}>
          <MovableView  onTouchStart={e => touchS(clockItem.id, e)} onTouchMove={e => touchM(e)} direction="horizontal" className="movable-view" damping={0}>
            <View className={`clock-item-container`}>
              <View className="item-main">
                <View className={`clock-item-title ${clockItem.isFinished && 'finished'}`}>{clockItem.title}</View>
                <View className="finish-status">{clockItem.isFinished ? '已完成' : ''}</View>
              </View>
            </View>
            <View className={`clock-item-right`}>
              <View className="right-btns">
                {clockItem.isFinished ? <View className="btn-item" onClick={() => {renewclock(clockItem.id)}}>
                  <View className="t">恢复</View>
                </View> : <View className="btn-item" onClick={() => {finishclock(clockItem.id)}}>
                  <View className="t">完成</View>
                </View>}
                <View className="btn-item default" onClick={() => {editclock(clockItem.id)}}>
                  <View className="t">编辑</View>
                </View>
                <View className="btn-item error" onClick={() => {deleteclock(clockItem.id)}}>
                  <View className="t">删除</View>
                </View>
              </View>
            </View>
          </MovableView>
        </MovableArea>)}
      </View>
    </View>
  )
}