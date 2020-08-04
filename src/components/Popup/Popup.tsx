import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Input, Form, Button } from '@tarojs/components'
import './Popup.styl'

export default function Popup(props) {
  const {children, visible, className, position = 'bottom', onTapMask} = props
  const [showBox, setShowBox] = useState<boolean>(false)
  const [showContent, setShowContent] = useState<boolean>(false)
  useEffect(() => {
    if (visible) {
      setShowBox(visible)
      setTimeout(() => {
        setShowContent(visible)
      }, 10)
    } else {
      setShowContent(visible)
    }
  }, [visible])

  return (
    <View className={`${className} container`} style={{display: showBox ? 'block' : 'none'}}>
      <View className={`mask ${showContent && 'show'}`} onClick={onTapMask} onTransitionEnd={()=>{setShowBox(visible)}}></View>
      <View className={`pop-box ${position} ${showContent && 'show'}`}>
        {children}
      </View>
    </View>
  )
}