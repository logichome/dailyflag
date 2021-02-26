import React, { useState, useEffect, useMemo } from 'react'
import { View, Input } from '@tarojs/components'
import './herbalMedicine.styl'
import { IHerbMedicine } from '@/tools/herbalMedicine/base'
import SearchBar from '@/components/SearchBar/SearchBar'
import { showLoading } from '@/utils/common'
import { getHerbMedicine } from '@/apis/config'
export default function Index() {
  useEffect(() => {
    initPage()
  }, [])

  interface ITagItem {
    readonly id: number,
    type: string,
    value: string
  }
  const [attributeTagList, setAttributeTagList] = useState<Array<ITagItem>>([])
  const [useTagList, setUseTagList] = useState<Array<ITagItem>>([])
  const [chosenTag, setChosenTag] = useState<Array<ITagItem>>([])
  const [topBtnVisible, setTopBtnVisible] = useState<boolean>(false)
  const [medicineList, setMedicineList] = useState<Array<IHerbMedicine>>([])

  // 筛选结果
  const filterResult:Array<IHerbMedicine> = useMemo(() => {
    return medicineList.filter(item => {
      let flag = true
      for (const conditionItem of chosenTag) {
        if (!item[conditionItem.type].some(tag => tag === conditionItem.value)) {
          flag = false
        }
      }
      return flag
    })
  }, [chosenTag, medicineList])

  // 选择tag
  function chooseTag(item) {
    if (chosenTag.some(tag => tag.id === item.id)) {
      setChosenTag(chosenTag.filter(tag => tag.id !== item.id))
    } else {
      setChosenTag([...chosenTag, item])
    }
  }

  // tag初始化
  async function initPage() {
    let res: Array<IHerbMedicine> = []
    try {
      showLoading()
      res = await getHerbMedicine() as Array<IHerbMedicine>
    } catch (error) {
      console.error(error)
    }
    showLoading('close')
    setMedicineList(res)
    let attributeTag:Array<ITagItem> = []
    let useTag:Array<ITagItem> = []
    let tagId:number = 1
    res.map(item => {
      for (const attributeItem of item.attribute) {
        if (!attributeTag.some(tag => tag.type === 'attribute' && tag.value === attributeItem)) {
          attributeTag.push({
            id: tagId++,
            type: 'attribute',
            value: attributeItem,
          })
        }
      }
      for (const useItem of item.use) {
        if (!useTag.some(tag => tag.type === 'use' && tag.value === useItem)) {
          useTag.push({
            id: tagId++,
            type: 'use',
            value: useItem,
          })
        }
      }
    })
    setAttributeTagList(attributeTag)
    setUseTagList(useTag)
    console.log('initPage', {attributeTag, useTag})
    initStyle()
  }

  function initStyle() {
    console.log('initStyle')
    setTimeout(() => {
      wx.createIntersectionObserver().relativeToViewport({bottom: 0}).observe('.filter', res => {
        console.log('done', res.intersectionRatio)
        setTopBtnVisible(res.intersectionRatio <= 0)
      })
    }, 0)
  }
  function searchInputChange(val) {
    console.log('searchInputChange', val)
  }

  return (
    <View className="herbal">
      <View className="filter">
        <SearchBar inputChange={searchInputChange} />
        <View className="filter-tags">
          <View className="attribute">
            <View className="tag-title">属性</View>
              <View className="tag-list">
                {attributeTagList.map((item, index) => <View key={index} onClick={_ => chooseTag(item)} className={`${chosenTag.some(tag => tag.id === item.id) && 'checked'} tag-item`}>
                  <View className="t">{item.value}</View>
                </View>)}
              </View>
          </View>
          <View className="use">
            <View className="tag-title">用途</View>
              <View className="tag-list">
              {useTagList.map((item, index) => <View key={index} onClick={_ => chooseTag(item)} className={`${chosenTag.some(tag => tag.id === item.id) && 'checked'} tag-item`}>
                <View className="t">{item.value}</View>
              </View>)}
            </View>
          </View>
        </View>
        {chosenTag.length > 0 && <View className="chosen">
          <View className="tag-title">已选</View>
            <View className="tag-list">
            {chosenTag.map((item, index) => <View key={index} onClick={_ => setChosenTag(chosenTag.filter(tag => tag.id !== item.id))} className="tag-item checked">
              <View className="t">{item.value}</View>
            </View>)}
          </View>
        </View>}
      </View>
      {topBtnVisible && <View className="top-btn icon-top iconfont" onClick={_ => wx.pageScrollTo({scrollTop: 0})}>
      </View>}
      <View className="result">
        {filterResult.length ? <View className="list">
          {filterResult.map((item, index) => <View key={index} className="result-item">
            <View className="item-name">{item.name}</View>
            <View className="item-info">
              <View className="info-line">
                <View className="info-label">属性</View>
                <View className="info-value">{item.attribute.join('、')}</View>
              </View>
              <View className="info-line">
                <View className="info-label">用途</View>
                <View className="info-value">{item.use.join('、')}</View>
              </View>
            </View>
          </View>)}
        </View>
        : <View className="no-Data">哪有这样的草药~o(╥﹏╥)o</View>}
      </View>
    </View>
  )
}