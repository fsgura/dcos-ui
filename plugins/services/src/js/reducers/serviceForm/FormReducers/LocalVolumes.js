import {
  ADD_ITEM,
  REMOVE_ITEM,
  SET
} from '../../../../../../../src/js/constants/TransactionTypes';
import {parseIntValue} from '../../../../../../../src/js/utils/ReducerUtil';

module.exports = {
  FormReducer(state = [], {type, path, value}) {
    if (path == null) {
      return state;
    }

    const joinedPath = path.join('.');

    if (joinedPath.search('localVolumes') !== -1) {
      if (joinedPath === 'localVolumes') {
        switch (type) {
          case ADD_ITEM:
            state.push({containerPath: null, size: null, mode: 'RW'});
            break;
          case REMOVE_ITEM:
            state = state.filter((item, index) => {
              return index !== value;
            });
            break;
        }

        return state;
      }

      const index = joinedPath.match(/\d+/)[0];
      if (type === SET && `localVolumes.${index}.type` === joinedPath) {
        state[index].type = String(value);
      }
      if (type === SET && `localVolumes.${index}.size` === joinedPath) {
        state[index].size = parseIntValue(value);
      }
      if (type === SET && `localVolumes.${index}.mode` === joinedPath) {
        state[index].mode = String(value);
      }
      if (type === SET && `localVolumes.${index}.containerPath` === joinedPath) {
        state[index].containerPath = String(value);
      }
      if (type === SET && `localVolumes.${index}.hostPath` === joinedPath) {
        state[index].hostPath = String(value);
      }
    }

    return state;
  }
};
