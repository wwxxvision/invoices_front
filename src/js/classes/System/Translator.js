class Translator {
  translateKey(key) {
    switch (key) {
      case 'name':
        return 'имя';
      case 'address':
        return 'адрес';
      case 'client':
        return 'клиент';
      case 'city':
        return 'город';
      case 'country':
        return 'страна';
      case 'dateCreated':
        return 'дата создания';
      case 'uid':
        return 'id';
      default:
        return key;
    }
  }
}

export default new Translator();