import  CONFIG from '../../system/config';
import User from '../Models/User';

class Service {
  constructor() {
    this.serverUrl = CONFIG.SERVER_URL;
  }

  getting = async(path, headers, tokenNeed) => {
    if (tokenNeed) {
      headers = {...headers, 'Authorization': `Bearer ${new User().token}`};
    }

    return await fetch(this.serverUrl + path, {
      method: 'GET',
      headers
    })
    .then((res) => this.checkAuth(tokenNeed, res))
    .then(res => res.json());
  }

  post = async(path, body, headers, tokenNeed) => {
    if (tokenNeed) {
      headers = {...headers,  'Authorization': `Bearer ${new User().token}`};
    }

    return await fetch(
      this.serverUrl + path, {
      method: 'POST',
      body: JSON.stringify(body),
      headers
    })
    .then((res) => this.checkAuth(tokenNeed, res))
    .then(res => res.json());
  }

  update = async(path, body, headers, tokenNeed) => {
    if (tokenNeed) {
      headers = {...headers,  'Authorization': `Bearer ${new User().token}`};
    }

    return await fetch(
      this.serverUrl + path, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers
    })
    .then((res) => this.checkAuth(tokenNeed, res))
    .then(res => res.json());
  }

  delete = async(path, headers, tokenNeed) => {
    if (tokenNeed) {
      headers = {...headers, 'Authorization': `Bearer ${new User().token}`};
    }

    return await fetch(
      this.serverUrl + path, {
      method: 'DELETE',
      headers
    })
    .then((res) => this.checkAuth(tokenNeed, res))
    .then(res => res.json());
  }

  checkAuth(useToken, res) {
    if (useToken) {
      if (res.status === 401) {
        new User().logout();

        window.location.reload();
      }
    }

    return res;
  }
}

export default new Service();