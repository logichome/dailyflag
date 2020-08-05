import React, { useState, useEffect, useMemo } from 'react'
import { View, Picker, Input, Form, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import moment from 'moment'
import './todoForm.styl'

export default function TodoForm(props) {
  enum FormRuleTypes {require, number}
  const {onSubmit, currentTodo} = props
  const [expectDate, setExpectDate] = useState<string>('')
  const [formData, setFormData] = useState<any>({
    title: '',
    expectDate: ''
  })
  useEffect(() => {
    console.log('useEffect???', currentTodo)
    if (currentTodo) {
      setFormData({...formData, ...currentTodo})
    } else {
      setFormData({
        title: '',
        expectDate: ''
      })
    }
    
  }, [currentTodo])
  currentTodo
  function onDateChange(e) {
    setExpectDate(moment(e.detail.value).format('ll'))
  }

  // 表单校验
  function checkForm(e) {
    const result = e.detail.value
    const rules = {
      title: [{type: FormRuleTypes.require, msg: '请输入目标概要'}],
      expectDate: [{type: FormRuleTypes.require, msg: '请选择完成日期'}]
    }
    for (const key in result) {
      // 遍历表单项
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        const value = result[key]
        if (rules[key]) {
          for (const rule of rules[key]) {
            // 遍历该项所有规则
            let ErrMsg: string = ''
            switch (rule.type) {
              case FormRuleTypes.require:
                // 必填项
                if (!value) ErrMsg = rule.msg
                break
            }
            if (ErrMsg) {
              Taro.showToast({
                title: ErrMsg,
                icon: 'none'
              })
              return false
            }
          }
        }
      }
      return true
    }
  }
  return (
    <View>
      <Form className="todo-form" onSubmit={e => {
        if (checkForm(e)) onSubmit(e)
      }} >
        <View className="title">{currentTodo ? '编辑' : '新增'}</View>
        <View className="form-item">
          <View className="label">目标概要</View>
          <Input className="value" type='text' name="title" value={formData.title} placeholder='起个惊天地泣鬼神的标题' maxlength={14}/>
        </View>
        <View className="form-item">
          <View className="label">完成日期</View>
          <Picker mode='date' value={formData.expectDate} className={`value ${!expectDate && 'picker-placeholder'}`} name="expectDate" onChange={onDateChange}>
            <View className='picker'>
              {expectDate || '怎么说也总该有个期限吧'}
            </View>
          </Picker>
        </View>
        
        <View className="btns">
          <Button className="middle" type='primary' form-type="submit">submit</Button>
        </View>
      </Form>
    </View>
  )
}