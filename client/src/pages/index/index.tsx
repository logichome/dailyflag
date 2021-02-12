import React, { useEffect } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.styl'
export default function Index() {
  useEffect(() => {
  }, [])
  return (
    <View className="index">
      <View className="header">
        <View className="header-item" onClick={() => Taro.navigateTo({url: '/todoList/page/todoListIndex/todoListIndex'})}>
          <View className="header-icon iconfont icon-flag-fill"></View>
          <View className="header-txt">待办</View>
        </View>
        <View className="header-item">
          <View className="header-icon iconfont icon-container-fill" onClick={_ => {
            Taro.showToast({
              title: '敬请期待',
              icon: 'none'
            })
          }}></View>
          <View className="header-txt">打卡</View>
        </View>
      </View>
      <View className="main">
        <View className="main-block">
          <View className="block-title">小工具</View>
          <View className="block-list">
            <View className="block-item" onClick={_ => Taro.navigateTo({url: '/tools/herbalMedicine/herbalMedicine'})}>
              <View className="block-item-icon iconfont .icon-herbalMedicine"></View>
              <View className="block-item-name">草药特性</View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}