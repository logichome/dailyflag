export interface IHerbMedicine {
  name: string,
  attribute: Array<string>,
  use: Array<string>
}
export const HERBAL_MEDICINE:Array<IHerbMedicine> = [
  {
    name: '小灯草',
    attribute: ['风属性', '光'],
    use: ['卢姥爷突破', '料理', '吃']
  },
  {
    name: '慕风蘑菇',
    attribute: ['土属性', '光'],
    use: ['可莉突破', '吃']
  },
  {
    name: '塞西莉亚花',
    attribute: ['风属性', '光'],
    use: ['温迪突破', '吃', '大口吃' , '大力吃', '不知道干啥', '凑字数', '哈哈哈哈哈哈哈哈']
  },
  {
    name: '石珀',
    attribute: ['岩属性', '黄色'],
    use: ['凑字数', '哈哈哈哈哈哈哈哈']
  },
  {
    name: '夜泊石',
    attribute: ['无属性', '光'],
    use: ['凑字数', '哈哈哈哈哈哈哈哈']
  },
  {
    name: '清心',
    attribute: ['风属性', '花'],
    use: ['椰羊突破', '吃', '大口吃' , '大力吃', '不知道干啥', '凑字数', '哈哈哈哈哈哈哈哈']
  },
  {
    name: '甜甜花',
    attribute: ['无属性', '花'],
    use: ['料理', '吃']
  },
]