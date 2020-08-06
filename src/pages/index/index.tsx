import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Input, Form, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
export default function Index() {
  useEffect(() => {
    Taro.redirectTo({url: '/todoList/page/todoListIndex/todoListIndex'})
  }, [])
  return (
    <View>
      loading
    </View>
  )
}