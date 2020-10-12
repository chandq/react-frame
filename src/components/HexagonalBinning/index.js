/**
 * author: chendq
 * Date: 2017/12/27
 * Features: 蜂窝图
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import * as d3hexbin from 'd3-hexbin'
import { mouseEnterEvt, mouseLeaveEvt } from '@/utils/tooltip'
class HexagonalBinning extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {}

  componentDidMount() {
    let { data, svgid } = this.props
    // console.info("didMount, svg: ", d3.select(`#${svgid}`));
    this.resizeHeightWidth()
    let resize = () => {
      if (data && data.length > 0) {
        d3.select(`#${svgid}`).select('g').remove()
        this.resizeHeightWidth()
        this.renderHoneycombDiagram()
      }
    }
    window.onresize = resize
  }

  componentWillUnmount() {
    let { svgid } = this.props
    if (document.querySelector(`#${svgid}`)) {
      d3.select(`#${svgid}`).select('g').remove()
    }
    mouseLeaveEvt({})
  }

  componentWillReceiveProps(nextProps) {}

  resizeHeightWidth = () => {
    let { svgid } = this.props
    let obj = {
      width: getComputedStyle(document.querySelector(`#${svgid}`).parentElement).width.split('px')[0],
      height: getComputedStyle(document.querySelector(`#${svgid}`).parentElement).height.split('px')[0]
    }
    this.props.setHeightWidth(obj)
  }

  renderHoneycombDiagram = () => {
    const { data, svgid } = this.props
    // console.log("hexgonBinning data*******,", data);
    const status = {
      normalStart: '#009cff',
      normalEnd: '#00e4ff',
      abnormal: '#d63932',
      unknown: '#fff'
    }

    if (document.querySelector(`#${svgid}`)) {
      d3.select(`#${svgid}`).select('g').remove()
      if (!(data && data.length > 0)) {
        return
      }
      // console.info("**********width, height:", getComputedStyle(document.querySelector(`#${svgid}`)).width.split('px')[0], getComputedStyle(document.querySelector(`#${svgid}`)).height.split('px')[0]);
      // console.info("**********parent width, height:", getComputedStyle(document.querySelector(`#${svgid}`).parentElement).width.split('px')[0], getComputedStyle(document.querySelector(`#${svgid}`).parentElement).height.split('px')[0]);
      let len = data.length,
        r = 0,
        marginTop = 50,
        rowCount = 1, // 每行放置多少个
        oddNumber = 0,
        row = 1,
        yNumber = 0
      // if (len <= 12) {
      // 	r = 40;
      // 	rowCount = 4;
      // 	colCount = 3;
      // } else if (len <= 24) {
      // 	r = 30;
      // 	rowCount = 6;
      // 	colCount = 4;
      //
      // } else if (len <= 54) {
      // 	r = 20;
      // 	rowCount = 9;
      // 	colCount = 6;
      // 	// left = 20;
      // } else  {
      // 	r = 10;
      // 	rowCount = 15;
      // 	colCount = 12;
      // }

      rowCount = Math.ceil(Math.pow(len, 0.5))
      var margin = { top: 20, right: 40, bottom: 50, left: 40 }
      if (rowCount >= 5) {
        margin.left = 20
        marginTop = 30
      }
      var svg = d3.select(`#${svgid}`),
        width = svg.attr('width') - margin.left - margin.right,
        height = svg.attr('height') - margin.top - margin.bottom,
        g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      // console.log("&&&&&&&&&&&&&&width, height:", width, height);
      // defined line-gradient component style
      var defs = svg.append('defs')
      var linearGradient = defs
        .append('linearGradient')
        .attr('id', 'linearColor')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%')

      var stop1 = linearGradient.append('stop').attr('offset', '0%').style('stop-color', status.normalStart)
      var stop2 = linearGradient.append('stop').attr('offset', '100%').style('stop-color', status.normalEnd)
      /**
       * 容器放置六边形的情况(width、height容器宽、高，r六边形所在圆半径，margin.left、marginTop容器左、上边距)
       * @deprecated 固定容器大小的处理情况
       * width=404px, height=279px, left = 15, marginTop = 50
       * 1.    r=40，奇数行放4个，偶数行放4个，共三行，范围[1，12]
       * 2.    r=30，奇数行放6个，偶数行放6个，共四行，范围[1，24]
       * 3.    r=20，奇数行放9个，偶数行放9个，共六行，范围[1，54]   // left = 20
       * 3.    r=10，奇数行放9个，偶数行放9个，共六行，范围[54, +∞)   // left = 20
       * @current 根据容器大小、显示的数量自动调整半径的大小和每行显示的个数（容器充满时行和列显示的个数一致）
       * rowCount = Math.ceil(√len)
       * min = Math.min(width, height)
       * r1 = 2 * min / (√3*(2*rowCount+1))
       * r2 = 2 * min / (3*rowCount+1)
       * r = Math.min(r1, r2)
       * */
      let min = Math.min(width, height)
      let r1 = (2 * min) / ((2 * rowCount + 1) * 1.732)
      let r2 = (2 * min) / (3 * rowCount + 1)
      r = Math.min(r1, r2)
      // console.info("行个数n,最小长度min,半径r1，半径r2, 半径r:  ", rowCount, min, r1, r2, r)
      if (r > 40) {
        // 半径大于40时，重设为40
        r = 40
      }
      /**
       * @desc: 装载数据，并设置每个六边形所在容器的位置
       * 六边形向右向下增加规则（r是六边形半径，自然数是从0开始按1逐增,每行放置的六边形个数相同）
       * 奇数行增加规律：
       *               x += √3*r*自然数
       *               y +=1.5*r*自然数
       * 偶数行增加规律：x += √3*r*(0.5+自然数)
       *               y +=1.5*r*自然数
       * */
      let points = data.map((value, index) => {
        let isOddRow = parseInt(parseInt(index / rowCount) % 2)
        if (index !== 0 && isOddRow != parseInt(parseInt((index - 1) / rowCount) % 2)) {
          oddNumber = 0
          row++
          yNumber++
        }
        // console.info("yNumber, flag@@@@@@@@@@@@@@@@@@@@@:", yNumber, parseInt(parseInt((index) / rowCount) / 2));
        if (isOddRow === 0) {
          // 奇数行
          let obj = {
            0: margin.left + 1.732 * r * oddNumber++,
            1: marginTop + 1.5 * r * yNumber,
            name: value.label ? value.label : value.name,
            state: value.state
          }
          if (value.type) {
            //物理机
            obj.type = value.type
          }
          if (value.vmType) {
            //虚拟机
            obj.vmType = value.vmType
          }
          return obj
        } else {
          let obj = {
            0: margin.left + 1.732 * r * (0.5 + oddNumber++),
            1: marginTop + 1.5 * r * yNumber,
            name: value.label ? value.label : value.name,
            state: value.state
          }
          if (value.type) {
            //物理机
            obj.type = value.type
          }
          if (value.vmType) {
            //虚拟机
            obj.vmType = value.vmType
          }
          return obj
        }
      })
      // console.info("POINTS***************:", points)
      // var left = 15, marginTop = 50;
      // var r = 40;
      // var points = [
      // 	{0: left + 1.732 * r * (0), 1: marginTop, 3: "sdffffffffffffasfs我发士大夫是sdfsdfsdf地方的范德萨范德萨范德萨"},
      // 	{0: left + 1.732 * r * (1), 1: marginTop + 1.5 * r * 0, 3: "sdffffffffffffasfs我发士大夫是"},
      // 	{0: left + 1.732 * r * (2), 1: marginTop + 1.5 * r * 0},
      // 	{0: left + 1.732 * r * (3), 1: marginTop + 1.5 * r * 0},
      // 	{0: left + 1.732 * r * (4), 1: marginTop + 1.5 * r * 0},
      // 	{0: left + 1.732 * r * (5), 1: marginTop + 1.5 * r * 0},
      // 	{0: left + 1.732 * r * (6), 1: marginTop + 1.5 * r * 0},
      //
      // 	{0: left + 1.732 * r * (7), 1: marginTop + 1.5 * r * 0},
      // 	{0: left + 1.732 * r * (8), 1: marginTop + 1.5 * r * 0},
      // 	{0: left + 1.732 * r * (9), 1: marginTop + 1.5 * r * 0},
      // 	{0: left + 1.732 * r * (10), 1: marginTop + 1.5 * r * 0},
      // 	{0: left + 1.732 * r * (11), 1: marginTop + 1.5 * r * 0},
      // 	{0: left + 1.732 * r * (12), 1: marginTop + 1.5 * r * 0},
      // 	{0: left + 1.732 * r * (13), 1: marginTop + 1.5 * r * 0},
      // 	{0: left + 1.732 * r * (14), 1: marginTop + 1.5 * r * 0},
      // 	{0: left + 1.732 * r * (15), 1: marginTop + 1.5 * r * 0},
      // 	{0: left + 1.732 * r * (16), 1: marginTop + 1.5 * r * 0},
      // 	{0: left + 1.732 * r * (17), 1: marginTop + 1.5 * r * 0},
      // 	{0: left + 1.732 * r * (18), 1: marginTop + 1.5 * r * 0},
      // 	{0: left + 1.732 * r * (19), 1: marginTop + 1.5 * r * 0},
      // 	{0: left + 1.732 * r * (20), 1: marginTop + 1.5 * r * 0},
      //
      //
      // 	{0: left + 1.732 * r * (0.5 + 0), 1: marginTop + 1.5 * r * 1},
      // 	{0: left + 1.732 * r * (0.5 + 1), 1: marginTop + 1.5 * r * 1},
      // 	{0: left + 1.732 * r * (0.5 + 2), 1: marginTop + 1.5 * r * 1},
      // 	{0: left + 1.732 * r * (0.5 + 3), 1: marginTop + 1.5 * r * 1},
      // 	{0: left + 1.732 * r * (0.5 + 4), 1: marginTop + 1.5 * r * 1},
      // 	{0: left + 1.732 * r * (0.5 + 5), 1: marginTop + 1.5 * r * 1},
      // 	{0: left + 1.732 * r * (0.5 + 6), 1: marginTop + 1.5 * r * 1},
      //
      // 	{0: left + 1.732 * r * (0.5 + 7), 1: marginTop + 1.5 * r * 1},
      // 	{0: left + 1.732 * r * (0.5 + 8), 1: marginTop + 1.5 * r * 1},
      // 	{0: left + 1.732 * r * (0.5 + 9), 1: marginTop + 1.5 * r * 1},
      //
      // 	{0: left + 1.732 * r * (0), 1: marginTop + 1.5 * r * 2},
      // 	{0: left + 1.732 * r * (1), 1: marginTop + 1.5 * r * 2},
      // 	{0: left + 1.732 * r * (2), 1: marginTop + 1.5 * r * 2},
      // 	{0: left + 1.732 * r * (3), 1: marginTop + 1.5 * r * 2},
      // 	{0: left + 1.732 * r * (4), 1: marginTop + 1.5 * r * 2},
      // 	{0: left + 1.732 * r * (5), 1: marginTop + 1.5 * r * 2},
      // 	{0: left + 1.732 * r * (6), 1: marginTop + 1.5 * r * 2},
      //
      // 	{0: left + 1.732 * r * (0.5 + 0), 1: marginTop + 1.5 * r * 3},
      // 	{0: left + 1.732 * r * (0.5 + 1), 1: marginTop + 1.5 * r * 3},
      // 	{0: left + 1.732 * r * (0.5 + 2), 1: marginTop + 1.5 * r * 3},
      // 	{0: left + 1.732 * r * (0.5 + 3), 1: marginTop + 1.5 * r * 3},
      // 	{0: left + 1.732 * r * (0.5 + 4), 1: marginTop + 1.5 * r * 3},
      // 	{0: left + 1.732 * r * (0.5 + 5), 1: marginTop + 1.5 * r * 3},
      // 	{0: left + 1.732 * r * (0.5 + 6), 1: marginTop + 1.5 * r * 3},
      //
      // 	{0: left + 1.732 * r * ( 0), 1: marginTop + 1.5 * r * 4},
      // 	{0: left + 1.732 * r * (1), 1: marginTop + 1.5 * r * 4},
      // 	{0: left + 1.732 * r * (2), 1: marginTop + 1.5 * r * 4},
      // 	{0: left + 1.732 * r * (3), 1: marginTop + 1.5 * r * 4},
      // 	{0: left + 1.732 * r * (4), 1: marginTop + 1.5 * r * 4},
      // 	{0: left + 1.732 * r * (5), 1: marginTop + 1.5 * r * 4},
      // 	{0: left + 1.732 * r * (6), 1: marginTop + 1.5 * r * 4},
      //
      // 	{0: left + 1.732 * r * (0.5 + 0), 1: marginTop + 1.5 * r * 5},
      // 	{0: left + 1.732 * r * (0.5 + 1), 1: marginTop + 1.5 * r * 5},
      // 	{0: left + 1.732 * r * (0.5 + 2), 1: marginTop + 1.5 * r * 5},
      // 	{0: left + 1.732 * r * (0.5 + 3), 1: marginTop + 1.5 * r * 5},
      // 	{0: left + 1.732 * r * (0.5 + 4), 1: marginTop + 1.5 * r * 5},
      // 	{0: left + 1.732 * r * (0.5 + 5), 1: marginTop + 1.5 * r * 5},
      // 	{0: left + 1.732 * r * (0.5 + 6), 1: marginTop + 1.5 * r * 5},
      //
      // 	{0: left + 1.732 * r * (0.5 + 0), 1: marginTop + 1.5 * r * 6},
      // 	{0: left + 1.732 * r * (0.5 + 1), 1: marginTop + 1.5 * r * 6},
      // 	{0: left + 1.732 * r * (0.5 + 2), 1: marginTop + 1.5 * r * 6},
      // 	{0: left + 1.732 * r * (0.5 + 3), 1: marginTop + 1.5 * r * 6},
      // 	{0: left + 1.732 * r * (0.5 + 4), 1: marginTop + 1.5 * r * 6},
      // 	{0: left + 1.732 * r * (0.5 + 5), 1: marginTop + 1.5 * r * 6},
      // 	{0: left + 1.732 * r * (0.5 + 6), 1: marginTop + 1.5 * r * 6},
      //
      // ]
      var _hexbin = d3hexbin
        .hexbin()
        .radius(r)
        .extent([
          [0, 0],
          [width, height]
        ])

      g.append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', svg.attr('width'))
        .attr('height', svg.attr('height'))

      g.append('g')
        .attr('class', rowCount > 5 ? 'small-hexagon' : 'hexagon')
        .attr('clip-path', 'url(#clip)')
        .selectAll('path')
        .data(_hexbin(points))
        .enter()
        .append('path')
        .attr('d', _hexbin.hexagon())
        .attr('transform', function (d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })
        .on('mouseover', (event, d) => {
          let str = this.getfloatText(d)
          mouseEnterEvt({ title: str.toString(), event: event })
        })
        .on('mousemove', (event, d) => {
          let str = this.getfloatText(d)
          mouseEnterEvt({ title: str.toString(), event: event })
        })
        .on('mouseout', (event, d) => {
          mouseLeaveEvt({})
        })
        .attr('fill', function (d) {
          let color = status.unknown
          if (!d[0].vmType) {
            //物理机
            switch (d[0].state) {
              case 'MANAGED':
                color = 'url(#' + linearGradient.attr('id') + ')'
                break
              case 'STOPPED':
                color = status.abnormal
                break
              default:
                color = status.unknown
                break
            }
          } else {
            //虚拟机
            if (d[0].vmType == 'NOT_MANAGED') {
              color = status.unknown
            } else {
              switch (d[0].state) {
                case 'ON':
                  color = 'url(#' + linearGradient.attr('id') + ')'
                  break
                case 'OFF':
                case 'PAUSED':
                case 'LOCKED':
                  color = status.abnormal
                  break
                default:
                  color = status.unknown
                  break
              }
            }
          }
          return color
        })
    }
  }

  getfloatText(d) {
    /**
     * machine 管理状态type, 运行状态state
     * virtualMachine 管理状态vmType, 运行状态state
     * */
    let str = `名称：${d[0]['name']}<br> 状态：${d[0]['state']}<br>` // 物理机
    if (d[0]['type']) {
      //物理机
      str = `名称：${d[0]['name']}<br> 管理状态：${d[0]['type']}<br> 运行状态：${d[0]['state']}`
    } else if (d[0]['vmType']) {
      //虚拟机
      str = `名称：${d[0]['name']}<br> 管理状态：${d[0]['vmType']}<br> 运行状态：${d[0]['state']}`
    }
    return str
  }

  render() {
    this.renderHoneycombDiagram()
    return <div></div>
  }
}
HexagonalBinning.defaultProps = {
  data: {},
  svgid: '' // 容器id
}
function mapStateToProps(state) {
  // const { fetchHome, selectDataCenters } = state
  // return {
  // 	fetchHomeData: fetchHome.fetchHomeData,
  // 	servers: fetchHome.servers,
  // }
  return {}
}

export default connect(mapStateToProps)(HexagonalBinning)
