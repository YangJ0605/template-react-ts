import React, { memo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { State } from '@/store/reducer'
import { changeUsernameAction, getChangeUserNameAction } from '@/store/actionCreator'

import { Button, Col, Row, Tag } from 'antd'
import { HomeWrapper } from './style'

export default memo(function Home() {
  const dispatch = useDispatch()
  const { username } = useSelector(
    (state: State) => ({
      username: state.username,
    }),
    shallowEqual,
  )

  const history = useHistory()
  const handleClickToAbout = useCallback(() => {
    history.push('/about')
  }, [history])
  return (
    <HomeWrapper>
      this is home page
      <Row>
        <Col offset={1}>
          <Button onClick={handleClickToAbout}>To About</Button>
        </Col>
        <div>
          username:<Tag color='success'>{username}</Tag>
          <div>
            <Button
              onClick={(_) => {
                dispatch(changeUsernameAction(username + Math.floor(Math.random() * 5)))
              }}
            >
              change username
            </Button>
            <Button
              onClick={(_) => {
                dispatch(getChangeUserNameAction())
              }}
            >
              async change username
            </Button>
          </div>
        </div>
      </Row>
    </HomeWrapper>
  )
})
