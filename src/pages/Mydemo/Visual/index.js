import React, { useState, useEffect, useRef } from 'react'
import HexagonalBinning from '@/components/HexagonalBinning'
import Sphere from './Sphere'
import Mock, { Random } from 'mockjs'
import { Row, Col } from 'antd'
import styles from './index.less'

export default function VisualAnimation(params) {
  const [vmwidth, setVmWidth] = useState(600)
  const [vmheight, setVmHeight] = useState(600)
  const [vms, setVms] = useState([])
  const setWidthHeight = obj => {
    let { width, height } = obj
    setVmWidth(width)
    setVmHeight(height)
  }
  useEffect(() => {
    let vms = Mock.mock({
      status: 200,
      'dataSource|100-1000': [
        {
          'key|+1': 1,
          name: () => Random.cword(2, 5),
          'type|1': ['MANAGED', 'NOT_MANAGED'],
          'vmType|1': [false, 'NOT_MANAGED'],
          'state|1': ['MANAGED', 'STOPPED', 'ON', 'OFF', 'PAUSED', 'LOCKED']
        }
      ]
    })
    setVms(vms.dataSource)
  }, [])
  return (
    <Row className={styles.container}>
      <Col span={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="hex" style={{ background: 'green' }}>
        <svg id="HexagonalBinning" style={{ height: '100%' }} width={vmwidth} height={vmheight}>
          <HexagonalBinning data={vms} svgid="HexagonalBinning" setHeightWidth={setWidthHeight} />
        </svg>
      </Col>
      <Col span={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{}}>
        <Sphere></Sphere>
      </Col>
    </Row>
  )
}
