import Storage from '../System/Storage';

export default class User {
  constructor(token) {
    if (token) {
      Storage.add('token', token);
    }
  }

  get token() {
    return Storage.getValue('token');
  }

  logout() {
    Storage.remove('token');
  }

  get isAuth() {
    return Boolean(Storage.getValue('token'));
  }
}
