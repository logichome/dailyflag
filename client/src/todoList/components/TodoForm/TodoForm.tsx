import React, { useState, useEffect, useMemo } from 'react'
import { View, Picker, Input, Form, Button } from '@tarojs/components'
import { formatDate } from '@/utils/common'
import { MissionType } from '../../type'

import Taro from '@tarojs/taro'
import moment from 'moment'
import './todoForm.styl'

export default function TodoForm(props) {
  enum FormRuleTypes {require, number}
  const start = formatDate()
  interface IFormDate {
    title: string,
    expectDate: string,
    missionType: MissionType
  }
  // 表单值初始化
  function initFormData(): IFormDate {
    return {
      title: '',
      expectDate: start,
      missionType: MissionType.normal
    }
  }
  const {onSubmit, currentTodo} = props
  const [formData, setFormData] = useState<IFormDate>(initFormData())
  // 编辑数据初始化
  useEffect(() => {
    if (currentTodo) {
      setFormData({...formData, ...currentTodo})
    } else {
      setFormData(initFormData())
    }
  }, [currentTodo])

  // 格式化显示的日期
  const formatExpectDate: string = useMemo(() => formData.expectDate ? moment(formData.expectDate).format('ll') : '', [formData])

  // 表单修改
  function formDataChange(key, value) {
    setFormData({...formData, [key]: value})
  }

  // 表单校验
  function checkForm(result): boolean {
    // 校验规则
    const rules = {
      title: [{type: FormRuleTypes.require, msg: '请输入任务概要'}],
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
    }
    return true
  }
  return (
    <View>
      <Form className="todo-form">
        <View className="title">{currentTodo ? '编辑' : '新增'}</View>
        <View className="form-item">
          <View className="label">任务概要</View>
          <Input onInput={e => formDataChange('title', e.detail.value)} className="value" type='text' name="title" value={formData.title} placeholder='起个惊天地泣鬼神的标题' maxlength={14}/>
        </View>
        <View className="form-item">
          <View className="label">任务类型</View>
          <View className="radio-group">
            <View className={`radio-item ${formData.missionType === MissionType.important && 'checked'}`} onClick={_ => formDataChange('missionType', MissionType.important)}>
              重要
            </View>
            <View className={`radio-item ${formData.missionType === MissionType.normal && 'checked'}`} onClick={_ => formDataChange('missionType', MissionType.normal)}>
              一般
            </View>
            <View className={`radio-item ${formData.missionType === MissionType.alternative && 'checked'}`} onClick={_ => formDataChange('missionType', MissionType.alternative)}>
              备选
            </View>
          </View>
        </View>
        <View className="form-item">
          <View className="label">完成日期</View>
          <Picker start={start} onChange={e => formDataChange('expectDate', e.detail.value)} mode='date' value={formData.expectDate} className={`value ${!formatExpectDate && 'picker-placeholder'}`} name="expectDate">
            <View className='picker'>
              {formatExpectDate || '怎么说也总该有个期限吧'}
            </View>
          </Picker>
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