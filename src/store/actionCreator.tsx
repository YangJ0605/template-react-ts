import { ThunkAction } from 'redux-thunk'
import * as actionTypes from './constant'
import { State } from './reducer'

export const changeUsernameAction = (username: string): ChangeUserNameAction => ({
  type: actionTypes.CHANGE_UESR_NAME,
  username,
})

export const changexxxxAction = (): ChangexxxxAction => ({
  type: actionTypes.CHANGE_XXXX_XXXX,
})

export const getChangeUserNameAction = (): ThunkResult<void> => {
  return (dispatch, getState) => {
    const { username } = getState()
    setTimeout(() => {
      console.log(username)
      dispatch(changeUsernameAction(`${username} change`))
    }, 1000)
  }
}

// type 类型

type ChangeUserNameAction = {
  type: typeof actionTypes.CHANGE_UESR_NAME
  username: string
}

type ChangexxxxAction = {
  type: typeof actionTypes.CHANGE_XXXX_XXXX
}

type ThunkResult<R> = ThunkAction<R, State, undefined, ActionTypes>

export type ActionTypes = ChangeUserNameAction | ChangexxxxAction
