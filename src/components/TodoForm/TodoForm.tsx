import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Input, Form, Button } from '@tarojs/components'
import './todoForm.styl'

export default function TodoForm(props) {
  const {onSubmit, currentTodo} = props
  return (
    <View>
      <Form className="todo-form" onSubmit={onSubmit} >
        <View className="title">{currentTodo ? 'edit' : 'new'}</View>
        <View className="form-item">
          <View className="label">title</View>
          <Input className="value" type='text' name="title" value={currentTodo ? currentTodo.title : ''} placeholder='maxlength = 14' maxlength={14}/>
        </View>
        <View className="btns">
          <Button className="middle" type='primary' form-type="submit">submit</Button>
        </View>
      </Form>
    </View>
  )
}