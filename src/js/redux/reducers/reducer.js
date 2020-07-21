import initialState from '../initialState';
import { Map, fromJS  }  from  'immutable';

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_MODAL':
      return Object.assign({}, state, {
        modalShowing: action.options
      });
    case 'SET_USER_STATUS':
      return Object.assign({}, state, {
        userIsAuth: action.status
      })
    case 'SETUP_FIELD':
      return Object.assign({}, state, {
        [action.key]: action.value
      })
    case 'INITIAL_FORM':
      state = Map(state);
      return state.setIn(['form'], fromJS(action.formData)).toJS();
    case 'UDPATE_GROUP':
      state = Map(state);
      return state.setIn(['form', action.keyField], fromJS(action.newGroup)).toJS();
    default:
      return state
  }
}