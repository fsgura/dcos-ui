import {JSONReducer as container} from './serviceForm/Container';
import {JSONReducer as containers} from './serviceForm/Containers';
import {JSONReducer as env} from './serviceForm/EnvironmentVariables';
import {JSONReducer as labels} from './serviceForm/Labels';
import {JSONReducer as healthChecks} from './serviceForm/HealthChecks';
import {
  simpleFloatReducer,
  simpleIntReducer,
  simpleReducer
} from '../../../../../src/js/utils/ReducerUtil';

module.exports = {
  id: simpleReducer('id'),
  instances: simpleIntReducer('instances'),
  container,
  containers,
  cpus: simpleFloatReducer('cpus'),
  mem: simpleIntReducer('mem'),
  disk: simpleIntReducer('disk'),
  cmd: simpleReducer('cmd'),
  env,
  labels,
  healthChecks
};
