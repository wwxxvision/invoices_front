import { Map, List  }  from  'immutable';

export default class ImmutableHelper {
  static getNewCopyNestedObject(object = {}, path = [], value = null) {
    const originalMap = Map(object);

    return originalMap.setIn(path, value);
  }

  static getCopyNestedObject(object = {}, path) {
    const originalMap = Map(object);

    return originalMap.getIn(path);
  }

  static getImmutableList(arr)  {
    return List(arr);
  }

  static getImmutableMap(arr)  {
    return Map(arr);
  }
}