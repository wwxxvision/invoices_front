import User from '../classes/Models/User';

const inititalState = {
  modalShowing: false,
  userIsAuth: new User().isAuth,
  showingLoader: false,
  searchString: null,
  form: null,
  updateTable: false
};

export default inititalState;