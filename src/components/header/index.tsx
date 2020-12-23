import React, { memo } from 'react'

import { HeaderWrapper } from './style'

export default memo(function Header() {
  return (
    <HeaderWrapper>
      <h1>Header</h1>
    </HeaderWrapper>
  )
})
