import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Input, Form, Button } from '@tarojs/components'
import './todoForm.styl'

export default function TodoForm(props) {
  function addSubmit() {
  }
  return (
    <View>
      <Form onSubmit={addSubmit} >
        <Input type='text' name="title" placeholder='最大输入长度为 10' maxlength={10}/>
        <Button form-type="submit">submit</Button>
      </Form>
    </View>
  )
}