import React, { memo } from 'react'

import { formatTime } from '@/utils/formatTime'

import { Tag } from 'antd'
import { AboutWrapper } from './style'

export default memo(function About() {
  return (
    <AboutWrapper>
      this is about page11112222
      <div>
        <Tag color='success'>{formatTime()}</Tag>
      </div>
    </AboutWrapper>
  )
})
