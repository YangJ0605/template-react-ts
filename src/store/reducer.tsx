import * as actionTypes from './constant'
import { ActionTypes } from './actionCreator'

export type State = {
  username: string
}

const initialState: State = {
  username: 'deeproute',
}

const reducer = (state = initialState, action: ActionTypes): State => {
  switch (action.type) {
    case actionTypes.CHANGE_UESR_NAME:
      return {
        ...state,
        username: action.username,
      }
    default:
      return state
  }
}

export default reducer
