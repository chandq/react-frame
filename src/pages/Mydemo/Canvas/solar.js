import React, { useState, useEffect, useRef } from 'react'
let sun
let earth
let moon
let ctx
function init() {
  sun = new Image()
  earth = new Image()
  moon = new Image()
  sun.src = require('@/assets/images/eclipse.jpg')
  sun.width = 100
  sun.height = 100
  earth.src = require('@/assets/images/earth.jpg')
  moon.src = require('@/assets/images/moon.jpg')

  let canvas = document.querySelector('#solar')
  ctx = canvas.getContext('2d')

  sun.onload = function () {
    draw()
  }
}
function draw() {
  ctx.clearRect(0, 0, 900, 900) //清空所有的内容
  /*绘制 太阳*/
  ctx.drawImage(sun, 0, 0, 900, 900)

  ctx.save()
  ctx.translate(450, 450)

  //绘制earth轨道
  ctx.beginPath()
  ctx.strokeStyle = 'rgba(255,255,0,0.5)'
  ctx.arc(0, 0, 300, 0, 2 * Math.PI)
  ctx.stroke()

  let time = new Date()
  //绘制地球
  ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds())
  ctx.translate(300, 0)
  ctx.drawImage(earth, -12, -12)

  //绘制月球轨道
  ctx.beginPath()
  ctx.strokeStyle = 'rgba(255,255,255,.3)'
  ctx.arc(0, 0, 40, 0, 2 * Math.PI)
  ctx.stroke()

  //绘制月球
  ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds())
  ctx.translate(40, 0)
  ctx.drawImage(moon, -3.5, -3.5)
  ctx.restore()

  requestAnimationFrame(draw)
}

export default function canvasAnimation(params) {
  useEffect(() => {
    setTimeout(() => {
      init()
    })
  }, [])
  return (
    <div>
      <canvas id="solar" width="900" height="900"></canvas>
    </div>
  )
}
