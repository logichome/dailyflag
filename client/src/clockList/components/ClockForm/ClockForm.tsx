import React, { useState, useEffect, useMemo } from 'react'
import { View, Picker, Input, Form, Button } from '@tarojs/components'
import { formatDate } from '@/utils/common'

import Taro from '@tarojs/taro'
import moment from 'moment'
import './ClockForm.styl'

export default function ClockForm(props) {
  enum FormRuleTypes {require, number}
  interface IFormDate {
    title: string,
  }
  // 表单值初始化
  function initFormData(): IFormDate {
    return {
      title: ''
    }
  }
  const {onSubmit, currentClock} = props
  const [formData, setFormData] = useState<IFormDate>(initFormData())
  // 编辑数据初始化
  useEffect(() => {
    if (currentClock) {
      setFormData({...formData, ...currentClock})
    } else {
      setFormData(initFormData())
    }
  }, [currentClock])

  // 表单修改
  function formDataChange(key, value) {
    setFormData({...formData, [key]: value})
  }

  // 表单校验
  function checkForm(result): boolean {
    // 校验规则
    const rules = {
      title: [{type: FormRuleTypes.require, msg: '请输入任务概要'}],
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
    }
    return true
  }
  return (
    <View>
      <Form className="todo-form">
        <View className="title">{currentClock ? '编辑' : '新增'}</View>
        <View className="form-item">
          <View className="label">任务概要</View>
          <Input onInput={e => formDataChange('title', e.detail.value)} className="value" type='text' name="title" value={formData.title} placeholder='起个惊天地泣鬼神的标题' maxlength={14}/>
        </View>
        <View className="btns">
          <Button className="middle" type='primary' onClick={() => {
            if (checkForm(formData)) {
              onSubmit(formData)
              setFormData(initFormData())
            }
          }}>提交</Button>
        </View>
      </Form>
    </View>
  )
}