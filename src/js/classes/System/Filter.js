import { uniqBy } from 'lodash';

class Filter {
  getResult(string, array) {
    let filteredArray = [];
    let arrCopy = [...array];
    arrCopy.forEach(item => {
      Object.keys(item).forEach(key => {
        if (typeof item[key] === 'string') {
          let thisUpper = item[key].toUpperCase();
          const matching = thisUpper.match(new RegExp(string.toUpperCase()), 'g');

          if (matching) {
            filteredArray.push(item);
          }
        }
      })
    });

    return uniqBy(filteredArray, 'id');
  }
}

export default new Filter();
