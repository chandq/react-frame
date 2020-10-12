import React, { Component } from 'react'
class YunApp extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    // document.querySelector('#myFrame').onload = function name(params) {
    //   setTimeout(() => {
    //     var sc = document.createElement('script')
    //     sc.text = `
    //     var ele = document.querySelector('.classification-show');
    //     console.log('ff:', document, ele)
    //     ele.style.position = 'static'
    //     alert("a")`
    //     console.log('frame: ', )
    //     document.querySelector('#myFrame').appendChild(sc)
    //   }, 15000)
    // }
  }
  render() {
    return <iframe id="myFrame" src="http://39.105.62.239/yunapp" width="100%" height="100%" frameBorder="0"></iframe>
  }
}
export default YunApp
// export default function Yunapp() {
//   return <iframe src="http://39.105.62.239/yunapp" width="100%" height="100%" frameBorder="0"></iframe>
// }
