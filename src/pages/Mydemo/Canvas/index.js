import React, { useState, useEffect, useRef } from 'react'
import Clock from '@/components/Clock'
import Solar from './solar'

export default function canvasAnimation(params) {
  return (
    <div>
      <Clock />
      <Solar />
    </div>
  )
}
