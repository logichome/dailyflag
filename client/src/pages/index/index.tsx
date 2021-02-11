import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Input, Form, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.styl'
export default function Index() {
  useEffect(() => {
    // Taro.redirectTo({url: '/todoList/page/todoListIndex/todoListIndex'})
  }, [])
  return (
    <View className="index">
      <View className="header">
        <View className="header-item" onClick={() => Taro.redirectTo({url: '/todoList/page/todoListIndex/todoListIndex'})}>
          <View className="header-icon iconfont icon-flag-fill"></View>
          <View className="header-txt">待办</View>
        </View>
        <View className="header-item">
          <View className="header-icon iconfont icon-container-fill"></View>
          <View className="header-txt">打卡</View>
        </View>
      </View>
    </View>
  )
}