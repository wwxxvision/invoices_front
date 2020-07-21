export default class DispatchWrapper {
  constructor(dispatch) {
    this.dispatch = dispatch;
  }

  makeAction(type, state) {
    this.dispatch({type, ...state});
  }
}
