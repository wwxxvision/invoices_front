import Service from '../System/Service';

export default class Base {
  constructor(url) {
    this.url = url;
  }

  create(body) {
    return new Promise((resolve, reject) => {
      const headers = {
        'Content-type': 'application/json'
      };

      Service.post(`/${this.url}/create`, body, headers, true)
        .then(resolve)
        .catch(reject)
    })
  }

  update(body) {
    return new Promise((resolve, reject) => {
      const headers = {
        'Content-type': 'application/json'
      };

      Service.update(`/${this.url}/update/${body.id}`, body, headers, true)
        .then(resolve)
        .catch(reject)
    })
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      const headers = {
        'Content-type': 'application/json'
      };

      Service.delete(`/${this.url}/delete/${id}`,headers, true)
        .then(resolve)
        .catch(reject)
    })
  }

  modified(data) {
    return data;
  }
}