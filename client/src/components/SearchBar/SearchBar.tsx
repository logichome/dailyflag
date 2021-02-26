import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Input, Form, Button } from '@tarojs/components'
import './SearchBar.styl'

export default function SearchBar(props) {

  function searchDataChange (val) {
    props.inputChange && props.inputChange(val)
  }

  return (
    <View className="search-bar">
      <Input className="search-input" onInput={e => searchDataChange(e.detail.value)} placeholder='名称/属性/用途' maxlength={10} type='text'></Input>
      <View className="list"></View>
    </View>
  )
}