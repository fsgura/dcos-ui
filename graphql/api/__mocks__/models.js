import endpointsConnector from '../../data/EndpointsConnector';
import createStore from '../../store';

import Agents from '../agents/AgentModels';
import Frameworks from '../frameworks/FrameworkModels';
import Groups from '../groups/GroupModels';
import Tasks from '../tasks/TaskModels';

export default function models(mockEndpointData) {
  const endpoints = endpointsConnector(mockEndpointData);
  // Store is where we process and cache data like e.g. merged from marathon
  // and mesos. The store allows us to lazily process the data only once
  // for optimized lookups and minimal processing and is accessible by all
  // resolvers.
  const store = createStore(endpoints);

  return {
    Agents: new Agents({ store }),
    Frameworks: new Frameworks({ store }),
    Groups: new Groups({ store }),
    Tasks: new Tasks({ store })
  };
}
