import { Component } from 'react'
import { initCloud } from '@/wxCloud'
import '@/utils/moment'
import './app.styl'
import './assets/iconfont/iconfont.css'
class App extends Component {

  componentDidMount () {
    // 云能力初始化
    initCloud()
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
