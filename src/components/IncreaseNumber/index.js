import React, { useEffect, useState, useRef } from 'react'
import styles from './style.less'

let timer = 0
const IncreaseNumber = props => {
  const { MAX_LEN = 5, alarmCount } = props
  const numberItemEl = useRef(null)
  const [computeNumber, setComputerNumber] = useState(['0', '0', '0', '9', '1', '7'])
  const [num, setNum] = useState(917)
  // console.log('init: ', num, computeNumber);
  const { dispatch } = props
  const [spinning, setSpinning] = useState(false)
  // useEffect(() => {
  // increaseNumber();
  // }, []);
  useEffect(() => {
    setComputerNumber(() => {
      const numStr = String(num).split('')
      if (numStr.length < MAX_LEN) {
        numStr.splice(0, 0, ...new Array(MAX_LEN - numStr.length).fill('0'))
      }
      console.log('alarmCount-num-compnumber: ', alarmCount, num, numStr)
      return numStr
    })
  }, [num])
  useEffect(() => {
    setNumberTransform()
  }, [computeNumber])
  useEffect(() => {
    setNum(alarmCount)
  }, [alarmCount])
  // 定时增长数字
  function increaseNumber() {
    timer = window.setInterval(() => {
      setNum(num => Math.round(num + Math.random() * (100 - 1) + 1))
    }, 3000)
  }
  // 设置每一位数字的偏移
  function setNumberTransform() {
    // const numberItems = numberItemEl.current;
    const numberItems = Array.from(document.querySelectorAll('.number-container i'))
    console.log('numberItemsEl: ', numberItems)
    const numberArr = computeNumber.filter(item => !Number.isNaN(item))
    for (let index = 0; index < numberItems.length; index++) {
      const elem = numberItems[index]
      elem.style.transform = `translate(0, -${numberArr[index] * 10}%)`
    }
  }

  return (
    <div className={`${styles.increaseNumber} number-container`}>
      <ul className="box-item">
        {computeNumber &&
          computeNumber.map((item, index) => (
            <li key={`number${index}`} className={!Number.isNaN(item) ? 'number-item' : ''}>
              {!Number.isNaN(item) ? (
                <span>
                  <i ref={numberItemEl}>0123456789</i>
                </span>
              ) : (
                <span>{item}</span>
              )}
            </li>
          ))}
      </ul>
    </div>
  )
}
export default IncreaseNumber
