class Storage {
  add(key, value) {
    localStorage.setItem(key, value);
  }

  getValue(key) {
    return JSON.parse(JSON.stringify(localStorage.getItem(key)));
  }

  remove(key) {
    localStorage.removeItem(key);
  }
}

export default new Storage();

